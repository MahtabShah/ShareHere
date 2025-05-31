import { io } from 'socket.io-client';
const API = import.meta.env.VITE_API_URL;

const socket = io(API); // change to your server URL in production
export default socket;
