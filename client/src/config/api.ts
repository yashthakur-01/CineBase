import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

// In production, defaults to "/api" which goes through Vercel's proxy rewrite.
// Locally, .env sets this to "http://localhost:3000/api".
export const API_BASE = backendUrl || "/api";

axios.defaults.withCredentials = true;

