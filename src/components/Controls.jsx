// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — On-Screen Mobile Controls
//  Touch / Pointer controls formatted for mobile.
//  Large touch targets, ripple glow, haptics.
// ─────────────────────────────────────────────

import { sfxClick } from '../game/audio.js';

export default function Controls({ pushAction }) {
  const handleAction = (action) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    sfxClick();
    pushAction(action);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* ◀ Left Lane Button */}
      <button
        style={leftRightBtnStyle}
        onPointerDown={handleAction('LEFT')}
        aria-label="Switch to Left Current"
      >
        <span style={iconStyle}>◀</span>
        <span style={subtextStyle}>LEFT</span>
      </button>

      {/* ▼ Dive / Duck Button */}
      <button
        style={diveBtnStyle}
        onPointerDown={handleAction('DIVE')}
        aria-label="Dive Down to Dodge"
      >
        <span style={{ fontSize: 24, transform: 'translateY(1px)' }}>▼</span>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', marginTop: 2 }}>
          DIVE
        </span>
      </button>

      {/* ▶ Right Lane Button */}
      <button
        style={leftRightBtnStyle}
        onPointerDown={handleAction('RIGHT')}
        aria-label="Switch to Right Current"
      >
        <span style={iconStyle}>▶</span>
        <span style={subtextStyle}>RIGHT</span>
      </button>
    </div>
  );
}

const leftRightBtnStyle = {
  pointerEvents: 'auto',
  width: 72,
  height: 72,
  borderRadius: '50%',
  border: '2px solid rgba(0, 245, 212, 0.45)',
  background: 'radial-gradient(circle at 30% 30%, rgba(13, 59, 94, 0.85), rgba(4, 13, 33, 0.95))',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(0, 245, 212, 0.2)',
  backdropFilter: 'blur(8px)',
  color: '#00f5d4',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  outline: 'none',
  transition: 'transform 0.08s ease, border-color 0.15s, box-shadow 0.15s',
};

const diveBtnStyle = {
  pointerEvents: 'auto',
  width: 82,
  height: 82,
  borderRadius: '50%',
  border: '2.5px solid #00f5d4',
  background: 'radial-gradient(circle at 30% 30%, rgba(0, 245, 212, 0.3), rgba(4, 13, 33, 0.95))',
  boxShadow: '0 0 20px rgba(0, 245, 212, 0.5), inset 0 0 15px rgba(0, 245, 212, 0.3)',
  backdropFilter: 'blur(8px)',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
  outline: 'none',
  transition: 'transform 0.08s ease, box-shadow 0.15s',
};

const iconStyle = {
  fontSize: 22,
  lineHeight: 1,
};

const subtextStyle = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.12em',
  marginTop: 3,
  opacity: 0.85,
};
