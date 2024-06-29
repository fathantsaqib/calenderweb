const TOKEN_KEY = 'token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Check if token exists
};

// Example function to fetch user details if needed
export const getUser = async () => {
  // Implement as needed, fetch user details from API
};