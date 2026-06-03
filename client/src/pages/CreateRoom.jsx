import { useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../services/socket";

export default function CreateRoom() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    function handleCreateRoom() {
        if (!name.trim()) return;

        setLoading(true);

        socket.emit(
            "create-room",
            {
                name: name.trim(),
            },
            (response) => {
                setLoading(false);

                if (!response.success) {
                    alert("Failed to create room");
                    return;
                }

                const session = {
                    roomId: response.roomId,
                    password: response.password,
                    name: name.trim(),
                    isOwner: true,
                    ownerName: name.trim(),
                };

                sessionStorage.setItem(
                    "blinkchat-session",
                    JSON.stringify(session)
                );

                navigate(`/room/${response.roomId}`);
            }
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold mb-2">
                    Create Room
                </h1>

                <p className="text-zinc-400 mb-8">
                    Start a temporary chat room.
                </p>

                <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 outline-none"
                />

                <button
                    onClick={handleCreateRoom}
                    disabled={loading}
                    className="w-full bg-white text-black py-4 rounded-xl font-semibold"
                >
                    {loading
                        ? "Creating..."
                        : "Create Room"}
                </button>
            </div>
        </div>
    );
}