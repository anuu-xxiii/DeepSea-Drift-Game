// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — HUD with Active Power-Up Badges
// ─────────────────────────────────────────────

import { useState } from 'react';
import { toggleMute, getMuteState, sfxClick } from '../game/audio.js';

export default function HUD({ score, pearls, onPause, isPaused, activePowerup, powerupMs, hasShield }) {
  const [muted, setMuted] = useState(getMuteState());

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    const newState = toggleMute();
    setMuted(newState);
    if (!newState) sfxClick();
  };

  const handlePauseClick = (e) => {
    e.stopPropagation();
    sfxClick();
    onPause();
  };

  const secondsLeft = (powerupMs / 1000).toFixed(1);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 16px',
        pointerEvents: 'none',
        zIndex: 30,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Main Top Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Depth Score */}
        <div style={hudPill}>
          <span style={labelStyle}>DEPTH</span>
          <span style={valueStyle}>{score.toLocaleString()}m</span>
        </div>

        {/* Action Buttons (Mute + Pause) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
          <button
            onClick={handleMuteToggle}
            style={iconBtnStyle}
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          <button
            onClick={handlePauseClick}
            style={{ ...iconBtnStyle, borderColor: '#00f5d4', color: '#00f5d4' }}
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>

        {/* Pearls Count */}
        <div style={hudPill}>
          <span style={labelStyle}>PEARLS</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 15, filter: 'drop-shadow(0 0 4px #bae6fd)' }}>🔮</span>
            <span style={{ ...valueStyle, color: '#bae6fd' }}>{pearls}</span>
          </div>
        </div>
      </div>

      {/* ── Active Power-Up Status Banners ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* ⚡ Speed-Up Banner */}
        {activePowerup === 'speed' && (
          <div style={speedPillStyle}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>SPEED BOOST: {secondsLeft}s</span>
          </div>
        )}

        {/* 🐡 Giant Double-Up Banner */}
        {activePowerup === 'giant' && (
          <div style={giantPillStyle}>
            <span style={{ fontSize: 14 }}>🐡</span>
            <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>TITAN 2X (CHOMP EELS!): {secondsLeft}s</span>
          </div>
        )}

        {/* 🛡️ Active Shield Banner */}
        {hasShield && (
          <div style={shieldPillStyle}>
            <span style={{ fontSize: 14 }}>🛡️</span>
            <span style={{ fontWeight: 800, letterSpacing: '0.08em' }}>SHIELD ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}

const hudPill = {
  background: 'rgba(3, 12, 30, 0.85)',
  border: '1.5px solid rgba(0, 245, 212, 0.35)',
  borderRadius: 14,
  padding: '6px 14px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 80,
};

const labelStyle = {
  fontSize: 9,
  letterSpacing: '0.14em',
  color: '#0891b2',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const valueStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: '#00f5d4',
  lineHeight: 1.1,
  fontVariantNumeric: 'tabular-nums',
};

const iconBtnStyle = {
  background: 'rgba(3, 12, 30, 0.85)',
  border: '1.5px solid rgba(0, 245, 212, 0.35)',
  borderRadius: '50%',
  width: 38,
  height: 38,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(8px)',
  fontSize: 15,
  outline: 'none',
  touchAction: 'manipulation',
  transition: 'transform 0.1s ease, border-color 0.15s ease',
};

const speedPillStyle = {
  background: 'rgba(250, 204, 21, 0.22)',
  border: '1.5px solid #facc15',
  boxShadow: '0 0 14px rgba(250, 204, 21, 0.5)',
  color: '#fef08a',
  borderRadius: 20,
  padding: '4px 12px',
  fontSize: 11,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  backdropFilter: 'blur(6px)',
  animation: 'pulse 1s infinite alternate',
};

const giantPillStyle = {
  background: 'rgba(249, 115, 22, 0.25)',
  border: '1.5px solid #f97316',
  boxShadow: '0 0 14px rgba(249, 115, 22, 0.6)',
  color: '#fed7aa',
  borderRadius: 20,
  padding: '4px 12px',
  fontSize: 11,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  backdropFilter: 'blur(6px)',
};

const shieldPillStyle = {
  background: 'rgba(56, 189, 248, 0.22)',
  border: '1.5px solid #38bdf8',
  boxShadow: '0 0 14px rgba(56, 189, 248, 0.5)',
  color: '#e0f2fe',
  borderRadius: 20,
  padding: '4px 12px',
  fontSize: 11,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  backdropFilter: 'blur(6px)',
};
