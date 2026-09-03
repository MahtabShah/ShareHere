// Centralized API configuration that safely falls back to relative URLs ("")
// when running on Cloud Run, AI Studio preview, or when external URLs fail CORS.
const rawApi = import.meta.env.VITE_API_URL;

export const API =
  rawApi &&
  !rawApi.includes("onrender.com") &&
  !rawApi.includes("localhost:5000")
    ? rawApi
    : "";

export default API;
