// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Kid-Friendly Relaxed Pace Constants
// ─────────────────────────────────────────────

export const CANVAS_W = 480;
export const CANVAS_H = 854;

// ── 3 Wide Current Lanes ──────────────────────
export const LANE_COUNT = 3;
export const LANE_WIDTH = 115;
export const LANE_CENTERS = [
  CANVAS_W / 2 - LANE_WIDTH, // 125
  CANVAS_W / 2,              // 240
  CANVAS_W / 2 + LANE_WIDTH, // 355
];

// ── Screen Positions ──────────────────────────
export const SPAWN_Y = -70;
export const PLAYER_Y = 570;
export const SHARK_FOLLOW_Y = 695;
export const SHARK_ATTACK_Y = 620;
export const DIVE_SCALE = 0.70;
export const GIANT_SCALE = 1.45;
export const DIVE_DURATION_MS = 1100;

// ── Kid-Friendly Speeds ───────────────────────
export const BASE_SPEED = 2.8;
export const SPEED_ACCEL = 0.00015;
export const MAX_SPEED = 5.8;
export const SPEED_BOOST_MULTIPLIER = 1.4;

// ── Power-Ups ─────────────────────────────────
export const POWERUP_DURATION_MS = 6500;
export const POWERUP_TYPES = ['speed', 'giant', 'shield'];

// ── Spawn Intervals & Safe Spacing ────────────
export const OBSTACLE_SPAWN_INTERVAL = 2400;
export const ITEM_SPAWN_INTERVAL = 550;
export const SAFE_SPAWN_GAP = 200;

// ── Scoring ───────────────────────────────────
export const SCORE_PER_TICK = 1;
export const PEARL_POINTS = 50;
export const EAT_OBSTACLE_POINTS = 80;

// ── Palette ───────────────────────────────────
export const PALETTE = {
  abyss: '#020914',
  waterDark: '#04162c',
  waterMid: '#092f4d',
  waterLight: '#0d5c75',
  laneDivider: 'rgba(0, 245, 212, 0.25)',
  laneGlow: 'rgba(0, 245, 212, 0.08)',
  player: '#00f5d4',
  playerGlow: '#38bdf8',
  giantGold: '#facc15',
  giantGlow: '#f59e0b',
  shieldCyan: '#38bdf8',
  speedYellow: '#fef08a',
  shark: '#334155',
  sharkBelly: '#94a3b8',
  sharkEye: '#facc15',
  jelly: '#c084fc',
  jellyGlow: '#e879f9',
  coral: '#f97316',
  coralGlow: '#ea580c',
  eel: '#22c55e',
  pearl: '#ffffff',
  pearlGlow: '#38bdf8',
  bubble: 'rgba(186, 230, 253, 0.65)',
};
