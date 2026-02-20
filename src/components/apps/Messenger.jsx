import { useState, useMemo, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  Phone,
  Video,
  Send,
  Image,
  Mic,
  Lock,
  Shield,
} from "lucide-react";
import { LEVEL_CONFIG } from "../../data/config";

export default function Messenger({
  onClose,
  messages = [],
  markAsRead,
  solvedIds = [],
  skippedIds = [],
  progressionIds = [],
}) {
  const [activeChatId, setActiveChatId] = useState(null);
  const bottomRef = useRef(null);

  // QUEUE STATE FOR TYPING INDICATORS
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [typingChats, setTypingChats] = useState(new Set());

  // [FIX] Use refs to avoid React Stale Closures during live updates
  const initialized = useRef(false);
  const processedIds = useRef(new Set());

  // 1. Calculate the Active Node for the Green Pulse
  const activeLevel = LEVEL_CONFIG.find(
    (level) =>
      (!level.requires || progressionIds.includes(level.requires)) &&
      !solvedIds.includes(level.id) &&
      !skippedIds.includes(level.id),
  );
  const activeLevelId = activeLevel ? activeLevel.id : null;

  useEffect(() => {
    if (markAsRead) markAsRead();
  }, []);

  // 2. The Smart Message Interceptor
  useEffect(() => {
    if (!initialized.current) {
      // On first load, render everything instantly
      setVisibleMessages(messages);
      messages.forEach((m) => processedIds.current.add(m.id));

      const timer = setTimeout(() => {
        initialized.current = true;
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Find truly new messages using our bulletproof processedIds ref
      const newMsgs = messages.filter((m) => !processedIds.current.has(m.id));

      if (newMsgs.length > 0) {
        newMsgs.forEach((m) => processedIds.current.add(m.id)); // Mark as seen
        setPendingMessages((prev) => [...prev, ...newMsgs]); // Push to queue
      }
    }
  }, [messages]);

  // 3. Process the Queue (The Typing Engine)
  useEffect(() => {
    if (pendingMessages.length > 0) {
      const msg = pendingMessages[0];
      const pId = msg.puzzleId || msg.levelId || "SYSTEM";

      // Turn ON typing indicator
      setTypingChats((prev) => new Set(prev).add(pId));

      const timer = setTimeout(() => {
        // Turn OFF typing indicator
        setTypingChats((prev) => {
          const next = new Set(prev);
          next.delete(pId);
          return next;
        });

        // Move message to visible
        setVisibleMessages((prev) => [...prev, msg]);

        // Remove from pending queue to trigger the next one
        setPendingMessages((prev) => prev.slice(1));

        if (markAsRead) markAsRead();
      }, 2500); // 2.5 seconds of "Typing..."

      return () => clearTimeout(timer);
    }
  }, [pendingMessages]);

  // 4. Group by Level & Sort by Activity
  const contacts = useMemo(() => {
    const groups = {};

    // Process already visible messages
    visibleMessages.forEach((msg, idx) => {
      const pId = msg.puzzleId || msg.levelId || "SYSTEM";
      const puzzle = LEVEL_CONFIG.find((p) => p.id === pId);
      const groupName = puzzle
        ? puzzle.title
        : pId === "SYSTEM"
          ? "Global Broadcasts"
          : pId.toUpperCase();

      if (!groups[pId]) {
        groups[pId] = {
          id: pId,
          name: groupName,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${pId}&backgroundColor=0a0a0a`,
          messages: [],
          lastMessage: "",
          lastTime: "Now",
          status: puzzle ? "Active Mission Thread" : "Encrypted Channel",
          orderIndex: -1,
          isTyping: typingChats.has(pId),
        };
      }
      groups[pId].messages.push(msg);
      groups[pId].lastMessage = msg.text;
      groups[pId].lastTime = msg.time;
      groups[pId].orderIndex = idx;
    });

    // Inject pending chats so they jump to the top and show "Typing..."
    pendingMessages.forEach((msg) => {
      const pId = msg.puzzleId || msg.levelId || "SYSTEM";
      if (!groups[pId]) {
        const puzzle = LEVEL_CONFIG.find((p) => p.id === pId);
        groups[pId] = {
          id: pId,
          name: puzzle ? puzzle.title : "Unknown Thread",
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${pId}&backgroundColor=0a0a0a`,
          messages: [],
          lastMessage: "...",
          lastTime: "Now",
          status: "Encrypted Channel",
          orderIndex: 999999,
          isTyping: true,
        };
      } else {
        groups[pId].isTyping = true;
        groups[pId].orderIndex += 99999; // Bump to absolute top
      }
    });

    return Object.values(groups).sort((a, b) => b.orderIndex - a.orderIndex);
  }, [visibleMessages, pendingMessages, typingChats]);

  // Auto-scroll to bottom smoothly
  useEffect(() => {
    if (activeChatId && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatId, visibleMessages, typingChats]);

  // Default select the top chat
  useEffect(() => {
    if (!activeChatId && contacts.length > 0 && window.innerWidth > 768) {
      setActiveChatId(contacts[0].id);
    }
  }, [contacts]);

  const activeChat = contacts.find((c) => c.id === activeChatId);

  const SidebarItem = ({ chat }) => {
    const isCurrentActiveNode = chat.id === activeLevelId;

    return (
      <div
        onClick={() => setActiveChatId(chat.id)}
        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-white/5 ${activeChatId === chat.id ? "bg-white/10" : "hover:bg-white/5"}`}
      >
        <div className="relative shrink-0">
          <img
            src={chat.avatar}
            className="w-12 h-12 rounded-xl bg-neutral-900 object-cover border border-white/10 p-1"
            alt={chat.name}
          />
          {isCurrentActiveNode && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3
              className={`font-bold text-sm truncate ${isCurrentActiveNode ? "text-green-400" : "text-neutral-200"}`}
            >
              {chat.name}
            </h3>
            <span className="text-[10px] text-neutral-500">
              {chat.lastTime}
            </span>
          </div>
          <p
            className={`text-xs truncate ${chat.isTyping ? "text-green-500 font-medium italic" : "text-neutral-400"}`}
          >
            {chat.isTyping ? (
              "Typing..."
            ) : (
              <>
                {chat.messages[chat.messages.length - 1]?.sender === "me" && (
                  <span className="text-neutral-500">You: </span>
                )}
                {chat.lastMessage}
              </>
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-[#121212] text-white flex font-sans overflow-hidden animate-in fade-in duration-300">
      {/* SIDEBAR */}
      <div
        className={`flex-col border-r border-white/10 bg-[#121212] w-full md:w-80 shrink-0 ${activeChatId ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 bg-neutral-900 border-b border-white/5 flex justify-between items-center shrink-0 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              S
            </div>
            <span className="font-bold text-lg tracking-wide">Signal</span>
          </div>
          <div className="flex gap-4 text-neutral-400">
            <Search size={20} className="hover:text-white cursor-pointer" />
            <MoreVertical
              size={20}
              className="hover:text-white cursor-pointer"
            />
            <button
              onClick={onClose}
              className="md:hidden text-xs bg-neutral-800 px-2 py-1 rounded border border-white/10"
            >
              Exit
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-neutral-600 text-sm italic flex flex-col items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              Searching for encrypted signals...
            </div>
          ) : (
            contacts.map((chat) => <SidebarItem key={chat.id} chat={chat} />)
          )}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div
        className={`flex-1 flex-col bg-[#0a0a0a] relative ${!activeChatId ? "hidden md:flex" : "flex w-full"}`}
      >
        {activeChat ? (
          <>
            <div className="h-16 px-4 bg-neutral-900 border-b border-white/5 flex items-center justify-between shrink-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} className="text-neutral-300" />
                </button>
                <img
                  src={activeChat.avatar}
                  className="w-9 h-9 rounded-xl bg-neutral-800 object-cover border border-white/5 p-0.5"
                />
                <div>
                  <h3
                    className={`text-sm font-bold flex items-center gap-2 ${activeChat.id === activeLevelId ? "text-green-400" : "text-white"}`}
                  >
                    {activeChat.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase ${activeChat.id === activeLevelId ? "text-green-500" : "text-neutral-500"}`}
                  >
                    <Shield size={10} /> {activeChat.status}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5 text-neutral-400">
                <Video
                  size={20}
                  className="hover:text-white cursor-not-allowed opacity-50 transition-colors"
                />
                <Phone
                  size={20}
                  className="hover:text-white cursor-not-allowed opacity-50 transition-colors"
                />
                <div className="border-l border-white/10 h-6 mx-1 md:block hidden"></div>
                <button
                  onClick={onClose}
                  className="hidden md:block hover:text-red-400 font-bold ml-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0a0a0a] relative custom-scrollbar pb-6">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

              <div className="flex justify-center my-6">
                <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-lg border border-blue-500/20 shadow-sm flex items-center gap-2 max-w-[90%] sm:max-w-fit">
                  <Lock size={12} className="shrink-0" />
                  <span className="text-[10px] sm:text-xs text-center leading-tight">
                    Mission thread established. Communications are End-to-End
                    Encrypted.
                  </span>
                </div>
              </div>

              {activeChat.messages.map((msg, idx) => {
                const isMe = msg.sender === "me";
                const senderInfo = msg.sender || {
                  name: "SYSTEM",
                  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=SYSTEM`,
                };
                const showSenderInfo =
                  !isMe &&
                  (idx === 0 ||
                    activeChat.messages[idx - 1].sender?.name !==
                      msg.sender?.name);

                return (
                  <div
                    key={idx}
                    className={`flex flex-col relative z-10 ${isMe ? "items-end" : "items-start"}`}
                  >
                    {showSenderInfo && (
                      <div className="flex items-center gap-2 mt-4 mb-1 ml-1 animate-in fade-in">
                        <img
                          src={senderInfo.avatar}
                          className="w-5 h-5 rounded-full bg-neutral-800 border border-white/10"
                          alt={senderInfo.name}
                        />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                          {senderInfo.name}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300 w-full`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-sm shadow-md leading-relaxed ${isMe ? "bg-blue-600 text-white rounded-br-none mt-1" : "bg-neutral-800 text-neutral-100 rounded-bl-none border border-white/5 mt-0.5 ml-8"}`}
                      >
                        {msg.text}
                        <div
                          className={`text-[9px] mt-1 text-right font-medium opacity-70 ${isMe ? "text-blue-200" : "text-neutral-500"}`}
                        >
                          {msg.time} {msg.date && `• ${msg.date}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* THE TYPING INDICATOR BUBBLE */}
              {activeChat.isTyping && (
                <div className="flex flex-col relative z-10 items-start">
                  <div className="flex items-center gap-2 mt-4 mb-1 ml-1 animate-in fade-in">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                      ?
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                      Incoming Transmission...
                    </span>
                  </div>
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300 w-full mb-2">
                    <div className="bg-neutral-800 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3.5 shadow-md flex items-center gap-1.5 w-fit mt-0.5 ml-8">
                      <div
                        className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-[#121212] shrink-0 flex items-center gap-3 border-t border-white/5 z-20">
              <button className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                <div className="bg-white/10 rounded-full p-1">
                  <span className="text-xl leading-none font-light">+</span>
                </div>
              </button>
              <div className="flex-1 bg-neutral-800 rounded-full px-4 py-2.5 flex items-center gap-3 border border-transparent">
                <input
                  type="text"
                  disabled
                  placeholder="Signal message"
                  className="bg-transparent w-full text-sm text-neutral-300 placeholder:text-neutral-500 focus:outline-none cursor-not-allowed"
                />
                <Image
                  size={18}
                  className="text-neutral-500 cursor-not-allowed"
                />
                <Mic
                  size={18}
                  className="text-neutral-500 cursor-not-allowed"
                />
              </div>
              <button className="p-3 rounded-full bg-neutral-800 text-neutral-500 cursor-not-allowed">
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-4 p-8 select-none">
            <div className="w-24 h-24 rounded-full bg-neutral-800/50 flex items-center justify-center border border-white/5">
              <Shield size={40} className="text-neutral-700" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-neutral-300 tracking-tight">
                Ph0enix Signal
              </h3>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Encrypted Mission Threads. Select a node to view intercepts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
