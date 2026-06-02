import axios from 'axios';

// Configura la instancia de Axios
const axiosInstance = axios.create({

  baseURL: 'https://api.profegonza.online',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;