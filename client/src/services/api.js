import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

export const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
