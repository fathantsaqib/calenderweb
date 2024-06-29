//Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../services/authService'; // Import authService functions

function Navbar() {
  const handleLogout = () => {
    logout(); // Call logout function from authService
    // Optionally: Redirect or perform additional cleanup
  };

  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        {isAuthenticated() ? (
          <>
            <li><Link to="/createevent">Add Event</Link></li>
            <li><Link to="/rating">Rating</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;