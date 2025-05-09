import axios from "axios";


export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/tasks`,
  headers: {
    "Content-Type": "application/json",
  },
});