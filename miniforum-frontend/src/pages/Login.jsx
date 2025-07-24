// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new URLSearchParams();
    data.append("username", formData.username);
    data.append("password", formData.password);

    try {
      const res = await axios.post("https://miniforum.onrender.com/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("Login success:", res.data);

      // Save token
      localStorage.setItem("token", res.data.access_token);

      // Redirect to home/profile
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
