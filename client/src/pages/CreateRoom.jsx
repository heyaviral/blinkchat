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
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tight">BlinkChat</h1>

          <p className="mt-6 text-zinc-500 text-lg">Create a temporary room.</p>

          <div className="w-20 h-px bg-zinc-800 mx-auto mt-8"></div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-zinc-500 uppercase mb-3">
            Your Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 bg-[#111111] border border-zinc-800 rounded-md outline-none text-white placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>
        {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-md font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
}
