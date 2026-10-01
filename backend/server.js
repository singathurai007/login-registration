const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("./db");
const verifyToken = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// JWT token உருவாக்கும் function
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

// Home route
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

// Database test
app.get("/api/test-db", async (req, res) => {
    try {
        await pool.query("SELECT NOW()");
        res.json({ message: "PostgreSQL connected successfully" });
    } catch (error) {
        res.status(500).json({ message: "Database connection failed" });
    }
});

// Register API
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = generateToken(user);

        res.status(201).json({
            message: "Registration successful",
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Login failed"
        });
    }
});

// Protected route: Login ஆன user தகவல்
app.get("/api/me", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});