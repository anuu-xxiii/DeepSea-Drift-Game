// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — 2.5D Tilted Renderer
//  3 current lanes, continuous side coral reef walls,
//  fish shoal obstacles, and chasing shark Bruce.
// ─────────────────────────────────────────────

import {
  CANVAS_W, CANVAS_H,
  LANE_CENTERS, LANE_WIDTH,
  PALETTE, DIVE_SCALE, GIANT_SCALE,
} from './constants.js';

function glow(ctx, color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}
function noGlow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// ── 1. Environment ────────────────────────────
export function render3DEnvironment(ctx, trackOffset, speed, gameTime) {
  // Ocean gradient
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, PALETTE.abyss);
  bg.addColorStop(0.4, PALETTE.waterDark);
  bg.addColorStop(1, PALETTE.waterMid);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Surface light rays
  for (let i = 0; i < 4; i++) {
    const rx = 60 + i * 110 + Math.sin(gameTime * 0.0012 + i * 1.5) * 20;
    const rayGrad = ctx.createLinearGradient(rx, 0, rx * 1.5, CANVAS_H);
    rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
    rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rx - 35, 0);
    ctx.lineTo(rx + 35, 0);
    ctx.lineTo(rx + 65, CANVAS_H);
    ctx.lineTo(rx - 65, CANVAS_H);
    ctx.closePath();
    ctx.fill();
  }

  const leftRail = LANE_CENTERS[0] - LANE_WIDTH / 2;
  const rightRail = LANE_CENTERS[2] + LANE_WIDTH / 2;

  // Track bed
  ctx.fillStyle = 'rgba(0, 245, 212, 0.04)';
  ctx.fillRect(leftRail, 0, rightRail - leftRail, CANVAS_H);

  // Lane dividers
  for (let i = 0; i <= 3; i++) {
    const lx = leftRail + i * LANE_WIDTH;
    ctx.save();
    ctx.strokeStyle = (i === 0 || i === 3) ? 'rgba(0, 245, 212, 0.55)' : PALETTE.laneDivider;
    ctx.lineWidth = (i === 0 || i === 3) ? 3.5 : 2;
    if (i !== 0 && i !== 3) {
      ctx.setLineDash([16, 18]);
      ctx.lineDashOffset = -trackOffset * 1.2;
    }
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, CANVAS_H);
    ctx.stroke();
    ctx.restore();
  }

  // Continuous side reef walls
  renderSideReefWalls(ctx, trackOffset, leftRail, rightRail);

  // Depth ripple rings
  const rippleSpacing = 110;
  const rippleCount = Math.ceil(CANVAS_H / rippleSpacing) + 2;
  for (let i = 0; i < rippleCount; i++) {
    const ry = ((i * rippleSpacing) + trackOffset) % (CANVAS_H + rippleSpacing) - 40;
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.09)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(leftRail + 8, ry);
    ctx.lineTo(rightRail - 8, ry);
    ctx.stroke();
  }
}

function renderSideReefWalls(ctx, trackOffset, leftRail, rightRail) {
  const wallSpacing = 140;
  const count = Math.ceil(CANVAS_H / wallSpacing) + 2;

  for (let i = -1; i < count; i++) {
    const wy = ((i * wallSpacing) + trackOffset) % (CANVAS_H + wallSpacing) - 40;

    // Left wall
    ctx.save();
    glow(ctx, '#0891b2', 16);
    ctx.fillStyle = '#062d42';
    ctx.beginPath();
    ctx.ellipse(leftRail - 22, wy, 38, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f97316';
    glow(ctx, '#ea580c', 12);
    ctx.beginPath();
    ctx.arc(leftRail - 10, wy - 15, 12, 0, Math.PI * 2);
    ctx.arc(leftRail - 15, wy + 15, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right wall
    ctx.save();
    glow(ctx, '#7e22ce', 16);
    ctx.fillStyle = '#1e0533';
    ctx.beginPath();
    ctx.ellipse(rightRail + 22, wy, 38, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c084fc';
    glow(ctx, '#e879f9', 12);
    ctx.beginPath();
    ctx.arc(rightRail + 10, wy - 15, 12, 0, Math.PI * 2);
    ctx.arc(rightRail + 15, wy + 15, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  noGlow(ctx);
}

// ── 2. Chasing Shark ──────────────────────────
export function renderChasingShark(ctx, shark, gameTime) {
  const { x, y, jawPhase, tailPhase } = shark;
  const jawOpen = (Math.sin(jawPhase) + 1) * 0.5 * 14;
  const tailWag = Math.sin(tailPhase) * 18;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(1, 6, 18, 0.65)';
  ctx.beginPath();
  ctx.ellipse(10, 20, 58, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-14, 44);
  ctx.quadraticCurveTo(tailWag, 82, tailWag * 1.4, 98);
  ctx.quadraticCurveTo(tailWag * 0.6, 82, 14, 44);
  ctx.closePath();
  ctx.fill();

  // Body
  glow(ctx, 'rgba(56,189,248,0.4)', 22);
  ctx.fillStyle = PALETTE.shark;
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.quadraticCurveTo(50, -16, 38, 44);
  ctx.quadraticCurveTo(0, 56, -38, 44);
  ctx.quadraticCurveTo(-50, -16, 0, -50);
  ctx.closePath();
  ctx.fill();

  // Belly
  ctx.fillStyle = PALETTE.sharkBelly;
  ctx.beginPath();
  ctx.ellipse(0, -16, 29, 24 + jawOpen * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.ellipse(0, -20, 20, 14 + jawOpen * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Teeth
  ctx.fillStyle = '#ffffff';
  for (let t = -3; t <= 3; t++) {
    ctx.beginPath();
    ctx.moveTo(t * 5.5 - 3, -29);
    ctx.lineTo(t * 5.5 + 3, -29);
    ctx.lineTo(t * 5.5, -21);
    ctx.closePath();
    ctx.fill();
  }

  // Eyes
  glow(ctx, PALETTE.sharkEye, 16);
  ctx.fillStyle = PALETTE.sharkEye;
  ctx.beginPath();
  ctx.arc(-24, -30, 6, 0, Math.PI * 2);
  ctx.arc(24, -30, 6, 0, Math.PI * 2);
  ctx.fill();

  noGlow(ctx);
  ctx.fillStyle = '#000000';
  ctx.fillRect(-25, -34, 2.5, 8);
  ctx.fillRect(23, -34, 2.5, 8);

  // Dorsal fin
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, -36); ctx.lineTo(-8, 10); ctx.lineTo(8, 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ── 3. Player ────────────────────────────────
export function renderPlayer(ctx, player, gameTime) {
  const { x, y, diving, activePowerup, hasShield, wobblePhase } = player;
  const wobble = Math.sin(wobblePhase) * 7;

  let scale = 1.0;
  if (diving) scale = DIVE_SCALE;
  else if (activePowerup === 'giant') scale = GIANT_SCALE;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(1, 6, 18, 0.55)';
  ctx.beginPath();
  ctx.ellipse(9, diving ? 12 : 28, 24 * scale, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(scale, scale);

  // Auras
  if (activePowerup === 'speed') {
    glow(ctx, '#fde047', 40);
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + gameTime * 0.012;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * 40, Math.sin(ang) * 40, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (activePowerup === 'giant') {
    glow(ctx, '#f59e0b', 45);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ TITAN CHOMP ⚡', 0, -54);
  }

  if (hasShield) {
    glow(ctx, '#38bdf8', 35);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (diving) {
    glow(ctx, '#00f5d4', 38);
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.95)';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(0, 245, 212, 0.28)';
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#00f5d4';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('▼ SUBMERGED ▼', 0, -48);
  }

  // Body
  const bodyColor = activePowerup === 'giant' ? PALETTE.giantGold : PALETTE.player;
  const glowColor = activePowerup === 'giant' ? PALETTE.giantGlow : (diving ? '#38bdf8' : PALETTE.playerGlow);
  glow(ctx, glowColor, 28);
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 21, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stripes
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 3;
  for (let s = -1; s <= 1; s++) {
    ctx.beginPath();
    ctx.moveTo(s * 9, -12);
    ctx.lineTo(s * 9, 14);
    ctx.stroke();
  }

  // Tail
  const tailColor = activePowerup === 'giant' ? '#d97706' : '#0284c7';
  ctx.fillStyle = tailColor;
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.lineTo(-16 + wobble, 54);
  ctx.lineTo(0, 44);
  ctx.lineTo(16 + wobble, 54);
  ctx.closePath();
  ctx.fill();

  // Fins
  ctx.beginPath();
  ctx.moveTo(-18, 2); ctx.lineTo(-32, 16); ctx.lineTo(-18, 20); ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18, 2); ctx.lineTo(32, 16); ctx.lineTo(18, 20); ctx.closePath();
  ctx.fill();

  // Eyes
  noGlow(ctx);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-9, -18, 6, 0, Math.PI * 2);
  ctx.arc(9, -18, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#030c1e';
  ctx.beginPath();
  ctx.arc(-9, -20, 3.5, 0, Math.PI * 2);
  ctx.arc(9, -20, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ── 4. Obstacles ──────────────────────────────
export function renderObstacle(ctx, obs, gameTime) {
  if (!obs.alive) return;
  const { x, y, type, phase } = obs;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(1, 6, 18, 0.5)';
  ctx.beginPath();
  ctx.ellipse(14, 32, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === 'fishShoal') {
    // ── School of Fish ──
    glow(ctx, '#38bdf8', 26);
    for (let i = 0; i < 7; i++) {
      const swX = (i % 3 - 1) * 26 + Math.sin(gameTime * 0.008 + i) * 8;
      const swY = (Math.floor(i / 3) - 1) * 22 + Math.cos(gameTime * 0.008 + i) * 6;
      ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#00f5d4';
      ctx.beginPath();
      ctx.ellipse(swX, swY, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(swX, swY + 12);
      ctx.lineTo(swX - 6, swY + 20);
      ctx.lineTo(swX + 6, swY + 20);
      ctx.closePath();
      ctx.fill();
    }
    ctx.font = 'bold 11px system-ui';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('SHOAL!', 0, -32);
  } else if (type === 'jellyfish') {
    // ── Jellyfish ──
    const pulse = (Math.sin(gameTime * 0.005 + phase) + 1) * 0.12 + 0.88;
    const r = 34 * pulse;
    glow(ctx, PALETTE.jellyGlow, 30);
    const jGrad = ctx.createRadialGradient(0, -6, 3, 0, 0, r);
    jGrad.addColorStop(0, 'rgba(232, 121, 249, 0.98)');
    jGrad.addColorStop(0.6, 'rgba(192, 132, 252, 0.8)');
    jGrad.addColorStop(1, 'rgba(147, 51, 234, 0.2)');
    ctx.fillStyle = jGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(232, 121, 249, 0.85)';
    ctx.lineWidth = 3;
    for (let t = -3; t <= 3; t++) {
      const wave = Math.sin(gameTime * 0.006 + phase + t) * 10;
      ctx.beginPath();
      ctx.moveTo(t * 9, 0);
      ctx.quadraticCurveTo(t * 9 + wave, 22, t * 9 + wave * 1.5, 46);
      ctx.stroke();
    }
  } else if (type === 'coral') {
    // ── Coral ──
    glow(ctx, PALETTE.coralGlow, 25);
    ctx.fillStyle = PALETTE.coral;
    ctx.beginPath();
    ctx.roundRect(-16, -32, 32, 64, 10);
    ctx.fill();
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    [[-24, -18], [24, -14], [-20, 16], [22, 20]].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(bx, by); ctx.stroke();
    });
    ctx.fillStyle = '#fde047';
    glow(ctx, '#fde047', 14);
    [[-24, -18], [24, -14], [-20, 16], [22, 20]].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
    });
  } else {
    // ── Electric Eel ──
    const slither = Math.sin(gameTime * 0.008 + phase) * 20;
    glow(ctx, '#4ade80', 28);
    ctx.strokeStyle = PALETTE.eel;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.bezierCurveTo(slither, -14, -slither, 14, 0, 40);
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    glow(ctx, '#facc15', 16);
    ctx.beginPath();
    ctx.arc(slither * 0.3, -32, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  noGlow(ctx);
  ctx.restore();
}

// ── 5. Power-Ups ──────────────────────────────
export function renderPowerup(ctx, item, gameTime) {
  if (!item.alive) return;
  const { x, y, type, phase } = item;
  const bob = Math.sin(gameTime * 0.004 + phase) * 6;

  ctx.save();
  ctx.translate(x, y + bob);

  ctx.fillStyle = 'rgba(1, 6, 18, 0.5)';
  ctx.beginPath();
  ctx.ellipse(10, 30, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  const r = 27;

  if (type === 'speed') {
    glow(ctx, '#facc15', 35);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.32)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(3, -16); ctx.lineTo(-11, 2); ctx.lineTo(0, 2);
    ctx.lineTo(-3, 16); ctx.lineTo(11, -2); ctx.lineTo(0, -2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.font = `bold 9px system-ui`; ctx.textAlign = 'center';
    ctx.fillText('SPEED', 0, r + 14);
  } else if (type === 'giant') {
    glow(ctx, '#f97316', 35);
    ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-13, 0); ctx.lineTo(-21, -7); ctx.lineTo(-21, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.font = `bold 9px system-ui`; ctx.textAlign = 'center';
    ctx.fillText('GIANT', 0, r + 14);
  } else {
    glow(ctx, '#38bdf8', 35);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(11, -7); ctx.lineTo(9, 8);
    ctx.lineTo(0, 14); ctx.lineTo(-9, 8); ctx.lineTo(-11, -7);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7dd3fc';
    ctx.font = `bold 9px system-ui`; ctx.textAlign = 'center';
    ctx.fillText('SHIELD', 0, r + 14);
  }

  noGlow(ctx);
  ctx.restore();
}

// ── 6. Pearl ─────────────────────────────────
export function renderPearl(ctx, item, gameTime) {
  if (!item.alive) return;
  const { x, y, phase } = item;
  const bob = Math.sin(gameTime * 0.004 + phase) * 5;
  const r = 19;

  ctx.save();
  ctx.translate(x, y + bob);

  ctx.fillStyle = 'rgba(1, 6, 18, 0.45)';
  ctx.beginPath();
  ctx.ellipse(8, 24, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  glow(ctx, PALETTE.pearlGlow, 28);
  const pGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
  pGrad.addColorStop(0, '#ffffff');
  pGrad.addColorStop(0.35, '#bae6fd');
  pGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = pGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.arc(-5, -5, 5, 0, Math.PI * 2);
  ctx.fill();

  noGlow(ctx);
  ctx.restore();
}

// ── 7. Sparkles ───────────────────────────────
export function renderSparkles(ctx, sparkles) {
  sparkles.forEach((sp) => {
    ctx.save();
    ctx.globalAlpha = sp.life;
    glow(ctx, sp.color, 14);
    ctx.fillStyle = sp.color;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, Math.max(1, sp.size * sp.life), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  noGlow(ctx);
  ctx.globalAlpha = 1;
}

// ── 8. Bubbles ────────────────────────────────
export function renderBubbles(ctx, bubbles) {
  bubbles.forEach((b) => {
    ctx.save();
    ctx.globalAlpha = b.life * 0.75;
    ctx.strokeStyle = PALETTE.bubble;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

// ── 9. Depth Vignette ─────────────────────────
export function renderDepthVignette(ctx, speed) {
  const depthFactor = Math.min(1, speed / 14);
  const alpha = 0.08 + depthFactor * 0.35;
  const vig = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.25,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.75
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, `rgba(1, 8, 20, ${alpha.toFixed(2)})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}
