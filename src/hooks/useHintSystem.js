import { useState, useEffect, useRef } from "react";
import { LEVEL_CONFIG } from "../data/config";
import { PERSONAS } from "../data/personas";
import { SensoryEngine } from "../utils/sensory";

export function useHintSystem(solvedIds = []) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isInitialMount = useRef(true);

  // 1. Load Persistent History on Mount
  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem("ph0enix_msg_history") || "[]",
    );
    const readIds = JSON.parse(
      localStorage.getItem("ph0enix_msg_read") || "[]",
    );

    setMessages(savedMessages);

    // Calculate unread count ignoring already read IDs
    const initialUnread = savedMessages.filter(
      (m) => !readIds.includes(m.id),
    ).length;
    setUnreadCount(initialUnread);

    // Allow a small buffer before enabling sounds so initial loads stay quiet
    setTimeout(() => {
      isInitialMount.current = false;
    }, 1500);
  }, []);

  // 2. The Live Hint Tracker
  useEffect(() => {
    const currentLevel = LEVEL_CONFIG.find((l) => !solvedIds.includes(l.id));
    const currentLevelId = currentLevel ? currentLevel.id : "endgame";

    const storageKey = `start_${currentLevelId}`;
    let startTime = localStorage.getItem(storageKey);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(storageKey, startTime);
    }

    const hydrateHint = (msg) => {
      const persona = PERSONAS[msg.sender];
      const now = new Date();
      return {
        ...msg,
        sender: persona || { name: "Unknown", id: "UNKNOWN" },
        // Add realistic timestamps and dates
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: now.toLocaleDateString([], { month: "short", day: "numeric" }),
      };
    };

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - parseInt(startTime)) / 1000;

      setMessages((prevMessages) => {
        let hasNewMessages = false;
        const newMessages = [...prevMessages];
        const existingIds = new Set(prevMessages.map((m) => m.id));

        LEVEL_CONFIG.forEach((level) => {
          // A. Check Past Levels
          if (solvedIds.includes(level.id) && level.hints) {
            level.hints.forEach((hint) => {
              if (!existingIds.has(hint.id)) {
                newMessages.push(hydrateHint(hint));
                hasNewMessages = true;
              }
            });
          }
          // B. Check Current Level
          else if (level.id === currentLevelId && level.hints) {
            level.hints.forEach((hint) => {
              if (hint.delay <= elapsedSeconds && !existingIds.has(hint.id)) {
                newMessages.push(hydrateHint(hint));
                hasNewMessages = true;
              }
            });
          }
        });

        if (hasNewMessages) {
          // Save updated history
          localStorage.setItem(
            "ph0enix_msg_history",
            JSON.stringify(newMessages),
          );

          // Calculate new unread
          const readIds = JSON.parse(
            localStorage.getItem("ph0enix_msg_read") || "[]",
          );
          const unread = newMessages.filter(
            (m) => !readIds.includes(m.id),
          ).length;
          setUnreadCount(unread);

          // FIRE SENSORY PING (Only if not initial load)
          if (!isInitialMount.current) {
            SensoryEngine.triggerAlert(); // Plays the ping + triggers vibration
          }

          return newMessages;
        }
        return prevMessages;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [solvedIds]);

  const markAsRead = () => {
    setMessages((prev) => {
      const allIds = prev.map((m) => m.id);
      localStorage.setItem("ph0enix_msg_read", JSON.stringify(allIds));
      setUnreadCount(0);
      return prev;
    });
  };

  return { messages, unreadCount, markAsRead };
}
