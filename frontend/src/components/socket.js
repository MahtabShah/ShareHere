import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // change to your server URL in prod

export default socket;
