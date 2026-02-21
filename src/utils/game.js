import { LEVEL_CONFIG } from "../data/config";
import { decodeSecret } from "./crypto";

export const getLevelFlag = (levelId) => {
  const level = LEVEL_CONFIG.find((l) => l.id === levelId);
  return level ? decodeSecret(level.encryptedFlag) : "ERROR_NO_FLAG";
};

// Check if a terminal command is locked
export const checkCommandLock = (commandName, progressionIds) => {
  // Look at the new terminalCommands array we will add to config.js
  const level = LEVEL_CONFIG.find(
    (l) => l.terminalCommands && l.terminalCommands.includes(commandName),
  );

  if (!level) return { isLocked: false };

  // If the level has a requirement, check if it's in the combined progression array
  if (level.requires && !progressionIds.includes(level.requires)) {
    return { isLocked: true, requiredLevel: level.requires };
  }

  return { isLocked: false };
};

// Universal Level Unlock Checker for UI Apps
export const isLevelUnlocked = (targetLevelId, progressionIds) => {
  const level = LEVEL_CONFIG.find((l) => l.id === targetLevelId);
  if (!level) return false;
  if (!level.requires) return true;
  return progressionIds.includes(level.requires);
};
