import { io } from "socket.io-client";
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const socket = io(allowedOrigin, {
  transports: ["websocket"], // optional, but better than polling
  withCredentials: true,
});

export default socket;
