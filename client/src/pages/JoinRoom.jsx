import {
    useState,
    useEffect,
} from "react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import socket from "../services/socket";

export default function JoinRoom() {
    const navigate = useNavigate();
    const [searchParams] =
        useSearchParams();

    const [roomId, setRoomId] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [name, setName] =
        useState("");

    const [error, setError] =
        useState("");
    useEffect(() => {

        const room =
            searchParams.get(
                "room"
            );

        const pass =
            searchParams.get(
                "pass"
            );

        if (room) {
            setRoomId(room);
        }

        if (pass) {
            setPassword(pass);
        }

    }, [searchParams]);

    function handleJoinRoom() {
        setError("");

        socket.emit(
            "join-room",
            {
                roomId:
                    roomId.trim().toUpperCase(),
                password:
                    password.trim(),
                name: name.trim(),
            },
            (response) => {
                if (!response.success) {
                    setError(
                        response.message
                    );
                    return;
                }

                const session = {
                    roomId:
                        roomId
                            .trim()
                            .toUpperCase(),
                    password:
                        password.trim(),
                    name: name.trim(),
                    isOwner: false,
                    ownerName:
                        response.room
                            .ownerName,
                };

                sessionStorage.setItem(
                    "blinkchat-session",
                    JSON.stringify(
                        session
                    )
                );

                navigate(
                    `/room/${roomId
                        .trim()
                        .toUpperCase()}`
                );
            }
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold mb-2">
                    Join Room
                </h1>

                <p className="text-zinc-400 mb-8">
                    Enter room details.
                </p>

                <input
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) =>
                        setRoomId(
                            e.target.value
                        )
                    }
                    className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4"
                />

                <input
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4"
                />

                <input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                    className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4"
                />

                {error && (
                    <div className="text-red-400 mb-4">
                        {error}
                    </div>
                )}

                <button
                    onClick={
                        handleJoinRoom
                    }
                    className="w-full bg-white text-black py-4 rounded-xl font-semibold"
                >
                    Join Room
                </button>
            </div>
        </div>
    );
}