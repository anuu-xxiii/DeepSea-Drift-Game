// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — Touch, Swipe & Keyboard Input Handler
//  Down Arrow / Swipe Down / Dive Button triggers DIVE
// ─────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';

export function useInput() {
  const queue = useRef([]);
  const touchStartRef = useRef(null);

  const pushAction = useCallback((act) => {
    queue.current.push(act);
  }, []);

  const drainActions = useCallback(() => {
    const list = queue.current.slice();
    queue.current = [];
    return list;
  }, []);

  useEffect(() => {
    // ── Keyboard Controls ───────────────────
    const onKeyDown = (e) => {
      if (e.repeat) return;
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          e.preventDefault();
          queue.current.push('LEFT');
          break;
        case 'ArrowRight':
        case 'KeyD':
          e.preventDefault();
          queue.current.push('RIGHT');
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 'Space':
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          queue.current.push('DIVE');
          break;
        case 'KeyP':
        case 'Escape':
          e.preventDefault();
          queue.current.push('PAUSE');
          break;
        default:
          break;
      }
    };

    // ── Touch & Swipe Controls (Mobile) ─────
    const onTouchStart = (e) => {
      if (!e.touches[0]) return;
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: Date.now(),
      };
    };

    const onTouchEnd = (e) => {
      if (!touchStartRef.current || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      const dt = Date.now() - touchStartRef.current.t;
      touchStartRef.current = null;

      if (dt > 700) return; // Too slow

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < 15 && absY < 15) {
        // Quick tap anywhere -> Dive!
        queue.current.push('DIVE');
        return;
      }

      if (absX > absY && absX > 20) {
        // Horizontal Swipe
        queue.current.push(dx < 0 ? 'LEFT' : 'RIGHT');
      } else if (absY > absX && absY > 20) {
        // Vertical Swipe (Up or Down) -> Dive!
        queue.current.push('DIVE');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return { drainActions, pushAction };
}
