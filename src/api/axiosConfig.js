import axios from 'axios';

// Configura la instancia de Axios
const axiosInstance = axios.create({

  baseURL:'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 