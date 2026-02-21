import { useState, useEffect, useRef } from "react";
import { LEVEL_CONFIG } from "../data/config";
import { PERSONAS } from "../data/personas";
import { SensoryEngine } from "../utils/sensory";

export function useHintSystem(solvedIds = [], skippedIds = []) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const initialized = useRef(false);
  const processedIds = useRef(new Set());

  // Initial Load from LocalStorage
  useEffect(() => {
    const savedMessages = JSON.parse(
      localStorage.getItem("ph0enix_msg_history") || "[]",
    );
    const readIds = JSON.parse(
      localStorage.getItem("ph0enix_msg_read") || "[]",
    );

    setMessages(savedMessages);
    savedMessages.forEach((m) => processedIds.current.add(m.id));

    const initialUnread = savedMessages.filter(
      (m) => !readIds.includes(m.id),
    ).length;
    setUnreadCount(initialUnread);

    setTimeout(() => {
      initialized.current = true;
    }, 1000);
  }, []);

  // Live Hint Tracker
  useEffect(() => {
    const currentLevel = LEVEL_CONFIG.find(
      (l) => !solvedIds.includes(l.id) && !skippedIds.includes(l.id),
    );
    const currentLevelId = currentLevel ? currentLevel.id : "endgame";

    const storageKey = `start_${currentLevelId}`;
    let startTime = localStorage.getItem(storageKey);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(storageKey, startTime);
    }

    const hydrateHint = (msg, levelId) => {
      const persona = PERSONAS[msg.sender];
      const now = new Date();
      return {
        ...msg,
        levelId: levelId,
        sender: persona || { name: "Unknown", id: "UNKNOWN" },
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

        LEVEL_CONFIG.forEach((level) => {
          // A. If a level is solved OR SKIPPED, immediately dump all its hints
          if (
            (solvedIds.includes(level.id) || skippedIds.includes(level.id)) &&
            level.hints
          ) {
            level.hints.forEach((hint) => {
              if (!processedIds.current.has(hint.id)) {
                newMessages.push(hydrateHint(hint, level.id));
                processedIds.current.add(hint.id);
                hasNewMessages = true;
              }
            });
          }
          // B. Check Current Level timer
          else if (level.id === currentLevelId && level.hints) {
            level.hints.forEach((hint) => {
              if (
                hint.delay <= elapsedSeconds &&
                !processedIds.current.has(hint.id)
              ) {
                newMessages.push(hydrateHint(hint, level.id));
                processedIds.current.add(hint.id);
                hasNewMessages = true;
              }
            });
          }
        });

        if (hasNewMessages) {
          localStorage.setItem(
            "ph0enix_msg_history",
            JSON.stringify(newMessages),
          );
          const readIds = JSON.parse(
            localStorage.getItem("ph0enix_msg_read") || "[]",
          );
          const unread = newMessages.filter(
            (m) => !readIds.includes(m.id),
          ).length;
          setUnreadCount(unread);

          if (initialized.current) SensoryEngine.triggerAlert();
          return newMessages;
        }
        return prevMessages;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [solvedIds, skippedIds]);

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
