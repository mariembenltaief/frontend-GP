import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- ici on ajoute /api/users
  headers: {
    'Content-Type': 'application/json',
  },
});
