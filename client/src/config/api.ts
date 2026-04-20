const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

if (import.meta.env.PROD && !backendUrl) {
    throw new Error(
        "Missing VITE_BACKEND_URL. Set it in your frontend environment variables before deploying."
    );
}

export const API_BASE = backendUrl || "http://localhost:3000/api";
