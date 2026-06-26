import { io } from "socket.io-client";

// Single Socket.io client instance for the application.
const socket = io("http://localhost:5000");

export default socket;