import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = (email, password) => {
  return axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
};

export const register = (name, email, password, address) => {
  return axios.post(
    `${API_URL}/register`,
    { name, email, password, address },
    { withCredentials: true }
  );
};

export const logout = () => {
  return axios.post(
    `${API_URL}/logout`,
    {},
    { withCredentials: true }
  );
};

export const getCurrentUser = () => {
  return axios.get(`${API_URL}/me`, { withCredentials: true });
};

export const changePassword = (currentPassword, newPassword) => {
  return axios.post(
    `${API_URL}/change-password`,
    { currentPassword, newPassword },
    { withCredentials: true }
  );
};