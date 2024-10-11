import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // URL del backend Flask
});

// Interceptor para añadir el token JWT automáticamente en todas las solicitudes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token JWT de localStorage
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Añade el token a las cabeceras
  }

  return config; // Devuelve la configuración actualizada con el token
}, (error) => {
  return Promise.reject(error); // En caso de error, rechaza la promesa
});

export default API;