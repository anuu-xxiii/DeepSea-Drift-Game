// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — 3D Start Screen (with Power-Ups Info)
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import { CANVAS_W, CANVAS_H, LANE_CENTERS, PLAYER_Y, SHARK_FOLLOW_Y } from '../game/constants.js';
import { sfxClick, toggleMute, getMuteState } from '../game/audio.js';
import { render3DEnvironment, renderChasingShark, renderPlayer } from '../game/renderer.js';
import { createPlayer, createShark } from '../game/entities.js';

export default function StartScreen({ onStart }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);
  const [muted, setMuted] = useState(getMuteState());

  const handleStartGame = (e) => {
    e.preventDefault();
    sfxClick();
    onStart();
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    const state = toggleMute();
    setMuted(state);
    if (!state) sfxClick();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let lastT = null;

    const demoPlayer = createPlayer();
    const demoShark = createShark();
    let trackOffset = 0;

    const render = (t) => {
      if (!lastT) lastT = t;
      const dt = t - lastT;
      lastT = t;
      timeRef.current += dt;
      const time = timeRef.current;

      trackOffset += 3.5;
      demoPlayer.x = LANE_CENTERS[1] + Math.sin(time * 0.0018) * 80;
      demoPlayer.y = PLAYER_Y;
      demoShark.x = demoPlayer.x * 0.9;
      demoShark.y = SHARK_FOLLOW_Y;
      demoShark.jawPhase += 0.1;
      demoShark.tailPhase += 0.15;
      demoPlayer.wobblePhase += 0.12;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      render3DEnvironment(ctx, trackOffset, 3.5, time);
      renderPlayer(ctx, demoPlayer, time);
      renderChasingShark(ctx, demoShark, time);

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const bestScore = localStorage.getItem('dsd_best') || '0';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 16px',
        boxSizing: 'border-box',
        touchAction: 'manipulation',
      }}
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* Top Bar with Audio Control */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.2em',
            color: '#00f5d4',
            fontWeight: 800,
            textTransform: 'uppercase',
            background: 'rgba(3, 12, 30, 0.85)',
            padding: '6px 14px',
            borderRadius: 20,
            border: '1.5px solid rgba(0,245,212,0.35)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          ∿ 3D OCEAN RUNNER ∿
        </div>

        <button
          onClick={handleMuteToggle}
          style={{
            background: 'rgba(3, 12, 30, 0.85)',
            border: '1.5px solid rgba(0, 245, 212, 0.4)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 15,
            outline: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Middle: Title & Story */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        <div style={{ fontSize: 42, marginBottom: -6, filter: 'drop-shadow(0 0 16px #00f5d4)' }}>
          🐟
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(36px, 8.5vw, 46px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            lineHeight: 1,
            textShadow: '0 0 25px rgba(0,245,212,0.6)',
          }}
        >
          DEEP-SEA
        </h1>
        <h1
          style={{
            margin: '2px 0 0 0',
            fontSize: 'clamp(36px, 8.5vw, 46px)',
            fontWeight: 900,
            color: '#00f5d4',
            letterSpacing: '0.08em',
            lineHeight: 1,
            textShadow: '0 0 35px rgba(0,245,212,0.9)',
          }}
        >
          DRIFT 3D
        </h1>

        <p
          style={{
            marginTop: 8,
            fontSize: 12,
            color: '#bae6fd',
            lineHeight: 1.4,
            maxWidth: 290,
          }}
        >
          Glide the currents & outswim Bruce the Shark! 🦈
        </p>

        {/* Power-Ups Guide Card */}
        <div
          style={{
            marginTop: 12,
            padding: '10px 16px',
            background: 'rgba(3, 12, 30, 0.88)',
            border: '1.5px solid rgba(0, 245, 212, 0.3)',
            borderRadius: 16,
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            width: '100%',
            maxWidth: 300,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontSize: 10, color: '#00f5d4', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ✦ SPECIAL POWER-UPS ✦
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bae6fd' }}>
            <span>⚡ <strong>Speed Boost</strong> (Magnet)</span>
            <span>🐡 <strong>Titan</strong> (Eats Eels!)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: 11, color: '#bae6fd' }}>
            <span>🛡️ <strong>Shield Armor</strong> (Absorbs Hits)</span>
          </div>
        </div>

        {/* Controls Quick Card */}
        <div
          style={{
            marginTop: 8,
            padding: '8px 14px',
            background: 'rgba(3, 12, 30, 0.75)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            borderRadius: 12,
            fontSize: 11,
            color: '#bae6fd',
            display: 'flex',
            gap: 16,
          }}
        >
          <span><strong>◀ ▶</strong> Switch Lanes</span>
          <span><strong>▼ DIVE / ↓</strong> Under Jellyfish</span>
        </div>
      </div>

      {/* Bottom: Play Button & High Score */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 4,
        }}
      >
        <button
          onClick={handleStartGame}
          style={{
            width: '100%',
            maxWidth: 320,
            padding: '16px 24px',
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#030c1e',
            background: 'linear-gradient(135deg, #00f5d4 0%, #06b6d4 100%)',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            boxShadow: '0 0 26px rgba(0, 245, 212, 0.6), 0 6px 20px rgba(0,0,0,0.5)',
            outline: 'none',
            touchAction: 'manipulation',
          }}
        >
          ▶ &nbsp; DIVE IN NOW
        </button>

        <div style={{ fontSize: 11, color: '#0891b2', fontWeight: 800, letterSpacing: '0.08em' }}>
          BEST DEPTH: <span style={{ color: '#00f5d4' }}>{parseInt(bestScore, 10).toLocaleString()}m</span>
        </div>
      </div>
    </div>
  );
}
