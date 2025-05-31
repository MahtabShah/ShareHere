
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_API_URL || "https://sharequeot.onrender.com"

const socket = io(backendUrl, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;

// lts set with backend url 