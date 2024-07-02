import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './task.module.css'; // Import CSS

const PersonalTaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/api/personaltasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tasks!', error);
      });
  }, []);

  return (
    <div className="container">
      <h1>Personal Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <h2>{task.task_description}</h2>
            <p><span>Due Date:</span> {new Date(task.due_date).toLocaleDateString()}</p>
            <p><span>Status:</span> {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalTaskList;