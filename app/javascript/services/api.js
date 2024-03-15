import axios from 'axios';

const Api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, // Important: This will include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;
