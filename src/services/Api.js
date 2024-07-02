import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // adjust as needed
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (user) {
      config.headers['User-Info'] = user; // Add user information to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => {
  return axiosInstance.post('/register', userData);
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/login', userData);
    console.log("API login response:", response.data); // Tambahkan log
    localStorage.setItem('token', response.data.access_token);
    
    if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_id', response.data.user.user_id); // Set user_id in localStorage
    } else {
        localStorage.removeItem('user');
        localStorage.removeItem('user_id'); // Remove user_id from localStorage
    }

    return response;
  } catch (error) {
    console.error("API login error:", error);
    throw error;
  }
};


export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_id');
  return axiosInstance.post('/logout');
};

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getEvents = async () => {
  const response = await axiosInstance.get('/events');
  return response.data;
};

export const createNote = async (noteData) => {
  try {
    const response = await axiosInstance.post('/notes', noteData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      const response = await axiosInstance.put('/notes', noteData);
      return response.data;
    }
    console.error('Error creating or updating note:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getNotes = async () => {
  const response = await axiosInstance.get('/notes');
  return response.data;
};

export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error.response ? error.response.data : error.message);
    throw error;
  }
};

<<<<<<< Updated upstream
export const getNotes = async () => {
  const response = await axiosInstance.get('/notes');
  return response.data;
};

export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error.response ? error.response.data : error.message);
=======
export const getReview = async () => {
  const response = await axiosInstance.get('/reviews');
  return response.data;
};

export const getTasks = async () => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error.response ? error.response.data : error.message);
>>>>>>> Stashed changes
    throw error;
  }
};

<<<<<<< Updated upstream
export const getReviews = async () => {
  const response = await axiosInstance.get('/reviews');
  return response.data;
=======
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error.response ? error.response.data : error.message);
    throw error;
  }
>>>>>>> Stashed changes
};