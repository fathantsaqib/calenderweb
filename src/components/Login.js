import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/Api";
import "./login.css"; 

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(userData);
      console.log("Login response:", response.data); // Tambahkan log
      if (response.data && response.data.user) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Simpan user data ke localStorage
        localStorage.setItem("user_id", response.data.user.user_id); // Simpan user_id ke localStorage
        alert("Logged in successfully");
        navigate("/home");
      } else {
        console.error("Login response does not contain user data");
        alert("Login failed: No user data received");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <div className="logo">
        <img src="youdo.png" alt="Logo" />
      </div>
      <div className="form-container">
        <h2>Welcome to you.do...!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-footer">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <div>
              <span>Don't have an account? </span>
              <a href="/register">Register here</a>
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
