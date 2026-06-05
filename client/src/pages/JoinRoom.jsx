import { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import socket from "../services/socket";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [roomId, setRoomId] = useState("");

  const [password, setPassword] = useState("");

  const [name, setName] = useState("");

  const [error, setError] = useState("");
  useEffect(() => {
    const room = searchParams.get("room");

    const pass = searchParams.get("pass");

    if (room) {
      setRoomId(room);
    }

    if (pass) {
      setPassword(pass);
    }
  }, [searchParams]);

  function handleJoinRoom() {
    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");

      return;
    }

    if (trimmedName.length > 25) {
      setError("Name cannot exceed 25 characters.");

      return;
    }

    socket.emit(
      "join-room",
      {
        roomId: roomId.trim().toUpperCase(),

        password: password.trim(),

        name: trimmedName,
      },

      (response) => {
        if (!response.success) {
          setError(response.message);

          return;
        }

        const session = {
          roomId: roomId.trim().toUpperCase(),

          password: password.trim(),

          name: trimmedName,

          isOwner: false,

          ownerName: response.room.ownerName,
        };

        sessionStorage.setItem("blinkchat-session", JSON.stringify(session));

        navigate(`/room/${roomId.trim().toUpperCase()}`);
      },
    );
  }

  return (
    <div className="h-screen bg-[#070707] flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight">BlinkChat</h1>

          <p className="mt-3 text-zinc-500">Join a temporary room.</p>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-[#111111] border border-zinc-800 px-5 py-4 rounded-md outline-none focus:border-zinc-600 placeholder:text-zinc-600"
          />

          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111111] border border-zinc-800 px-5 py-4 rounded-md outline-none focus:border-zinc-600 placeholder:text-zinc-600"
          />

          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#111111] border border-zinc-800 px-5 py-4 rounded-md outline-none focus:border-zinc-600 placeholder:text-zinc-600"
          />
        </div>

        {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

        <button
          onClick={handleJoinRoom}
          className="w-full mt-6 bg-white text-black py-4 rounded-md font-semibold transition-all duration-200 hover:scale-[1.02]"
        >
          Join Room
        </button>

        <p className="mt-8 text-xs text-zinc-600">
          No accounts. No history. No setup.
        </p>
      </div>
    </div>
  );
}
