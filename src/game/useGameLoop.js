// ─────────────────────────────────────────────
//  useGameLoop — requestAnimationFrame hook
// ─────────────────────────────────────────────

import { useEffect, useRef } from 'react';

/**
 * Calls update(dt, ts) every animation frame when running=true.
 * dt is capped at 50ms so physics don't explode after tab switches.
 * Uses a ref for the update function so it's always current without
 * restarting the RAF loop on every re-render.
 */
export function useGameLoop(update, running) {
  const rafRef    = useRef(null);
  const prevTsRef = useRef(null);
  const updateRef = useRef(update);

  // Keep updateRef always pointing to latest update
  updateRef.current = update;

  useEffect(() => {
    if (!running) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      prevTsRef.current = null;
      return;
    }

    let cancelled = false;

    const loop = (ts) => {
      if (cancelled) return;
      if (prevTsRef.current === null) prevTsRef.current = ts;
      const dt = Math.min(ts - prevTsRef.current, 50);
      prevTsRef.current = ts;
      try {
        updateRef.current(dt, ts);
      } catch (err) {
        console.error('[GameLoop] Error in update:', err);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      prevTsRef.current = null;
    };
  }, [running]);
}
