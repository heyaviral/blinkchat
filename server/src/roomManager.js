const { generateRoomId, generatePassword } = require("./utils/generateRoom");

const rooms = {};

const pendingDisconnects = {};

function createRoom(ownerSocketId, ownerName) {
  let roomId;

  do {
    roomId = generateRoomId();
  } while (rooms[roomId]);

  const password = generatePassword();

  rooms[roomId] = {
    roomId,
    password,

    ownerSocketId,
    ownerName,

    users: [
      {
        socketId: ownerSocketId,
        name: ownerName,
      },
    ],

    messages: [],

    lastActivity: Date.now(),
  };

  return rooms[roomId];
}

function getRoom(roomId) {
  return rooms[roomId];
}

function joinRoom(roomId, password, socketId, name) {
  const room = rooms[roomId];

  if (!room) {
    return {
      success: false,
      message: "Room not found",
    };
  }

  if (room.password !== password) {
    return {
      success: false,
      message: "Wrong password",
    };
  }

  if (pendingDisconnects[name]) {
    clearTimeout(pendingDisconnects[name]);

    delete pendingDisconnects[name];
  }

  const existingUser = room.users.find((user) => user.name === name);

  if (existingUser) {
    existingUser.socketId = socketId;
  } else {
    room.users.push({
      socketId,
      name,
    });

    room.messages.push({
      type: "system",
      text: `${name} joined the room`,
      timestamp: Date.now(),
    });
  }

  room.lastActivity = Date.now();

  return {
    success: true,
    room,
  };
}

function addMessage(roomId, sender, text) {
  const room = rooms[roomId];

  if (!room) {
    return null;
  }

  const message = {
    type: "message",
    sender,
    text,
    timestamp: Date.now(),
  };

  room.messages.push(message);

  room.lastActivity = Date.now();

  return message;
}

function removeUser(socketId, callback) {
  for (const roomId in rooms) {
    const room = rooms[roomId];

    const user = room.users.find((u) => u.socketId === socketId);

    if (!user) continue;

    pendingDisconnects[user.name] = setTimeout(() => {
      room.users = room.users.filter((u) => u.socketId !== socketId);

      room.messages.push({
        type: "system",
        text: `${user.name} left the room`,
        timestamp: Date.now(),
      });

      room.lastActivity = Date.now();

      if (room.users.length === 0) {
        delete rooms[roomId];
      }

      delete pendingDisconnects[user.name];

      if (callback) {
        callback(roomId);
      }
    }, 5000);

    return roomId;
  }

  return null;
}

function removeUserImmediately(socketId, callback) {
  for (const roomId in rooms) {
    const room = rooms[roomId];

    const user = room.users.find((u) => u.socketId === socketId);

    if (!user) continue;

    room.users = room.users.filter((u) => u.socketId !== socketId);

    room.messages.push({
      type: "system",
      text: `${user.name} left the room`,
      timestamp: Date.now(),
    });

    room.lastActivity = Date.now();

    if (room.users.length === 0) {
      delete rooms[roomId];
    }

    if (callback) {
      callback(roomId);
    }

    return roomId;
  }

  return null;
}

function deleteRoom(roomId) {
  delete rooms[roomId];
}

function updateActivity(roomId) {
  if (!rooms[roomId]) return;

  rooms[roomId].lastActivity = Date.now();
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateActivity,
  joinRoom,
  removeUser,
  removeUserImmediately,
  addMessage,
};
