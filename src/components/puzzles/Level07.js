export const level07Commands = {
  // Command 1: Enumeration
  netstat: {
    description: "List active network connections",
    execute: async (args, { addToHistory }) => {
      addToHistory("system", "Scanning active sockets...");

      // We simulate a delay to make it feel real
      await new Promise((r) => setTimeout(r, 500));

      addToHistory("info", "Proto  Local Address          State");
      addToHistory("user", "tcp    127.0.0.1:80           ESTABLISHED");
      addToHistory("user", "tcp    192.168.1.5:443        ESTABLISHED");
      // The Hint
      addToHistory(
        "error",
        "tcp    127.0.0.1:1337         LISTEN      <-- INTERNAL_ONLY",
      );
    },
  },

  // Command 2: Exploitation
  fetch: {
    description: "Retrieve data from a URL or IP",
    execute: async (args, { addToHistory }) => {
      if (args.length < 2) {
        addToHistory("error", "USAGE: fetch <url_or_ip>");
        return;
      }
      const target = args[1];

      addToHistory("system", `Connecting to ${target}...`);
      await new Promise((r) => setTimeout(r, 800));

      // Logic Check
      if (
        target.includes("127.0.0.1:1337") ||
        target.includes("localhost:1337")
      ) {
        addToHistory("success", "HTTP/1.1 200 OK");
        addToHistory("success", "Content-Type: text/plain");
        addToHistory("info", "");
        // The Flag matches the hash in puzzles.js
        addToHistory("success", "flag{ports_are_open}");
      } else if (target.includes("1337")) {
        addToHistory(
          "error",
          "Error: Connection refused. Did you mean 127.0.0.1?",
        );
      } else {
        addToHistory("error", "Error: Connection timed out (Firewall blocked)");
      }
    },
  },
};
