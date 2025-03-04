import axios from 'axios';

// Configura la instancia de Axios
const axiosInstance = axios.create({

  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 