import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = () => {
  return axios.get(API_URL, { withCredentials: true });
};

export const getFilteredUsers = (filters) => {
  return axios.get(`${API_URL}/filter`, { 
    params: filters,
    withCredentials: true 
  });
};

export const createUser = (userData) => {
  return axios.post(API_URL, userData, { withCredentials: true });
};

export const getUserDetails = (userId) => {
  return axios.get(`${API_URL}/${userId}`, { withCredentials: true });
};