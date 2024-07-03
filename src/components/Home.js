import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { EventContext } from "../context/EventContext";
import { createNote, getEvents, getNotes } from "../services/Api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";


const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [username, setUsername] = useState("");
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [eventsSelected, setEventsSelected] = useState([]);
  const [notesList, setNotesList] = useState([]);
  const navigate = useNavigate();

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleNoteSubmit = async () => {
    try {
      const response = await createNote({
        user_id: userId, 
        catatan: note,
      });
      if (response) {
        setNote("");
        setNotesList([{ catatan: note }]);
        console.log("Catatan berhasil dikirim");
      }
    } catch (error) {
      console.error("Gagal mengirim catatan", error);
    }
  };

  useEffect(() => {
    renderCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    try {
      getEvents().then((value) => {
        setEventsList(value);
      });
      getNotes().then((notes) => {
        const userNotes = notes.filter(note => note.user_id === userId);
        setNotesList(userNotes);
      });
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.user_id) {
        setUsername(user.nama || "");
        setUserId(user.user_id);
      } else {
        setUsername("");
        setUserId(null);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      setUsername("");
      setUserId(null);
    }
  }, [userId]);

  const renderCalendar = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push("");
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    setDays(calendarDays);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  const handleAdd = () => {
    navigate("/createevent");
  };

  const handleReview = () => {
    navigate("/review");
  };

  const handlePersonalTask = () => {
    navigate("/personaltask");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    console.log("Logout berhasil");
    navigate("/");
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    }
  };

  useEffect(() => {
    if (selectedDate == null) return;
    // eventsList.forEach((event) => {console.log(event.tanggal)});

    // setEventsSelected(
    //   eventsList.find(
    //     (event) =>
    //       event.user_id.toString() ===
    //         localStorage.getItem("user_id").toString() &&
    //       new Date(event.tanggal).getDate() === selectedDate.getDate() &&
    //       new Date(event.tanggal).getMonth() === selectedDate.getMonth() &&
    //       new Date(event.tanggal).getFullYear() === selectedDate.getFullYear() && console.log(event.tanggal) && console.log(selectedDate)
    //   )
    // );

    const userId = localStorage.getItem("user_id");

    setSelectedDate(selectedDate);

    const filteredEvents = eventsList.filter((event) => {
      const eventDate = new Date(event.tanggal);
      eventDate.setHours(eventDate.getHours() - 8);
      return (
        event.user_id.toString() === userId.toString() &&
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    setEventsSelected(filteredEvents);
  }, [selectedDate, eventsList]);
  // const isEventOnSelectedDate = (event) => {
  //   if (!selectedDate) return false;
  //   const eventDate = new Date(event.tanggal);
  //   return (
  //     eventDate.getDate() === selectedDate.getDate() &&
  //     eventDate.getMonth() === selectedDate.getMonth() &&
  //     eventDate.getFullYear() === selectedDate.getFullYear()
  //   );
  // };

  // const selectedEvent = events.find(isEventOnSelectedDate);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };

  return (
    <div className="home-container">
      <div className="username">{username}</div>
      <button className="logout-button" onClick={handleLogout}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.5 24 9.9zM256 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM256 320c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM256 192c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32z"></path>
          </svg>
        </div>
        <div className="text">Logout</div>
      </button>
      <div className="container">
        <div className="left-panel">
          {eventsSelected.length > 0 ? (
            <Slider {...settings}>
              {eventsSelected.map((event, index) => (
                <div key={index} className="event-carousel">
                  <h2>{event.judul}</h2>
                  <p>{event.deskripsi}</p>
                  <p>{event.tanggal}</p>
                  <p>{event.tempat}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <>
              <h2>No Event</h2>
              <p>Select a date to see event details</p>
            </>
          )}
          <input
            type="text"
            placeholder="Catatan"
            value={note}
            onChange={handleNoteChange}
          />
          <div className="notes-box">
          <h3>Catatan</h3>
          <div className="notes-list">
            {notesList.map((note, index) => (
              <p key={index}>{note.catatan}</p>
            ))}
          </div>
        </div>
          <button onClick={handleNoteSubmit}>Kirim Catatan</button>
          <div className="button-group">
            <button className="addbutton" onClick={handleAdd}>
              <span>add event</span>
            </button>
            <button className="reviewbutton" onClick={handleReview}>
              <span>review</span>
            </button>
          </div>
          <button className="taskbutton" onClick={handlePersonalTask}>Cek Personal Tasks</button>
        </div>
        <div className="right-panel">
          <h3>Which time works best?</h3>
          <div className="calendar">
            <div className="calendar-header">
              <div className="arrow" onClick={handlePrevMonth}></div>{" "}
              <span>{`${new Date(currentYear, currentMonth).toLocaleString(
                "default",
                { month: "long" }
              )} ${currentYear}`}</span>
              <div className="arrow" onClick={handleNextMonth}></div>{" "}
            </div>
            <div className="calendar-grid">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`day ${
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    currentMonth === selectedDate.getMonth() &&
                    currentYear === selectedDate.getFullYear()
                      ? "today"
                      : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Home;
