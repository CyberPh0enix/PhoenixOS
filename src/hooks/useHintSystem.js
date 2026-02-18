import { useState, useEffect } from "react";
import { LEVEL_CONFIG } from "../data/config";
import { PERSONAS } from "../data/personas";

export function useHintSystem(solvedIds = []) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Identify Current Level
    const currentLevel = LEVEL_CONFIG.find((l) => !solvedIds.includes(l.id));
    const currentLevelId = currentLevel ? currentLevel.id : "endgame";

    // 2. Track Time
    const storageKey = `start_${currentLevelId}`;
    let startTime = localStorage.getItem(storageKey);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(storageKey, startTime);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - parseInt(startTime)) / 1000;
      let allUnlockedMessages = [];

      // 3. COLLECT HINTS
      LEVEL_CONFIG.forEach((level) => {
        // A. Past Levels (Show all)
        if (solvedIds.includes(level.id) && level.hints) {
          allUnlockedMessages.push(...level.hints);
        }
        // B. Current Level (Check delay)
        else if (level.id === currentLevelId && level.hints) {
          const dueHints = level.hints.filter((h) => h.delay <= elapsedSeconds);
          allUnlockedMessages.push(...dueHints);
        }
      });

      // 4. HYDRATE (The Magic Step)
      // This turns "GLITCH" into the full object { name: "Glitch_01", ... }
      const hydratedMessages = allUnlockedMessages.map((msg) => {
        // Look up the persona by ID string
        const persona = PERSONAS[msg.sender];
        return {
          ...msg,
          sender: persona || { name: "Unknown", id: "UNKNOWN" }, // Fallback
          time: "Encrypted",
        };
      });

      setMessages((prev) => {
        if (prev.length !== hydratedMessages.length) {
          const newCount = hydratedMessages.length - prev.length;
          if (newCount > 0) setUnreadCount((c) => c + newCount);
          return hydratedMessages;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [solvedIds]);

  const markAsRead = () => setUnreadCount(0);

  return { messages, unreadCount, markAsRead };
}
