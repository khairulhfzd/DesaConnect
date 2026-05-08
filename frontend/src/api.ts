import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://desaconnect.my.id/api',
});


export default api;
