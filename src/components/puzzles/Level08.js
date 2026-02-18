import { FILE_SYSTEM, FILE_CONTENTS } from "../../data/filesystem";
import { getLevelFlag } from "../../utils/game";

// ask the game engine for the flag associated with 'level-08'.
const RAW_FLAG = getLevelFlag("level-08");

// 2. DEFINE CONTENT
const getSecretFileContent = () => `
# SYSTEM BACKUP CONFIGURATION
# Created: 2026-02-14
[database]
host=localhost
port=5432
user=admin
# password=... (redacted)

[legacy_systems]
# Old keys from the 2025 migration
server_key_1: A8F9-22K1-00L2
server_key_2: B2J1-99L0-11M3

# SECURITY AUDIT LOG
# ------------------
# CRITICAL: Found unencrypted flag in memory dump
recovered_data: ${RAW_FLAG}
# Action: Please rotate keys immediately.
`;

// 3. INJECT FILE (Self-Setup)
const injectLevelData = () => {
  const backupPath = "/var/backups";
  const logPath = "/var/log/syslog";
  const secretFile = "passwords.old";

  // Create file if missing
  if (
    FILE_SYSTEM[backupPath] &&
    !FILE_SYSTEM[backupPath].children.includes(secretFile)
  ) {
    FILE_SYSTEM[backupPath].children.push(secretFile);
    // Dynamic content with the real flag
    FILE_CONTENTS[`${backupPath}/${secretFile}`] = getSecretFileContent();
  }

  // Add hint to logs
  const hintLog = `
Feb 17 10:15:00 ph0enix kernel: [sdc] Attached SCSI removable disk
Feb 17 10:15:01 ph0enix systemd[1]: Mounted /var/backups (read-only)
Feb 17 10:15:05 ph0enix kernel: [sdc] Write Protect is on.
`;

  if (
    FILE_CONTENTS[logPath] &&
    !FILE_CONTENTS[logPath].includes("Mounted /var/backups")
  ) {
    FILE_CONTENTS[logPath] += hintLog;
  }
};

// Run injection immediately
injectLevelData();

// 4. EXPORT COMMANDS
export const level08Commands = {
  grep: {
    description: "Search for patterns in files",
    execute: (args, { addToHistory, cwd }) => {
      if (args.length < 3) {
        addToHistory("error", "Usage: grep <pattern> <filename>");
        return;
      }

      const pattern = args[1];
      const filename = args[2];

      // Resolve path
      const fullPath = filename.startsWith("/")
        ? filename
        : cwd === "/"
          ? `/${filename}`
          : `${cwd}/${filename}`;

      const content = FILE_CONTENTS[fullPath];

      if (!content) {
        if (FILE_SYSTEM[fullPath]) {
          addToHistory("error", `grep: ${filename}: Is a directory`);
        } else {
          addToHistory("error", `grep: ${filename}: No such file`);
        }
        return;
      }

      // Perform Search
      const lines = content.split("\n");
      const matches = lines.filter((line) => line.includes(pattern));

      if (matches.length > 0) {
        matches.forEach((match) => addToHistory("success", match.trim()));
      } else {
        addToHistory("info", "No matches found.");
      }
    },
  },
};
