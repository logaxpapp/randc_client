

// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    localStorage.setItem('jwtToken', response.data.jwtToken);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchProtectedData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetching protected data failed:', error.response);
    throw error;
  }
};
