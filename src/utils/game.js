import { LEVEL_CONFIG } from "../data/config";
import { decodeSecret } from "./crypto";

// Get Flag (Safe access for Levels)
export const getLevelFlag = (levelId) => {
  const level = LEVEL_CONFIG.find((l) => l.id === levelId);
  return level ? decodeSecret(level.encryptedFlag) : "ERROR_NO_FLAG";
};

// Check Lock (Safe access for Terminal)
export const checkCommandLock = (commandName, solvedIds) => {
  // Find which level owns this command (by string match)
  const level = LEVEL_CONFIG.find((l) =>
    l.terminalCommands?.includes(commandName),
  );

  if (!level) return { isLocked: false }; // Command is public

  if (level.requires && !solvedIds.includes(level.requires)) {
    return { isLocked: true, requiredLevel: level.requires };
  }

  return { isLocked: false };
};
