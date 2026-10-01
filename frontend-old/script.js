// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            document.getElementById("registerMessage").textContent =
                data.message;

            if (response.ok) {
                registerForm.reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }

        } catch (error) {

            console.error(error);

            document.getElementById("registerMessage").textContent =
                "Server connection failed";
        }

    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            document.getElementById("loginMessage").textContent =
                data.message;

            if (response.ok) {

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                // Go to dashboard
                window.location.href = "dashboard.html";
            }

        } catch (error) {

            console.error(error);

            document.getElementById("loginMessage").textContent =
                "Server connection failed";
        }

    });
}