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

    const [toast, setToast] =
        useState("");
    const [typingUser, setTypingUser] =
        useState("");
    const [showMembers, setShowMembers] =
        useState(false);

    const previousMessageCount =
        useRef(0);

    const messagesEndRef =
        useRef(null);

    const typingTimeoutRef =
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

                if (
                    msgs.length >
                    previousMessageCount.current
                ) {

                    const newestMessage =
                        msgs[
                        msgs.length - 1
                        ];

                    if (
                        newestMessage?.type ===
                        "system"
                    ) {

                        if (
                            newestMessage.text.includes(
                                "joined"
                            )
                        ) {

                            showToast(
                                newestMessage.text
                            );

                        }

                        if (
                            newestMessage.text.includes(
                                "left"
                            )
                        ) {

                            showToast(
                                newestMessage.text
                            );

                        }

                    }

                }

                previousMessageCount.current =
                    msgs.length;

                setMessages(msgs);
            };

        const handleRoomEnded =
            () => {
                showToast(
                    "Room ended"
                );

                sessionStorage.removeItem(
                    "blinkchat-session"
                );

                navigate("/");
            };

        const handleUserTyping =
            (name) => {

                setTypingUser(name);

            };

        const handleUserStoppedTyping =
            () => {

                setTypingUser("");

            };

        const handleBeforeUnload =
            (e) => {

                e.preventDefault();

                e.returnValue = "";
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

        socket.on(
            "user-typing",
            handleUserTyping
        );

        socket.on(
            "user-stopped-typing",
            handleUserStoppedTyping
        );
        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
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

            socket.off(
                "user-typing",
                handleUserTyping
            );

            socket.off(
                "user-stopped-typing",
                handleUserStoppedTyping
            );

            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
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
        socket.emit(
            "typing-stop",
            {
                roomId:
                    roomData.roomId,
            }
        );
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

        showToast(
            "Invite copied"
        );
    }
    function leaveRoom() {

        const confirmed =
            confirm(
                "Leave this room?"
            );

        if (!confirmed)
            return;

        sessionStorage.removeItem(
            "blinkchat-session"
        );

        navigate("/");
    }
    function showToast(text) {

        setToast(text);

        setTimeout(() => {
            setToast("");
        }, 2500);

    }
    function formatTime(timestamp) {

        return new Date(timestamp)
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {showMembers && (

                <div className="fixed inset-0 z-50 md:hidden">

                    <div
                        className="absolute inset-0 bg-black/70"
                        onClick={() =>
                            setShowMembers(false)
                        }
                    />

                    <div className="absolute right-0 top-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">

                        <div className="flex justify-between items-center mb-4">

                            <h2 className="font-bold">
                                Members
                            </h2>

                            <button
                                onClick={() =>
                                    setShowMembers(false)
                                }
                                className="text-zinc-400"
                            >
                                ✕
                            </button>

                        </div>

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

                </div>

            )}
            {toast && (

                <div className="fixed top-5 right-5 z-50 bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl shadow-lg">

                    {toast}

                </div>

            )}


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

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">

                    <div className="hidden md:block bg-zinc-900 rounded-2xl p-4">

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

                    <div className="bg-zinc-900 rounded-2xl flex flex-col h-[80vh] min-w-0">

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

                        <button
                            onClick={() =>
                                setShowMembers(true)
                            }
                            className="md:hidden bg-zinc-800 px-3 py-1 rounded-lg text-sm"
                        >
                            Members ({users.length})
                        </button>

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

                                    const isMe =
                                        msg.sender === roomData.name;

                                    return (

                                        <div
                                            key={index}
                                            className={`flex ${isMe
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >

                                            <div
                                                className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe
                                                    ? "bg-white text-black"
                                                    : "bg-zinc-800 text-white"
                                                    }`}
                                            >

                                                <div className="flex items-center gap-2 mb-1">

                                                    <span className="font-semibold text-sm">
                                                        {isMe
                                                            ? "You"
                                                            : msg.sender}
                                                    </span>

                                                    <span
                                                        className={`text-xs ${isMe
                                                            ? "text-zinc-700"
                                                            : "text-zinc-400"
                                                            }`}
                                                    >
                                                        {formatTime(
                                                            msg.timestamp
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="break-words">
                                                    {msg.text}
                                                </div>

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
                        {typingUser && (

                            <div className="px-4 pb-2 text-sm text-zinc-400 italic">

                                {typingUser} is typing...

                            </div>

                        )}

                        <div className="border-t border-zinc-800 p-4 flex gap-3">

                            <input
                                value={
                                    message
                                }
                                onChange={(e) => {

                                    const value =
                                        e.target.value;

                                    setMessage(value);

                                    socket.emit(
                                        "typing-start",
                                        {
                                            roomId:
                                                roomData.roomId,
                                            name:
                                                roomData.name,
                                        }
                                    );

                                    clearTimeout(
                                        typingTimeoutRef.current
                                    );

                                    typingTimeoutRef.current =
                                        setTimeout(() => {

                                            socket.emit(
                                                "typing-stop",
                                                {
                                                    roomId:
                                                        roomData.roomId,
                                                }
                                            );

                                        }, 2000);

                                }}
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