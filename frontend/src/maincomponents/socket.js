
import { io } from "socket.io-client";

const rawUrl = import.meta.env.VITE_API_URL;
const backendUrl =
  rawUrl && !rawUrl.includes("onrender.com") && !rawUrl.includes("localhost:5000")
    ? rawUrl
    : (typeof window !== "undefined" ? window.location.origin : "");

const socket = io(backendUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;

// lts set with backend url 