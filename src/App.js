//App.js

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateEvent from "./components/CreateEvent";
import Main from "./components/Main";
import Review from "./components/Review";
import { isAuthenticated } from "./services/authService";
import { EventProvider } from './context/EventContext'; // Pastikan jalur ini benar

const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ from: rest.location }} />
  );
};

function App() {
  return (
    <div className="App">
      <EventProvider> {/* Bungkus Routes dengan EventProvider */}
        <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} /> 
          <Route path="/main" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/review" element={<Review />} />
          <Route path="/createevent" element={<ProtectedRoute element={<CreateEvent />} />} />
        </Routes>
      </EventProvider>
    </div>
  );
}

export default App;