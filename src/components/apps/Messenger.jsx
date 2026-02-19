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
} from "lucide-react";

export default function Messenger({ onClose, messages = [], markAsRead }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (markAsRead) markAsRead();
  }, []);

  const contacts = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      const sender = msg.sender || {
        id: "UNKNOWN",
        name: "Unknown",
        avatar: "",
      };
      const senderId = sender.id;

      if (!groups[senderId]) {
        groups[senderId] = {
          id: senderId,
          name: sender.name,
          avatar: sender.avatar,
          status: sender.status || "Offline",
          messages: [],
          lastMessage: "",
          lastTime: "Now",
        };
      }
      groups[senderId].messages.push(msg);
      groups[senderId].lastMessage = msg.text;
      groups[senderId].lastTime = msg.time; // Use the actual stored time
    });
    return Object.values(groups);
  }, [messages]);

  useEffect(() => {
    if (activeChatId && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatId, messages]);

  useEffect(() => {
    if (!activeChatId && contacts.length > 0 && window.innerWidth > 768) {
      setActiveChatId(contacts[0].id);
    }
  }, [contacts]);

  const activeChat = contacts.find((c) => c.id === activeChatId);

  const SidebarItem = ({ chat }) => (
    <div
      onClick={() => setActiveChatId(chat.id)}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-white/5 ${activeChatId === chat.id ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      <div className="relative shrink-0">
        <img
          src={chat.avatar}
          className="w-12 h-12 rounded-full bg-neutral-800 object-cover border border-white/10"
          alt={chat.name}
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-bold text-sm text-neutral-200 truncate">
            {chat.name}
          </h3>
          <span className="text-[10px] text-neutral-500">{chat.lastTime}</span>
        </div>
        <p className="text-xs text-neutral-400 truncate">
          {chat.messages[chat.messages.length - 1]?.sender === "me" && (
            <span className="text-neutral-500">You: </span>
          )}
          {chat.lastMessage}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-[#121212] text-white flex font-sans overflow-hidden animate-in fade-in duration-300">
      {/* SIDEBAR */}
      <div
        className={`flex-col border-r border-white/10 bg-[#121212] w-full md:w-80 shrink-0 ${activeChatId ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 bg-neutral-900 border-b border-white/5 flex justify-between items-center shrink-0 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-900/20">
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
                  className="w-9 h-9 rounded-full bg-neutral-800 object-cover border border-white/5"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {activeChat.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-medium">
                    <Lock size={9} strokeWidth={3} /> {activeChat.status}
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
                <MoreVertical
                  size={20}
                  className="hover:text-white cursor-pointer transition-colors"
                />
                <button
                  onClick={onClose}
                  className="hidden md:block hover:text-red-400 font-bold ml-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a] relative custom-scrollbar">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

              <div className="flex justify-center my-6">
                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-lg border border-yellow-500/20 shadow-sm flex items-center gap-2 max-w-[90%] sm:max-w-fit">
                  <Lock size={12} className="shrink-0" />
                  <span className="text-[10px] sm:text-xs text-center leading-tight">
                    Messages are end-to-end encrypted. No one outside of this
                    chat, not even Signal, can read them.
                  </span>
                </div>
              </div>

              {activeChat.messages.map((msg, idx) => {
                const isMe = msg.sender === "me";
                // VISUAL BARRIER LOGIC: Show a date pill if it's the first message or if the date changed
                const showDateBarrier =
                  idx === 0 || activeChat.messages[idx - 1].date !== msg.date;

                return (
                  <div key={idx} className="flex flex-col relative z-10">
                    {/* VISUAL DATE/TIME BARRIER */}
                    {showDateBarrier && (
                      <div className="flex justify-center my-4">
                        <span className="text-[10px] font-bold tracking-wider text-neutral-500 bg-neutral-900 border border-white/5 px-3 py-1 rounded-full shadow-sm uppercase">
                          {msg.date || "Archive"}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-sm shadow-md leading-relaxed ${isMe ? "bg-green-700 text-white rounded-br-none" : "bg-neutral-800 text-neutral-100 rounded-bl-none border border-white/5"}`}
                      >
                        {msg.text}
                        <div
                          className={`text-[9px] mt-1 text-right font-medium opacity-70 ${isMe ? "text-green-100" : "text-neutral-400"}`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-[#121212] shrink-0 flex items-center gap-3 border-t border-white/5 z-20">
              <button className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                <div className="bg-white/10 rounded-full p-1">
                  <span className="text-xl leading-none font-light">+</span>
                </div>
              </button>
              <div className="flex-1 bg-neutral-800 rounded-full px-4 py-2.5 flex items-center gap-3 border border-transparent focus-within:border-white/10 transition-colors">
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
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-neutral-800/50 flex items-center justify-center border border-white/5">
                <Lock size={40} className="text-neutral-700" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-neutral-300 tracking-tight">
                Ph0enix Signal
              </h3>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Send and receive encrypted messages from anywhere in the
                network.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
