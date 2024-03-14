import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Important: This will include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;
