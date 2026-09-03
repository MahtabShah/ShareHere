// Centralized API configuration that safely falls back to relative URLs ("")
// when running on Cloud Run, AI Studio preview, or when external URLs fail CORS.
export const API = import.meta.env.VITE_API_URL;

export default API;
