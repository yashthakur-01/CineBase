const env = import.meta.env as Record<string, string | undefined>;

export const API_BASE =
    env.VITE_BACKEND_URL || env.BACKEND_URL || "http://localhost:3000/api";
