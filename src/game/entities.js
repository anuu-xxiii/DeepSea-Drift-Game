// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Entity Factories
// ─────────────────────────────────────────────

import {
  LANE_CENTERS,
  PLAYER_Y,
  SHARK_FOLLOW_Y,
  SPAWN_Y,
} from './constants.js';

export function createPlayer() {
  return {
    lane: 1,
    x: LANE_CENTERS[1],
    targetX: LANE_CENTERS[1],
    y: PLAYER_Y,
    diving: false,
    diveMs: 0,
    activePowerup: null,
    powerupMs: 0,
    hasShield: false,
    wobblePhase: 0,
    stumbleTimer: 0,
  };
}

export function createShark() {
  return {
    x: LANE_CENTERS[1],
    y: SHARK_FOLLOW_Y,
    jawPhase: 0,
    tailPhase: 0,
  };
}

export function createObstacle(lane, type) {
  const types = ['jellyfish', 'coral', 'eel', 'fishShoal', 'coral'];
  const chosenType = type || types[Math.floor(Math.random() * types.length)];

  return {
    id: Math.random(),
    lane,
    type: chosenType,
    x: LANE_CENTERS[lane],
    y: SPAWN_Y,
    alive: true,
    phase: Math.random() * Math.PI * 2,
  };
}

export function createPearl(lane) {
  return {
    id: Math.random(),
    lane,
    type: 'pearl',
    x: LANE_CENTERS[lane],
    y: SPAWN_Y,
    alive: true,
    phase: Math.random() * Math.PI * 2,
  };
}

export function createPowerup(lane, type) {
  const types = ['speed', 'giant', 'shield'];
  const chosenType = type || types[Math.floor(Math.random() * types.length)];

  return {
    id: Math.random(),
    lane,
    type: chosenType,
    x: LANE_CENTERS[lane],
    y: SPAWN_Y,
    alive: true,
    phase: Math.random() * Math.PI * 2,
  };
}

export function createSparkle(x, y, color) {
  return {
    x: x + (Math.random() - 0.5) * 18,
    y: y + (Math.random() - 0.5) * 18,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6 - 2,
    size: 3 + Math.random() * 5,
    color: color || '#00f5d4',
    life: 1,
    decay: 0.04 + Math.random() * 0.03,
  };
}

export function createBubble(px, py, isIntense = false) {
  return {
    x: px + (Math.random() - 0.5) * (isIntense ? 40 : 22),
    y: py + 22 + Math.random() * 10,
    r: isIntense ? 3 + Math.random() * 6 : 2 + Math.random() * 4,
    vx: (Math.random() - 0.5) * (isIntense ? 2.5 : 0.8),
    vy: (isIntense ? 3.5 : 1.2) + Math.random() * 2,
    life: 1,
    decay: isIntense ? 0.025 : 0.018,
  };
}
