import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from "../services/Api";
import "./register.css"; // Make sure the path matches your project structure

const Register = () => {
  const [userData, setUserData] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      alert("User registered successfully");
      navigate("/login"); // Navigate to login page after successful registration
    } catch (error) {
      console.error(error);
      if (error.response) {
        // Server error with status code other than 2xx
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        // No response from server
        console.error("No response from server:", error.request);
      } else {
        // Other errors
        console.error("Error:", error.message);
      }
      alert("Error registering user");
    }
  };

  return (
    <div className="register-container">
      <div className="logoreg">
        <img src="youdo.png" alt="Logo" />
      </div>
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="nama" onChange={handleChange} required />
          </div>
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
          <button type="submitReg">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
