// import { io } from "socket.io-client";

// // ✅ Correct way for Vite
// const allowedOrigin = import.meta.env.FRONTEND_URL || "http://localhost:5173";

// const socket = io(allowedOrigin, {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// export default socket;
import { io } from "socket.io-client";

// ✅ Backend server, not frontend
const allowedOrigin = import.meta.env.VITE_API_URL || "http://localhost:5001";

const socket = io(allowedOrigin, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
