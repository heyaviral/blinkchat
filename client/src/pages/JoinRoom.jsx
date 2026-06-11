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
        roomId: roomId.trim(),

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
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="grid-bg" />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center">
            <img
              src="/icon.png"
              alt="BlinkChat"
              className="h-20 md:h-24 w-auto mx-auto"
            />

            <p className="mt-3 text-zinc-500">
              Join a temporary private conversation.
            </p>
          </div>

          <div className="flex justify-center mt-8 mb-8">
            <div className="w-20 h-px bg-zinc-800"></div>
          </div>

          <div className="mt-12 space-y-4">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="
              w-full
              h-14
              px-5
              rounded-lg
              bg-[#0d0d0d]
              border
              border-zinc-800
              text-white
              placeholder:text-zinc-600
              outline-none
              transition-colors
              focus:border-zinc-700
            "
            />

            <input
              placeholder="Password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
              w-full
              h-14
              px-5
              rounded-lg
              bg-[#0d0d0d]
              border
              border-zinc-800
              text-white
              placeholder:text-zinc-600
              outline-none
              transition-colors
              focus:border-zinc-700
            "
            />

            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
              w-full
              h-14
              px-5
              rounded-lg
              bg-[#0d0d0d]
              border
              border-zinc-800
              text-white
              placeholder:text-zinc-600
              outline-none
              transition-colors
              focus:border-zinc-700
            "
            />
          </div>

          {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

          <button
            onClick={handleJoinRoom}
            className="
            mt-5
            w-full
            h-14
            rounded-lg
            bg-white
            text-black
            font-semibold
            transition-all
            duration-200
            hover:-translate-y-1
          "
          >
            Join Room
          </button>

          <button
            onClick={() => navigate("/")}
            className="
            mt-5
            w-full
            text-zinc-500
            hover:text-zinc-300
            transition-colors
          "
          >
            ← Back
          </button>
        </div>
      </main>
    </div>
  );
}
