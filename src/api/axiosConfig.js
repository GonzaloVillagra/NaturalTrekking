import axios from 'axios';

// Configura la instancia de Axios
const axiosInstance = axios.create({

  baseURL:'https://tqyvpdjbqxwenmuuzhul.supabase.co',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 