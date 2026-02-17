import { supabase } from "../lib/supabase";

export const SYSTEM_COMMANDS = {
  help: {
    description: "Show this menu",
    execute: (args, { addToHistory, registry }) => {
      addToHistory("info", "AVAILABLE COMMANDS:");
      Object.entries(registry).forEach(([name, def]) => {
        addToHistory("info", `${name.padEnd(12)} - ${def.description}`);
      });
    },
  },

  clear: {
    description: "Clear terminal",
    execute: (args, { setHistory }) => {
      setHistory([]);
    },
  },

  whoami: {
    description: "Show current user",
    execute: (args, { addToHistory, user }) => {
      addToHistory("success", `USER: ${user?.email}`);
      addToHistory("success", `UUID: ${user?.id}`);
    },
  },

  panic: {
    description: "Trigger Kernel Panic",
    execute: (args, { addToHistory, setCrash }) => {
      addToHistory("system", "Initiating kernel dump...");
      setTimeout(() => {
        setCrash(true);
      }, 1000);
    },
  },

  submit: {
    description: "Submit a capture flag",
    execute: async (args, { addToHistory }) => {
      if (args.length < 3) {
        addToHistory("error", "USAGE: submit <level-id> <flag>");
        return;
      }
      const puzzleId = args[1];
      const flagAttempt = args[2];

      addToHistory("system", "Verifying hash signature...");

      try {
        const { data, error } = await supabase.rpc("submit_flag", {
          puzzle_id_input: puzzleId,
          flag_input: flagAttempt,
        });

        if (error) throw error;

        if (data === true) {
          addToHistory("success", "ACCESS GRANTED. Flag accepted.");
          addToHistory(
            "success",
            "Points have been transferred to your profile.",
          );
        } else {
          addToHistory(
            "error",
            "ACCESS DENIED. Invalid flag or already solved.",
          );
        }
      } catch (err) {
        addToHistory("error", `SYSTEM ERROR: ${err.message}`);
      }
    },
  },
};
