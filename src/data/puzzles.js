import { LEVEL_CONFIG } from "./config";

// Import the actual Code
import Level01 from "../components/puzzles/Level01";
import Level02 from "../components/puzzles/Level02";
import Level03 from "../components/puzzles/Level03";
import Level04 from "../components/puzzles/Level04";
import Level05 from "../components/puzzles/Level05";
import Level06 from "../components/puzzles/Level06";
import Level12 from "../components/puzzles/Level12";

import { level07Commands } from "../components/puzzles/Level07";
import { level08Commands } from "../components/puzzles/Level08";
import { level09Commands } from "../components/puzzles/Level09";
import { level10Commands } from "../components/puzzles/Level10";

// Map Semantic IDs to their Code counterpart
const CODE_MAP = {
  "first-blood": {},
  "html-source": { component: Level01 },
  "design-v2": { component: Level02 },
  "system-logs": { component: Level03 },
  "secure-transmission": { component: Level04 },
  "corrupted-display": { component: Level05 },
  "session-manager": { component: Level06 },
  "hidden-services": { commands: level07Commands },
  "data-recovery": { commands: level08Commands },
  weaponization: { commands: level09Commands },
  "privilege-escalation": { commands: level10Commands },
  "digital-footprint": {},
  "visual-forensics": { component: Level12 },
};

// Merge them automatically
export const PUZZLE_CONFIG = LEVEL_CONFIG.map((config) => ({
  ...config,
  ...CODE_MAP[config.id],
}));
