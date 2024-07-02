import React, { useState, useEffect } from "react"; // Tambahkan useContext
import { useNavigate } from "react-router-dom";
// import { EventContext } from "../context/EventContext"; // Tambahkan import EventContext
import { createNote, getEvents } from "../services/Api"; // Tambahkan import createNote
import "./home.css";

const Home = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Tambahkan state untuk menyimpan tanggal yang dipilih
  const [username, setUsername] = useState(""); // Tambahkan state untuk menyimpan nama pengguna
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [eventsSelected, setEventsSelected] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const navigate = useNavigate();
  // const { events } = useContext(EventContext); // Gunakan useContext untuk mendapatkan events

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleNoteSubmit = async () => {
    try {
      const response = await createNote({
        user_id: userId, // Kirim user_id
        catatan: note, // Sesuaikan nama properti menjadi catatan
      });
      if (response) {
        setNote(""); // Kosongkan inputan setelah catatan berhasil dikirim
        setNotesList((prevNotes) => [...prevNotes, note]);
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
        console.log(value);
        setEventsList(value);
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
  }, []);

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

  const handleLogout = () => {
    // Logika untuk logout
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Hapus data pengguna dari localStorage
    console.log("Logout berhasil");
    navigate("/");
  };

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(new Date(currentYear, currentMonth, day));
      // console.log(Date(currentYear, currentMonth, day))
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

    const filteredEvents = eventsList.find((event) => {
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

  return (
    <div className="home-container">
      <button className="logout-button" onClick={handleLogout}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.5 24 9.9zM256 32c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM256 320c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM256 192c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32z"></path>
          </svg>
        </div>
        Logout
      </button>
      <div className="profile">
        <span className="username">{username}</span>{" "}
        {/* Tampilkan nama pengguna */}
        {/* <button className="logout-button" onClick={handleLogout}>
          Logout
        </button> */}
      </div>
      <div className="container">
        <div className="left-panel">
          {eventsSelected ? (
            <>
              <h2>{eventsSelected.judul}</h2>
              <p>{eventsSelected.deskripsi}</p>
              <p>{eventsSelected.tanggal}</p>
              <p>{eventsSelected.tempat}</p>
            </>
          ) : (
            <>
              <h2>No Event</h2>
              <p>Select a date to see event details</p>
            </>
          )}
          <select>
            <option>completed</option>
            <option>on progress</option>
            <option>not yet started</option>
          </select>
          <input
            type="text"
            placeholder="Catatan"
            value={note}
            onChange={handleNoteChange}
          />
          <button onClick={handleNoteSubmit}>Kirim Catatan</button>
          <div className="button-group">
            <button className="addbutton" onClick={handleAdd}>
              <span>add event</span>
            </button>
            <button className="reviewbutton" onClick={handleReview}>
              <span>review</span>
            </button>
          </div>
          <div className="notes-list">
            {notesList.map((note, index) => (
              <p key={index}>{note}</p>
            ))}
          </div>
        </div>
        <div className="right-panel">
          <h3>Which time works best?</h3>
          <div className="calendar">
            <div className="calendar-header">
              <div className="arrow" onClick={handlePrevMonth}></div>{" "}
              {/* Ubah tombol sebelumnya */}
              <span>{`${new Date(currentYear, currentMonth).toLocaleString(
                "default",
                { month: "long" }
              )} ${currentYear}`}</span>
              <div className="arrow" onClick={handleNextMonth}></div>{" "}
              {/* Ubah tombol sebelumnya */}
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
