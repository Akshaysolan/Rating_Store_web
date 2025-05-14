import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stores';

export const getStores = () => {
  return axios.get(API_URL, { withCredentials: true });
};

export const getFilteredStores = (filters) => {
  return axios.get(`${API_URL}/filter`, { 
    params: filters,
    withCredentials: true 
  });
};

export const createStore = (storeData) => {
  return axios.post(API_URL, storeData, { withCredentials: true });
};

export const submitRating = (storeId, rating) => {
  return axios.post(
    `${API_URL}/rate`,
    { storeId, rating },
    { withCredentials: true }
  );
};

export const getStoreRatings = () => {
  return axios.get(`${API_URL}/ratings`, { withCredentials: true });
};

export const getDashboardStats = () => {
  return axios.get(`${API_URL}/dashboard`, { withCredentials: true });
};