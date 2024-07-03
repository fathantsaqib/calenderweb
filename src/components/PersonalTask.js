import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getTasks, createTask, updateTask, deleteTask } from '../services/Api'; // Import getTasks dan createTask dari Api.js
import './task.module.css'; // Import CSS

const PersonalTaskList = () => {
  const [tasks, setTasks] = useState([]); 
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [dueDate, setDueDate] = useState('');
  const [editTaskId, setEditTaskId] = useState(null); // State untuk mengedit tugas

  const navigate = useNavigate();

  const fetchTasks = () => {
    getTasks()
      .then(response => {
        setTasks(response);
      })
      .catch(error => {
        console.error('There was an error fetching the tasks!', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to create an event");
      navigate("/login");
    }
    fetchTasks();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deskripsi') {
      setTaskDescription(value);
    } else if (name === 'status') {
      setStatus(value);
    } else if (name === 'dueDate') {
      setDueDate(value);
    }
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
      const newTask = {
        user_id: userId,
        task_description: taskDescription,
        status: status,
        due_date: new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ') // Convert to ISO string and remove milliseconds
      };
      if (editTaskId) {
        await updateTask(editTaskId, newTask);
        setEditTaskId(null);
      } else {
        await createTask(newTask);
      }
      fetchTasks(); // Refresh task list
      setTaskDescription('');
      setStatus('Not Started');
      setDueDate('');
      alert("Task saved successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Error saving task");
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task.task_id);
    setTaskDescription(task.task_description);
    setStatus(task.status);
    setDueDate(new Date(task.due_date).toISOString().slice(0, 16)); // Set datetime-local value
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks(); // Refresh task list
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    return date.toLocaleString();
  };

  return (
    <div className="task-container">
      <div className="create-task-wrapper">
        <button className="back-button" onClick={() => navigate('/home')}>Back</button>
        <div className="create-task-container">
          <h1>{editTaskId ? "Edit Task" : "Create Task"}</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="taskDescription">Task Description:</label>
              <input
                type="text"
                name="deskripsi"
                value={taskDescription}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={handleChange}
                required
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">{editTaskId ? "Update" : "Submit"}</button>
          </form>
        </div>
      </div>
      <div className="personal-tasks-container">
        <h1>Personal Tasks</h1>
        <ul>
          {tasks.map(task => (
            <li key={task.task_id} className="task-item">
              <h2>{task.task_description}</h2>
              <p><span>Due Date:</span> {formatDueDate(task.due_date)}</p> {/* Menampilkan tanggal dan waktu dengan pengurangan 8 jam */}
              <p><span>Status:</span> {task.status}</p>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.task_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonalTaskList;