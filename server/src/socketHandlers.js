const {
  createRoom,
  joinRoom,
  removeUser,
  removeUserImmediately,
  getRoom,
  addMessage,
  deleteRoom,
} = require("./roomManager");

function registerSocketHandlers(io) {
  io.on(
    "connection",
    (socket) => {
      console.log(`Connected: ${socket.id}`);

      // CREATE ROOM
      socket.on("create-room", ({ name }, callback) => {
        const trimmedName = name?.trim();

        if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 25) {
          callback({
            success: false,
            message: "Name must be between 3 and 25 characters.",
          });

          return;
        }

        const room = createRoom(socket.id, trimmedName);

        socket.join(room.roomId);

        callback({
          success: true,
          roomId: room.roomId,
          password: room.password,
          ownerName: room.ownerName,
        });
      });

      // JOIN ROOM
      socket.on("join-room", ({ roomId, password, name }, callback) => {
        const trimmedName = name?.trim();

        if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 25) {
          callback({
            success: false,
            message: "Name must be between 3 and 25 characters.",
          });

          return;
        }

        const result = joinRoom(roomId, password, socket.id, trimmedName);
        if (!result.success) {
          callback(result);
          return;
        }

        socket.join(roomId);

        callback({
          success: true,
          room: result.room,
        });

        // GET ROOM DATA
        socket.on("get-room-data", ({ roomId }, callback) => {
          const room = getRoom(roomId);

          if (!room) {
            callback({
              success: false,
            });

            return;
          }

          callback({
            success: true,
            users: room.users,
            messages: room.messages,
            ownerName: room.ownerName,
          });
        });

        // SEND MESSAGE
        socket.on("send-message", ({ roomId, sender, text }) => {
          const message = addMessage(roomId, sender, text);

          if (!message) return;

          const room = getRoom(roomId);

          if (!room) return;

          io.to(roomId).emit("messages-updated", room.messages);
        });

        socket.on("typing-start", ({ roomId, name }) => {
          socket.to(roomId).emit("user-typing", name);
        });

        socket.on("typing-stop", ({ roomId }) => {
          socket.to(roomId).emit("user-stopped-typing");
        });

        // END ROOM
        socket.on("end-room", ({ roomId }) => {
          io.to(roomId).emit("room-ended", {
            reason: "owner",
          });

          deleteRoom(roomId);
        });

        //LEAVE ROOM
        socket.on("leave-room", ({ roomId }) => {
          console.log("LEAVE ROOM FIRED", socket.id, roomId);
          removeUserImmediately(socket.id, (roomId) => {
            const room = getRoom(roomId);

            if (!room) return;

            io.to(roomId).emit("members-updated", room.users);

            io.to(roomId).emit("messages-updated", room.messages);
          });

          socket.leave(roomId);
        });

        // DISCONNECT
        socket.on("disconnect", () => {
          removeUser(socket.id, (roomId) => {
            const room = getRoom(roomId);

            if (!room) return;

            io.to(roomId).emit("members-updated", room.users);

            io.to(roomId).emit("messages-updated", room.messages);
          });

          console.log(`Disconnected: ${socket.id}`);
        });
      });
    },

    (module.exports = registerSocketHandlers),
  );
}
