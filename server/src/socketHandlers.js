const {
    createRoom,
    joinRoom,
    removeUser,
    getRoom,
    addMessage,
    deleteRoom,
} = require("./roomManager");

function registerSocketHandlers(io) {

    io.on("connection", (socket) => {

        console.log(
            `Connected: ${socket.id}`
        );

        // CREATE ROOM
        socket.on(
            "create-room",
            ({ name }, callback) => {

                const room =
                    createRoom(
                        socket.id,
                        name
                    );

                socket.join(
                    room.roomId
                );

                callback({
                    success: true,
                    roomId:
                        room.roomId,
                    password:
                        room.password,
                    ownerName:
                        room.ownerName,
                });
            }
        );

        // JOIN ROOM
        socket.on(
            "join-room",
            (
                {
                    roomId,
                    password,
                    name,
                },
                callback
            ) => {

                const result =
                    joinRoom(
                        roomId,
                        password,
                        socket.id,
                        name
                    );

                if (
                    !result.success
                ) {

                    callback(
                        result
                    );

                    return;
                }

                socket.join(
                    roomId
                );

                io.to(
                    roomId
                ).emit(
                    "members-updated",
                    result.room.users
                );

                io.to(
                    roomId
                ).emit(
                    "messages-updated",
                    result.room.messages
                );

                callback({
                    success: true,
                    room:
                        result.room,
                });
            }
        );

        // GET ROOM DATA
        socket.on(
            "get-room-data",
            (
                { roomId },
                callback
            ) => {

                const room =
                    getRoom(
                        roomId
                    );

                if (!room) {

                    callback({
                        success: false,
                    });

                    return;
                }

                callback({
                    success: true,
                    users:
                        room.users,
                    messages:
                        room.messages,
                    ownerName:
                        room.ownerName,
                });
            }
        );

        // SEND MESSAGE
        socket.on(
            "send-message",
            ({
                roomId,
                sender,
                text,
            }) => {

                const message =
                    addMessage(
                        roomId,
                        sender,
                        text
                    );

                if (!message)
                    return;

                const room =
                    getRoom(
                        roomId
                    );

                if (!room)
                    return;

                io.to(
                    roomId
                ).emit(
                    "messages-updated",
                    room.messages
                );
            }
        );

        // END ROOM
        socket.on(
            "end-room",
            ({ roomId }) => {

                io.to(
                    roomId
                ).emit(
                    "room-ended"
                );

                deleteRoom(
                    roomId
                );
            }
        );

        // DISCONNECT
        socket.on(
            "disconnect",
            () => {

                removeUser(
                    socket.id,
                    (roomId) => {

                        const room =
                            getRoom(
                                roomId
                            );

                        if (!room)
                            return;

                        io.to(
                            roomId
                        ).emit(
                            "members-updated",
                            room.users
                        );

                        io.to(
                            roomId
                        ).emit(
                            "messages-updated",
                            room.messages
                        );
                    }
                );

                console.log(
                    `Disconnected: ${socket.id}`
                );
            }
        );

    });

}

module.exports =
    registerSocketHandlers;