// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Game Over Screen with Funny Safe Shark
// ─────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { sfxClick } from '../game/audio.js';

export default function GameOverScreen({ score, pearls, onRestart, onMenu }) {
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    const prevBest = parseInt(localStorage.getItem('dsd_best') || '0', 10);
    if (score > prevBest) {
      localStorage.setItem('dsd_best', String(score));
      setBestScore(score);
      setIsNewRecord(true);
    } else {
      setBestScore(prevBest);
      setIsNewRecord(false);
    }
  }, [score]);

  const handleRestart = () => {
    sfxClick();
    onRestart();
  };

  const handleMenu = () => {
    sfxClick();
    onMenu();
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
        gap: 14,
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.92) 0%, rgba(2, 6, 23, 0.98) 80%)',
        backdropFilter: 'blur(16px)',
        zIndex: 60,
        padding: '20px',
        boxSizing: 'border-box',
        touchAction: 'manipulation',
      }}
    >
      {/* Funny Safe Shark Art (Bruce with fish bowl) */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 64, filter: 'drop-shadow(0 0 20px #38bdf8)' }}>
          🦈
        </div>
        <div
          style={{
            marginTop: -16,
            fontSize: 28,
            background: 'rgba(56, 189, 248, 0.25)',
            borderRadius: '50%',
            padding: '2px 8px',
            border: '1.5px solid #38bdf8',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
          }}
        >
          🫧🐟
        </div>
      </div>

      {/* Funny Safe Headline */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(24px, 6vw, 30px)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            textShadow: '0 0 20px rgba(56, 189, 248, 0.8)',
          }}
        >
          CAUGHT BY BRUCE!
        </h2>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: '#38bdf8',
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
        >
          "Fish are friends! Back to swimming school for you! 🎓"
        </p>
      </div>

      {/* Score Summary Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 290,
          padding: '16px 20px',
          background: 'rgba(3, 12, 30, 0.85)',
          border: '1.5px solid rgba(0, 245, 212, 0.35)',
          borderRadius: 18,
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#0891b2', letterSpacing: '0.14em', fontWeight: 800 }}>
            DEPTH REACHED
          </span>
          <span style={{ fontSize: 32, color: '#00f5d4', fontWeight: 900, marginTop: 2 }}>
            {score.toLocaleString()}m
          </span>
        </div>

        <div style={{ height: 1, width: '100%', background: 'rgba(0, 245, 212, 0.15)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#0891b2', letterSpacing: '0.12em', fontWeight: 700 }}>
              PEARLS
            </span>
            <span style={{ fontSize: 20, color: '#bae6fd', fontWeight: 800, marginTop: 2 }}>
              🔮 {pearls}
            </span>
          </div>

          <div style={{ width: 1, background: 'rgba(0, 245, 212, 0.15)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 9, color: '#0891b2', letterSpacing: '0.12em', fontWeight: 700 }}>
              BEST DEPTH
            </span>
            <span
              style={{
                fontSize: 20,
                color: isNewRecord ? '#fbbf24' : '#94a3b8',
                fontWeight: 800,
                marginTop: 2,
              }}
            >
              {bestScore.toLocaleString()}m
            </span>
          </div>
        </div>

        {isNewRecord && (
          <div
            style={{
              fontSize: 11,
              color: '#fbbf24',
              fontWeight: 800,
              letterSpacing: '0.14em',
              background: 'rgba(251, 191, 36, 0.15)',
              padding: '4px 12px',
              borderRadius: 20,
              border: '1px solid rgba(251, 191, 36, 0.4)',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
            }}
          >
            ✦ NEW PERSONAL RECORD ✦
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 290, marginTop: 6 }}>
        <button onClick={handleRestart} style={primaryBtn}>
          ↺ &nbsp; DIVE AGAIN
        </button>

        <button onClick={handleMenu} style={secondaryBtn}>
          ⌂ &nbsp; MAIN MENU
        </button>
      </div>
    </div>
  );
}

const primaryBtn = {
  width: '100%',
  padding: '15px',
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: '0.08em',
  color: '#030c1e',
  background: 'linear-gradient(135deg, #00f5d4 0%, #06b6d4 100%)',
  border: 'none',
  borderRadius: 50,
  cursor: 'pointer',
  boxShadow: '0 0 26px rgba(0, 245, 212, 0.55)',
  outline: 'none',
  touchAction: 'manipulation',
};

const secondaryBtn = {
  width: '100%',
  padding: '13px',
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
