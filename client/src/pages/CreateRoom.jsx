import { useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../services/socket";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleCreateRoom() {
    const trimmedName = name.trim();
    setError("");

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (trimmedName.length > 25) {
      setError("Name can not be longer than 25 characters.");
      return;
    }

    setLoading(true);

    socket.emit(
      "create-room",
      {
        name: trimmedName,
      },
      (response) => {
        setLoading(false);

        if (!response.success) {
          setError("Failed to create room");

          return;
        }

        const session = {
          roomId: response.roomId,
          password: response.password,
          name: trimmedName,
          isOwner: true,
          ownerName: trimmedName,
        };

        sessionStorage.setItem("blinkchat-session", JSON.stringify(session));

        navigate(`/room/${response.roomId}`);
      },
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="grid-bg" />

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              BlinkChat
            </h1>

            {/* <p className="mt-6 text-2xl font-semibold">Create a Room</p> */}

            <p className="mt-3 text-zinc-500">
              Start a temporary private conversation.
            </p>
          </div>

          <div className="flex justify-center mt-8 mb-8">
            <div className="w-20 h-px bg-zinc-800"></div>
          </div>

          <div className="mt-12">
            <label className="block text-sm uppercase tracking-wider text-zinc-500 mb-3">
              Your Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
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

            {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

            <button
              onClick={handleCreateRoom}
              disabled={loading}
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
              disabled:opacity-50
            "
            >
              {loading ? "Creating..." : "Create Room"}
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
        </div>
      </main>
    </div>
  );
}
