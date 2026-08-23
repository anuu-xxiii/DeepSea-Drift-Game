// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Game Canvas (screen-Y world loop)
// ─────────────────────────────────────────────

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGameLoop } from '../game/useGameLoop.js';
import { useInput } from '../game/useInput.js';
import {
  createPlayer, createShark,
  createObstacle, createPearl, createPowerup,
  createSparkle, createBubble,
} from '../game/entities.js';
import {
  render3DEnvironment,
  renderChasingShark,
  renderPlayer,
  renderObstacle,
  renderPowerup,
  renderPearl,
  renderSparkles,
  renderBubbles,
  renderDepthVignette,
} from '../game/renderer.js';
import {
  CANVAS_W, CANVAS_H,
  LANE_CENTERS,
  BASE_SPEED, SPEED_ACCEL, MAX_SPEED, SPEED_BOOST_MULTIPLIER,
  PLAYER_Y, SHARK_FOLLOW_Y, SHARK_ATTACK_Y,
  DIVE_DURATION_MS, POWERUP_DURATION_MS,
  OBSTACLE_SPAWN_INTERVAL, ITEM_SPAWN_INTERVAL, SAFE_SPAWN_GAP,
  PEARL_POINTS, EAT_OBSTACLE_POINTS,
} from '../game/constants.js';
import {
  sfxPearl, sfxPowerup, sfxEatObstacle,
  sfxShieldPop, sfxDive, sfxSwitch, sfxGameOver,
} from '../game/audio.js';

import HUD from './HUD.jsx';
import Controls from './Controls.jsx';

function initState() {
  return {
    player: createPlayer(),
    shark: createShark(),
    obstacles: [],
    collectibles: [],
    powerups: [],
    sparkles: [],
    bubbles: [],
    baseSpeed: BASE_SPEED,
    trackOffset: 0,
    lastObstacleTick: 0,
    lastItemTick: 0,
    lastPowerupTick: 0,
    score: 0,
    pearls: 0,
    gameTime: 0,
  };
}

export default function GameCanvas({ onGameOver, onPause, onScoreUpdate, isPaused }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(initState());
  const { drainActions, pushAction } = useInput();

  const [score, setScore] = useState(0);
  const [pearls, setPearls] = useState(0);
  const [activePowerup, setActivePowerup] = useState(null);
  const [powerupMs, setPowerupMs] = useState(0);
  const [hasShield, setHasShield] = useState(false);

  useEffect(() => {
    stateRef.current = initState();
    setScore(0); setPearls(0);
    setActivePowerup(null); setPowerupMs(0); setHasShield(false);
  }, []);

  const update = useCallback((dt, ts) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = stateRef.current;
    s.gameTime += dt;

    // ── 1. Input ──────────────────────────────
    const actions = drainActions();
    for (const act of actions) {
      if (act === 'PAUSE') { onPause(); return; }
      if (act === 'LEFT' && s.player.lane > 0) {
        s.player.lane--;
        s.player.targetX = LANE_CENTERS[s.player.lane];
        sfxSwitch();
      }
      if (act === 'RIGHT' && s.player.lane < 2) {
        s.player.lane++;
        s.player.targetX = LANE_CENTERS[s.player.lane];
        sfxSwitch();
      }
      if (act === 'DIVE') {
        s.player.diving = true;
        s.player.diveMs = DIVE_DURATION_MS;
        sfxDive();
      }
    }

    // ── 2. Power-Up Timer ─────────────────────
    const p = s.player;
    if (p.activePowerup) {
      p.powerupMs -= dt;
      if (p.powerupMs <= 0) { p.activePowerup = null; p.powerupMs = 0; }
    }

    // ── 3. Speed ──────────────────────────────
    s.baseSpeed = Math.min(s.baseSpeed + SPEED_ACCEL * dt, MAX_SPEED);
    const effectiveSpeed = p.activePowerup === 'speed'
      ? s.baseSpeed * SPEED_BOOST_MULTIPLIER
      : s.baseSpeed;

    s.trackOffset += effectiveSpeed;
    s.score += effectiveSpeed * 0.15;

    // ── 4. Player lateral slide ───────────────
    p.x += (p.targetX - p.x) * 0.25;

    if (p.diving) {
      p.diveMs -= dt;
      if (p.diveMs <= 0) p.diving = false;
    }

    p.wobblePhase += effectiveSpeed * 0.035;

    // ── 5. Shark Bruce ────────────────────────
    const sh = s.shark;
    sh.x += (p.x - sh.x) * 0.12;

    let targetSharkY = SHARK_FOLLOW_Y;
    if (p.activePowerup === 'giant') targetSharkY = SHARK_FOLLOW_Y + 50;
    else if (p.activePowerup === 'speed') targetSharkY = SHARK_FOLLOW_Y + 35;
    else if (p.stumbleTimer > 0) targetSharkY = SHARK_ATTACK_Y;
    sh.y += (targetSharkY - sh.y) * 0.08;

    if (p.stumbleTimer > 0) p.stumbleTimer -= dt;
    sh.jawPhase += 0.14;
    sh.tailPhase += 0.18;

    // ── 6. Spawn obstacles ────────────────────
    const obsInterval = Math.max(1300, OBSTACLE_SPAWN_INTERVAL - (s.baseSpeed - BASE_SPEED) * 120);
    if (ts - s.lastObstacleTick > obsInterval) {
      s.lastObstacleTick = ts;
      const lane = Math.floor(Math.random() * 3);
      s.obstacles.push(createObstacle(lane));
    }

    // Pearls
    if (ts - s.lastItemTick > ITEM_SPAWN_INTERVAL) {
      s.lastItemTick = ts;
      const safeLanes = [0, 1, 2].filter(lane =>
        !s.obstacles.some(obs => obs.lane === lane && obs.y < SAFE_SPAWN_GAP)
      );
      if (safeLanes.length > 0) {
        const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
        s.collectibles.push(createPearl(lane));
      }
    }

    // Power-ups
    if (ts - s.lastPowerupTick > 9500) {
      s.lastPowerupTick = ts;
      const safeLanes = [0, 1, 2].filter(lane =>
        !s.obstacles.some(obs => obs.lane === lane && obs.y < SAFE_SPAWN_GAP)
      );
      if (safeLanes.length > 0) {
        const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
        s.powerups.push(createPowerup(lane));
      }
    }

    // ── 7. Move entities down the screen ──────
    for (const item of s.collectibles) {
      item.y += effectiveSpeed;

      // Magnet during speed boost
      if (p.activePowerup === 'speed' && item.y > PLAYER_Y - 260 && item.y < PLAYER_Y + 120) {
        item.x += (p.x - item.x) * 0.24;
      }

      if (item.alive && Math.abs(item.x - p.x) < 50 && Math.abs(item.y - p.y) < 46) {
        item.alive = false;
        for (let i = 0; i < 9; i++) s.sparkles.push(createSparkle(item.x, item.y, '#bae6fd'));
        const pts = p.activePowerup === 'giant' ? PEARL_POINTS * 2 : PEARL_POINTS;
        s.score += pts;
        s.pearls += 1;
        sfxPearl();
      }
    }
    s.collectibles = s.collectibles.filter(c => c.alive && c.y < CANVAS_H + 40);

    // ── 8. Power-Up pickup ────────────────────
    for (const pw of s.powerups) {
      pw.y += effectiveSpeed;
      if (pw.alive && Math.abs(pw.x - p.x) < 54 && Math.abs(pw.y - p.y) < 50) {
        pw.alive = false;
        sfxPowerup();
        const col = pw.type === 'speed' ? '#facc15' : pw.type === 'giant' ? '#f97316' : '#38bdf8';
        for (let i = 0; i < 14; i++) s.sparkles.push(createSparkle(pw.x, pw.y, col));
        if (pw.type === 'shield') {
          p.hasShield = true;
        } else {
          p.activePowerup = pw.type;
          p.powerupMs = POWERUP_DURATION_MS;
        }
      }
    }
    s.powerups = s.powerups.filter(pw => pw.alive && pw.y < CANVAS_H + 40);

    // ── 9. Obstacle collision ─────────────────
    for (const obs of s.obstacles) {
      obs.y += effectiveSpeed;
      if (!obs.alive) continue;

      if (Math.abs(obs.x - p.x) < 44 && Math.abs(obs.y - p.y) < 40) {
        if (p.activePowerup === 'giant') {
          obs.alive = false;
          s.score += EAT_OBSTACLE_POINTS;
          sfxEatObstacle();
          for (let i = 0; i < 14; i++) s.sparkles.push(createSparkle(obs.x, obs.y, '#f59e0b'));
          continue;
        }
        if (obs.type === 'jellyfish' && p.diving) continue;
        if (p.hasShield) {
          p.hasShield = false;
          obs.alive = false;
          sfxShieldPop();
          p.stumbleTimer = 800;
          for (let i = 0; i < 14; i++) s.sparkles.push(createSparkle(p.x, p.y, '#38bdf8'));
          continue;
        }
        sh.y = p.y + 15;
        sfxGameOver();
        onGameOver(Math.floor(s.score), s.pearls);
        return;
      }
    }
    s.obstacles = s.obstacles.filter(o => o.y < CANVAS_H + 60);

    // ── 10. Bubbles ───────────────────────────
    const isIntense = p.activePowerup === 'speed';
    if (Math.random() < (isIntense ? 0.95 : 0.35)) {
      s.bubbles.push(createBubble(p.x, p.y, isIntense));
    }
    for (const b of s.bubbles) {
      b.x += b.vx;
      b.y += b.vy + effectiveSpeed * 0.4;
      b.life -= b.decay;
    }
    s.bubbles = s.bubbles.filter(b => b.life > 0);

    // ── 11. Sparkles ──────────────────────────
    for (const sp of s.sparkles) { sp.x += sp.vx; sp.y += sp.vy; sp.life -= sp.decay; }
    s.sparkles = s.sparkles.filter(sp => sp.life > 0);

    // ── 12. HUD sync ──────────────────────────
    if (Math.floor(s.score) % 4 === 0) {
      const rounded = Math.floor(s.score);
      setScore(rounded);
      setPearls(s.pearls);
      setActivePowerup(p.activePowerup);
      setPowerupMs(p.powerupMs);
      setHasShield(p.hasShield);
      onScoreUpdate?.(rounded, s.pearls);
    }

    // ── 13. Render ────────────────────────────
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    render3DEnvironment(ctx, s.trackOffset, effectiveSpeed, s.gameTime);
    s.collectibles.forEach(item => renderPearl(ctx, item, s.gameTime));
    s.powerups.forEach(pw => renderPowerup(ctx, pw, s.gameTime));
    renderBubbles(ctx, s.bubbles);

    if (p.diving) {
      renderPlayer(ctx, p, s.gameTime);
      s.obstacles.forEach(obs => renderObstacle(ctx, obs, s.gameTime));
    } else {
      s.obstacles.forEach(obs => renderObstacle(ctx, obs, s.gameTime));
      renderPlayer(ctx, p, s.gameTime);
    }

    renderChasingShark(ctx, sh, s.gameTime);
    renderSparkles(ctx, s.sparkles);
    renderDepthVignette(ctx, effectiveSpeed);
  }, [drainActions, onGameOver, onPause, onScoreUpdate]);

  useGameLoop(update, !isPaused);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
      <HUD
        score={score} pearls={pearls}
        onPause={onPause} isPaused={isPaused}
        activePowerup={activePowerup} powerupMs={powerupMs}
        hasShield={hasShield}
      />
      <Controls pushAction={pushAction} />
    </div>
  );
}
