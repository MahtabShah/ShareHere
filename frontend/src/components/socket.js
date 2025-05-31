
import { io } from "socket.io-client";

const socket = io("https://sharequeot.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;

// lts set with backend url :)