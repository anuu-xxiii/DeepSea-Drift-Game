// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Pause Screen (Mobile-First)
// ─────────────────────────────────────────────

import { sfxClick } from '../game/audio.js';

export default function PauseScreen({ score, pearls, onResume, onQuit }) {
  const handleResume = () => {
    sfxClick();
    onResume();
  };

  const handleQuit = () => {
    sfxClick();
    onQuit();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: 'rgba(3, 12, 30, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 50,
        padding: '24px',
        boxSizing: 'border-box',
        touchAction: 'manipulation',
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: 44, filter: 'drop-shadow(0 0 12px #00f5d4)' }}>⏸</div>

      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.08em',
          textShadow: '0 0 20px rgba(0, 245, 212, 0.6)',
        }}
      >
        GAME PAUSED
      </h2>

      {/* Current Stats */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '16px 28px',
          background: 'rgba(0, 245, 212, 0.08)',
          borderRadius: 16,
          border: '1.5px solid rgba(0, 245, 212, 0.25)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', color: '#0891b2', fontWeight: 800 }}>
            CURRENT DEPTH
          </span>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#00f5d4', marginTop: 2 }}>
            {score.toLocaleString()}m
          </span>
        </div>

        <div style={{ width: 1, background: 'rgba(0, 245, 212, 0.2)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', color: '#0891b2', fontWeight: 800 }}>
            PEARLS
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 18 }}>🔮</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#bae6fd' }}>{pearls}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, marginTop: 10 }}>
        <button onClick={handleResume} style={primaryBtn}>
          ▶ &nbsp; RESUME EXPEDITION
        </button>

        <button onClick={handleQuit} style={secondaryBtn}>
          ↩ &nbsp; RETURN TO MENU
        </button>
      </div>
    </div>
  );
}

const primaryBtn = {
  width: '100%',
  padding: '16px',
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#030c1e',
  background: 'linear-gradient(135deg, #00f5d4 0%, #06b6d4 100%)',
  border: 'none',
  borderRadius: 50,
  cursor: 'pointer',
  boxShadow: '0 0 24px rgba(0, 245, 212, 0.5)',
  outline: 'none',
  touchAction: 'manipulation',
};

const secondaryBtn = {
  width: '100%',
  padding: '14px',
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#00f5d4',
  background: 'rgba(3, 12, 30, 0.6)',
  border: '1.5px solid rgba(0, 245, 212, 0.35)',
  borderRadius: 50,
  cursor: 'pointer',
  outline: 'none',
  touchAction: 'manipulation',
};
