import { useEffect, useState, useRef } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import { Users, Link as LinkIcon, Send } from "lucide-react";

import socket from "../services/socket";

import { FiCopy } from "react-icons/fi";

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
  const [roomEndedInfo, setRoomEndedInfo] = useState(null);

  const previousMessageCount = useRef(0);

  const messagesEndRef = useRef(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

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
    const handleRoomEnded = (data) => {
      let title = "Room Ended";

      let message = "This room is no longer available.";

      if (data?.reason === "owner") {
        title = "Room Closed";

        message = "The room owner ended the room.";
      } else if (data?.reason === "inactivity") {
        title = "Room Expired";

        message = "This room was automatically deleted due to inactivity.";
      }

      setRoomEndedInfo({
        title,
        message,
      });
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

    function getInitial(name) {
      return name?.charAt(0).toUpperCase();
    }

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
    const handleAndroidBack = () => {
      if (roomData.isOwner) {
        setShowEndModal(true);
      } else {
        setShowLeaveModal(true);
      }
    };

    window.addEventListener("blinkchat-back-button", handleAndroidBack);

    return () => {
      window.removeEventListener("blinkchat-back-button", handleAndroidBack);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function copyMessage(text) {
    navigator.clipboard.writeText(text);

    showToast("Copied!");
  }

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
    const inviteLink = `https://blinkchatroom.in/join?room=${roomData.roomId}&pass=${roomData.password}`;

    navigator.clipboard.writeText(inviteLink);

    showToast("Invite link copied");
  }
  function leaveRoom() {
    socket.emit("leave-room", {
      roomId: roomData.roomId,
    });

    setTimeout(() => {
      sessionStorage.removeItem("blinkchat-session");
      navigate("/");
    }, 100);
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
    <div className="relative h-dvh overflow-hidden bg-black text-white flex flex-col">
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
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
      {roomEndedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm bg-[#111111] border border-zinc-800 rounded-md p-6">
            <h2 className="text-xl font-bold mb-3">{roomEndedInfo.title}</h2>

            <p className="text-zinc-400 mb-6">{roomEndedInfo.message}</p>

            <button
              onClick={() => {
                sessionStorage.removeItem("blinkchat-session");

                navigate("/");
              }}
              className="w-full bg-white text-black py-3 rounded-md font-semibold"
            >
              Return Home
            </button>
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
          onClick={() => setShowMembers(false)}
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
            ${showMembers ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Members ({users.length})</h2>

            <button
              onClick={() => setShowMembers(false)}
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

                {user.name === roomData.ownerName && " 👑"}
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

      <div className="px-4 py-3 flex items-center justify-between">
        <img src="/icon.png" alt="BlinkChat" className="h-10 w-auto" />

        {!roomData.isOwner && (
          <button
            onClick={() => setShowLeaveModal(true)}
            className="
        bg-[#0d0d0d]
        border
        border-zinc-800
        px-3
        py-2
        rounded-lg
        text-sm
        font-medium
      "
          >
            Leave
          </button>
        )}

        {roomData.isOwner && (
          <button
            onClick={() => setShowEndModal(true)}
            className="
        bg-red-600
        px-3
        py-2
        rounded-lg
        text-sm
        font-semibold
      "
          >
            End Room
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="border-b border-zinc-900 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-zinc-400 truncate">
                Room:{" "}
                <span className="font-semibold text-white">
                  {roomData.roomId}
                </span>
              </div>

              <div className="text-sm text-zinc-500 truncate">
                Pass: <span className="font-medium">{roomData.password}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={copyInvite}
                className="
    bg-[#0d0d0d]
    border
    border-zinc-800
    p-2.5
    rounded-lg
    text-zinc-300
    hover:text-white
    hover:border-zinc-700
    transition-all
  "
              >
                <LinkIcon size={18} strokeWidth={2} />
              </button>

              <button
                onClick={() => setShowMembers(true)}
                className="
    flex
    items-center
    gap-2
    bg-[#0d0d0d]
    border
    border-zinc-800
    px-3
    py-2
    rounded-lg
    text-zinc-300
    hover:text-white
    hover:border-zinc-700
    transition-all
  "
              >
                <Users size={18} strokeWidth={2} />
                <span className="text-sm">({users.length})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <div
                  key={index}
                  className="
          py-3
          text-center
          text-sm
          text-zinc-500
          border-b
          border-zinc-900
        "
                >
                  {msg.text}
                </div>
              );
            }

            const isMe = msg.sender === roomData.name;
            const previousMessage = messages[index - 1];

            const isGrouped =
              previousMessage &&
              previousMessage.type === "message" &&
              previousMessage.sender === msg.sender;
            const nextMessage = messages[index + 1];

            const isLastInGroup =
              !nextMessage ||
              nextMessage.type !== "message" ||
              nextMessage.sender !== msg.sender;

            return (
              <div
                key={index}
                onClick={() =>
                  setSelectedMessage(selectedMessage === index ? null : index)
                }
                onMouseEnter={() => setHoveredMessage(index)}
                onMouseLeave={() => setHoveredMessage(null)}
                className={`
  px-4
  ${isGrouped ? "pt-1 pb-2 pl-16" : "pt-4 pb-3"}
  ${isLastInGroup ? "border-b border-zinc-900" : ""}
  transition-colors
  ${isMe ? "bg-[#111111]" : "bg-[#0b0b0b]"}
`}
              >
                {!isGrouped && (
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="
          w-9
          h-9
          rounded-full
          border
          border-zinc-700
          flex
          items-center
          justify-center
          text-sm
          font-semibold
          text-zinc-300
          shrink-0
        "
                      >
                        {(isMe ? "You" : msg.sender).charAt(0).toUpperCase()}
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={`
      font-semibold
      ${isMe ? "text-white" : "text-zinc-300"}
    `}
                        >
                          {isMe ? "You" : msg.sender}
                        </div>

                        <div className="text-xs text-zinc-500">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>

                    {(selectedMessage === index ||
                      hoveredMessage === index) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyMessage(msg.text);
                        }}
                        className="
          text-zinc-500
          hover:text-white
          transition-colors
          shrink-0
        "
                      >
                        <FiCopy size={14} />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`
    whitespace-pre-wrap
    break-words
    text-zinc-200
    leading-relaxed
    ${!isGrouped ? "mt-2 pl-12" : ""}
  `}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {typingUser && (
          <div className="shrink-0 px-4 py-2 text-sm text-zinc-500 italic border-t border-zinc-800">
            {typingUser} is typing...
          </div>
        )}

        <div className="shrink-0 border-t border-zinc-800 p-4 flex gap-3">
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
            <Send size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
