import { getLevelFlag } from "../../utils/game"; // Safe Import

// Get Flag without importing 'puzzles.js'
const RAW_FLAG = getLevelFlag("level-07");

const PORTS = {
  21: "ftp (vsftpd 3.0.3)",
  22: "ssh (OpenSSH 8.9p1)",
  80: "http (nginx 1.18.0)",
  31337: `unknown (${RAW_FLAG})`,
};

export const level07Commands = {
  netstat: {
    description: "Print network connections",
    execute: async (args, { addToHistory }) => {
      // Logic only. No locks here (Terminal handles it).
      addToHistory("system", "Active Internet connections (w/o servers)");
      addToHistory(
        "system",
        "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
      );
      addToHistory(
        "info",
        "tcp        0      0 127.0.0.1:31337         0.0.0.0:* LISTEN",
      );
      addToHistory(
        "info",
        "tcp        0      0 192.168.1.5:22          192.168.1.50:44322      ESTABLISHED",
      );
    },
  },

  nmap: {
    description: "Network exploration tool",
    execute: async (args, { addToHistory }) => {
      if (args.length < 2) {
        addToHistory("error", "Usage: nmap <target_ip>");
        return;
      }
      const target = args[1];
      if (target === "localhost" || target === "127.0.0.1") {
        addToHistory("info", "PORT      STATE SERVICE");
        Object.entries(PORTS).forEach(([port, service]) => {
          addToHistory("success", `${port}/tcp   open  ${service}`);
        });
      } else {
        addToHistory("error", `Scanning ${target} restricted.`);
      }
    },
  },
};
