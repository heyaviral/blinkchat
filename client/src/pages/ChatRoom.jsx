import { useEffect, useState, useRef } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import socket from "../services/socket";

export default function ChatRoom() {
  const navigate = useNavigate();

  const savedSession = sessionStorage.getItem("blinkchat-session");

  if (!savedSession) {
    return <Navigate to="/" />;
  }

  const roomData = JSON.parse(savedSession);

  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [toast, setToast] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [showEndModal, setShowEndModal] = useState(false);

  const previousMessageCount = useRef(0);

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.emit(
      "join-room",
      {
        roomId: roomData.roomId,
        password: roomData.password,
        name: roomData.name,
      },
      () => {},
    );

    socket.emit(
      "get-room-data",
      {
        roomId: roomData.roomId,
      },
      (response) => {
        if (!response.success) {
          return;
        }

        setUsers(response.users);

        setMessages(response.messages);
      },
    );

    const handleMembersUpdated = (members) => {
      setUsers(members);
    };

    const handleMessagesUpdated = (msgs) => {
      if (msgs.length > previousMessageCount.current) {
        const newestMessage = msgs[msgs.length - 1];

        if (newestMessage?.type === "system") {
          if (newestMessage.text.includes("joined")) {
            showToast(newestMessage.text);
          }

          if (newestMessage.text.includes("left")) {
            showToast(newestMessage.text);
          }
        }
      }

      previousMessageCount.current = msgs.length;

      setMessages(msgs);
    };

    const handleRoomEnded = () => {
      showToast("Room ended");

      sessionStorage.removeItem("blinkchat-session");

      navigate("/");
    };

    const handleUserTyping = (name) => {
      setTypingUser(name);
    };

    const handleUserStoppedTyping = () => {
      setTypingUser("");
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();

      e.returnValue = "";
    };

    socket.on("members-updated", handleMembersUpdated);

    socket.on("messages-updated", handleMessagesUpdated);

    socket.on("room-ended", handleRoomEnded);

    socket.on("user-typing", handleUserTyping);

    socket.on("user-stopped-typing", handleUserStoppedTyping);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("members-updated", handleMembersUpdated);

      socket.off("messages-updated", handleMessagesUpdated);

      socket.off("room-ended", handleRoomEnded);

      socket.off("user-typing", handleUserTyping);

      socket.off("user-stopped-typing", handleUserStoppedTyping);

      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function sendMessage() {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId: roomData.roomId,
      sender: roomData.name,
      text: message.trim(),
    });

    setMessage("");
    socket.emit("typing-stop", {
      roomId: roomData.roomId,
    });
  }

  function endRoom() {
    socket.emit("end-room", {
      roomId: roomData.roomId,
    });
  }

  function copyInvite() {
    const inviteLink = `https://blinkchatroom.netlify.app/join?room=${roomData.roomId}&pass=${roomData.password}`;

    navigator.clipboard.writeText(inviteLink);

    showToast("Invite link copied");
  }
  function leaveRoom() {
    sessionStorage.removeItem("blinkchat-session");

    navigate("/");
  }
  function showToast(text) {
    setToast(text);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }
  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm bg-[#111111] border border-zinc-800 rounded-md p-6">
            <h2 className="text-xl font-bold mb-3">Leave Room</h2>

            <p className="text-zinc-400 mb-6">
              Are you sure you want to leave this room?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 border border-zinc-700 py-3 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={leaveRoom}
                className="flex-1 bg-white text-black py-3 rounded-md font-semibold"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm bg-[#111111] border border-zinc-800 rounded-md p-6">
            <h2 className="text-xl font-bold mb-3">End Room</h2>

            <p className="text-zinc-400 mb-6">
              This will disconnect everyone and permanently delete the room.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 border border-zinc-700 py-3 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={endRoom}
                className="flex-1 bg-red-600 py-3 rounded-md font-semibold"
              >
                End Room
              </button>
            </div>
          </div>
        </div>
      )}
      <div
    className={`
        fixed inset-0 z-50
        transition-opacity duration-300
        ${
            showMembers
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
        }
    `}
>

    <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() =>
            setShowMembers(false)
        }
    />

    <div
        className={`
            absolute
            right-0
            top-0
            h-full
            w-[85vw]
            max-w-xs
            bg-[#111111]
            border-l
            border-zinc-800
            p-4
            overflow-y-auto
            transform
            transition-transform
            duration-300
            ease-out
            ${
                showMembers
                    ? "translate-x-0"
                    : "translate-x-full"
            }
        `}
    >

        <div className="flex justify-between items-center mb-4">

            <h2 className="font-bold">
                Members ({users.length})
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

            {users.map((user) => (

                <div
                    key={user.socketId}
                    className="bg-[#151515] border border-zinc-800 rounded-md p-3"
                >

                    {user.name}

                    {user.name === roomData.ownerName &&
                        " 👑"}

                </div>

            ))}

        </div>

    </div>

</div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-xl font-black tracking-tight">BLINKCHAT</div>

          <div className="text-sm text-zinc-500 mt-1">Temporary chat room</div>
        </div>

        <div>
          {!roomData.isOwner && (
            <button
              onClick={() => setShowLeaveModal(true)}
              className="bg-[#111111] border border-zinc-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Leave Room
            </button>
          )}

          {roomData.isOwner && (
            <button
              onClick={() => setShowEndModal(true)}
              className="bg-red-600 px-4 py-2 rounded-md text-sm font-semibold"
            >
              End Room
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-73px)] flex flex-col">
        <div className="border-b border-zinc-800 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Room
              </div>

              <div className="font-semibold text-lg">{roomData.roomId}</div>

              <div className="text-xs uppercase tracking-wide text-zinc-500 mt-2">
                Password
              </div>

              <div className="font-semibold">{roomData.password}</div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={copyInvite}
                className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                Copy Invite
              </button>

              <button
                onClick={() => setShowMembers(true)}
                className="bg-[#111111] border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              >
                Members ({users.length})
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <div key={index} className="text-center text-zinc-500 text-sm">
                  {msg.text}
                </div>
              );
            }

            const isMe = msg.sender === roomData.name;

            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    isMe ? "bg-white text-black" : "bg-[#151515] text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {isMe ? "You" : msg.sender}
                    </span>

                    <span
                      className={`text-xs ${
                        isMe ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  <div className="break-words">{msg.text}</div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {typingUser && (
          <div className="px-4 py-2 text-sm text-zinc-500 italic border-t border-zinc-800">
            {typingUser} is typing...
          </div>
        )}

        <div className="border-t border-zinc-800 p-4 flex gap-3">
          <input
            value={message}
            onChange={(e) => {
              const value = e.target.value;

              setMessage(value);

              socket.emit("typing-start", {
                roomId: roomData.roomId,
                name: roomData.name,
              });

              clearTimeout(typingTimeoutRef.current);

              typingTimeoutRef.current = setTimeout(() => {
                socket.emit("typing-stop", {
                  roomId: roomData.roomId,
                });
              }, 2000);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-[#111111] border border-zinc-800 rounded-md px-4 py-4 outline-none focus:border-zinc-600 transition-colors"
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-6 py-4 rounded-md font-semibold transition-all duration-200 hover:scale-[1.02]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
