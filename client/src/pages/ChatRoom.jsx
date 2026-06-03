import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import socket from "../services/socket";

export default function ChatRoom() {

    const navigate =
        useNavigate();

    const savedSession =
        sessionStorage.getItem(
            "blinkchat-session"
        );

    if (!savedSession) {
        return <Navigate to="/" />;
    }

    const roomData =
        JSON.parse(savedSession);

    const [users, setUsers] =
        useState([]);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const messagesEndRef =
        useRef(null);

    useEffect(() => {

        socket.emit(
            "join-room",
            {
                roomId:
                    roomData.roomId,
                password:
                    roomData.password,
                name:
                    roomData.name,
            },
            () => { }
        );

        socket.emit(
            "get-room-data",
            {
                roomId:
                    roomData.roomId,
            },
            (response) => {

                if (
                    !response.success
                ) {
                    return;
                }

                setUsers(
                    response.users
                );

                setMessages(
                    response.messages
                );
            }
        );

        const handleMembersUpdated =
            (members) => {
                setUsers(members);
            };

        const handleMessagesUpdated =
            (msgs) => {
                setMessages(msgs);
            };

        const handleRoomEnded =
            () => {

                alert(
                    "Room has been ended by the owner."
                );

                sessionStorage.removeItem(
                    "blinkchat-session"
                );

                navigate("/");
            };

        socket.on(
            "members-updated",
            handleMembersUpdated
        );

        socket.on(
            "messages-updated",
            handleMessagesUpdated
        );

        socket.on(
            "room-ended",
            handleRoomEnded
        );

        return () => {

            socket.off(
                "members-updated",
                handleMembersUpdated
            );

            socket.off(
                "messages-updated",
                handleMessagesUpdated
            );

            socket.off(
                "room-ended",
                handleRoomEnded
            );
        };

    }, []);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    function sendMessage() {

        if (!message.trim())
            return;

        socket.emit(
            "send-message",
            {
                roomId:
                    roomData.roomId,
                sender:
                    roomData.name,
                text:
                    message.trim(),
            }
        );

        setMessage("");
    }

    function endRoom() {

        const confirmed =
            confirm(
                "Are you sure you want to end this room?"
            );

        if (!confirmed)
            return;

        socket.emit(
            "end-room",
            {
                roomId:
                    roomData.roomId,
            }
        );
    }

    function copyInvite() {

        navigator.clipboard.writeText(
            `BlinkChat Invite

Room ID: ${roomData.roomId}
Password: ${roomData.password}`
        );

        alert(
            "Invite copied!"
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                    BlinkChat
                </h1>

                {roomData.isOwner && (
                    <button
                        onClick={
                            endRoom
                        }
                        className="bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                        End Room
                    </button>
                )}

            </div>

            <div className="max-w-7xl mx-auto p-4">

                <div className="grid md:grid-cols-[280px_1fr] gap-4">

                    <div className="bg-zinc-900 rounded-2xl p-4">

                        <h2 className="text-lg font-bold mb-4">
                            Members ({users.length})
                        </h2>

                        <div className="space-y-2">

                            {users.map(
                                (user) => (
                                    <div
                                        key={
                                            user.socketId
                                        }
                                        className="bg-zinc-800 rounded-xl p-3"
                                    >
                                        {user.name}

                                        {user.name ===
                                            roomData.ownerName &&
                                            " 👑"}
                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    <div className="bg-zinc-900 rounded-2xl flex flex-col h-[80vh]">

                        <div className="border-b border-zinc-800 p-4">

                            <div className="text-sm text-zinc-400">
                                Room ID
                            </div>

                            <div className="font-bold">
                                {roomData.roomId}
                            </div>

                            <div className="mt-3">

                                <div className="text-sm text-zinc-400">
                                    Password
                                </div>

                                <div className="font-bold">
                                    {roomData.password}
                                </div>

                            </div>

                            <button
                                onClick={
                                    copyInvite
                                }
                                className="mt-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold"
                            >
                                Copy Invite
                            </button>

                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">

                            {messages.map(
                                (
                                    msg,
                                    index
                                ) => {

                                    if (
                                        msg.type ===
                                        "system"
                                    ) {
                                        return (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="text-center text-zinc-500 text-sm"
                                            >
                                                {
                                                    msg.text
                                                }
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-zinc-800 rounded-xl p-3"
                                        >
                                            <div className="font-semibold mb-1">
                                                {
                                                    msg.sender
                                                }
                                            </div>

                                            <div>
                                                {
                                                    msg.text
                                                }
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            <div
                                ref={
                                    messagesEndRef
                                }
                            />

                        </div>

                        <div className="border-t border-zinc-800 p-4 flex gap-3">

                            <input
                                value={
                                    message
                                }
                                onChange={(
                                    e
                                ) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(
                                    e
                                ) => {

                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        sendMessage();
                                    }

                                }}
                                placeholder="Type a message..."
                                className="flex-1 bg-zinc-800 rounded-xl p-3 outline-none"
                            />

                            <button
                                onClick={
                                    sendMessage
                                }
                                className="bg-white text-black px-6 rounded-xl font-semibold"
                            >
                                Send
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}