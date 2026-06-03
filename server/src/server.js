const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const registerSocketHandlers = require("./socketHandlers");
const { rooms } = require("./roomManager");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("BlinkChat Server Running");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

registerSocketHandlers(io);
setInterval(() => {

    const now = Date.now();

    for (const roomId in rooms) {

        const room = rooms[roomId];

        const inactiveFor =
            now - room.lastActivity;

        const fiveMinutes =
            5 * 60 * 1000;

        if (
            inactiveFor >
            fiveMinutes
        ) {

            io.to(roomId).emit(
                "room-ended"
            );

            delete rooms[roomId];

            console.log(
                `Deleted inactive room: ${roomId}`
            );
        }
    }

}, 60 * 1000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});