import { io } from "socket.io-client";

const socket = io(
    "https://blinkchat-i6t8.onrender.com",
    {
        autoConnect: true,
    }
);

export default socket;