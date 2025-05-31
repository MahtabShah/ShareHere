import { io } from 'socket.io-client';
const API = import.meta.env.VITE_API_URL;

import { io } from "socket.io-client";

const socket = io("https://sharequeot.onrender.com", {
  withCredentials: true
});
// change to your server URL in production

export default socket;
