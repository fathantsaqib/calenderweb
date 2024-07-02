import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/Api";
import { EventContext } from "../context/EventContext";
import "./event.css";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    user_id: "",
    judul: "",
    deskripsi: "",
    tanggal: "",
    tempat: "",
  });

  const { addEvent } = useContext(EventContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to create an event");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      if (!token) {
        alert("You need to be logged in to create an event");
        return;
      }
      if (!userId) {
        alert("User ID not found");
        return;
      }
      const eventDataWithUserId = { ...eventData, user_id: userId };
      console.log("Event Data:", eventDataWithUserId);
      await createEvent(eventDataWithUserId);
      addEvent(eventDataWithUserId); // Tambahkan event ke context
      alert("Event created successfully");
      navigate("/home"); // Arahkan ke halaman Home setelah event dibuat
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  return (
    <div className="create-event-container">
      <button className="back-button" onClick={() => navigate('/home')}>Back</button>
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="judul" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" name="deskripsi" onChange={handleChange}></input>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="datetime-local"
            name="tanggal"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Place:</label>
          <input type="text" name="tempat" onChange={handleChange} />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
