import { io } from 'socket.io-client';

const socket = io('https://sharehere-2ykp.onrender.com'); // change to your server URL in prod

export default socket;
