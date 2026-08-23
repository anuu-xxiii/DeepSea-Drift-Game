// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — 3D Perspective Projection Engine
//  Converts 3D World Coordinates (X, Y, Z) to
//  2D Screen Coordinates (x, y, scale) with
//  Subway Surfers-style forward vanishing perspective.
// ─────────────────────────────────────────────

import { FOV_SCALE, VANISHING_X, VANISHING_Y } from './constants.js';

/**
 * Projects a 3D point in the underwater trench onto the 2D canvas screen.
 * @param {number} worldX - Horizontal offset (-130 = Left, 0 = Center, +130 = Right)
 * @param {number} worldY - Depth from top (+90 = Normal swim, +170 = Dive down)
 * @param {number} worldZ - Distance forward in front of camera (0 to 1600)
 */
export function project3D(worldX, worldY, worldZ) {
  if (worldZ <= -50) {
    return { screenX: VANISHING_X, screenY: VANISHING_Y, scale: 0, visible: false };
  }

  // Perspective divide factor
  const depthFactor = Math.max(1, worldZ + 120);
  const scale = FOV_SCALE / depthFactor;

  const screenX = VANISHING_X + worldX * scale;
  const screenY = VANISHING_Y + worldY * scale;

  return {
    screenX,
    screenY,
    scale,
    depth: worldZ,
    visible: worldZ > -30 && worldZ < 2000,
  };
}
