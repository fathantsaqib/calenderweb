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
  localStorage.removeItem('user'); // Remove user data
  localStorage.removeItem('user_id'); // Remove user_id
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
    console.error('Error creating note:', error.response ? error.response.data : error.message);
    throw error;
  }
};
