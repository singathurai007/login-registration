
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    async function getUser() {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/", { replace: true });
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <h2>Unable to load user details.</h2>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;