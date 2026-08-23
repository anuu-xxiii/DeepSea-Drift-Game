// ─────────────────────────────────────────────
//  DEEP-SEA DRIFT — App.jsx (Mobile App Container)
// ─────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameCanvas from './components/GameCanvas.jsx';
import PauseScreen from './components/PauseScreen.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';

export default function App() {
  // Screen state machine: 'start' | 'playing' | 'paused' | 'gameover'
  const [screen, setScreen] = useState('start');
  const [gameKey, setGameKey] = useState(0);

  const [liveScore, setLiveScore] = useState(0);
  const [livePearls, setLivePearls] = useState(0);
  const finalStats = useRef({ score: 0, pearls: 0 });

  const handleStart = useCallback(() => {
    setScreen('playing');
  }, []);

  const handlePause = useCallback(() => {
    setScreen((prev) => (prev === 'paused' ? 'playing' : 'paused'));
  }, []);

  const handleResume = useCallback(() => {
    setScreen('playing');
  }, []);

  const handleScoreUpdate = useCallback((score, pearls) => {
    setLiveScore(score);
    setLivePearls(pearls);
  }, []);

  const handleGameOver = useCallback((score, pearls) => {
    finalStats.current = { score, pearls };
    setScreen('gameover');
  }, []);

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setLiveScore(0);
    setLivePearls(0);
    setScreen('playing');
  }, []);

  const handleMenu = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen('start');
  }, []);

  return (
    <div className="mobile-app-shell">
      {/* Mobile Device Frame Container */}
      <div className="mobile-device-container">
        {/* ── Start Screen ── */}
        {screen === 'start' && <StartScreen onStart={handleStart} />}

        {/* ── Active Game Loop (Playing OR Paused) ── */}
        {(screen === 'playing' || screen === 'paused') && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <GameCanvas
              key={gameKey}
              onGameOver={handleGameOver}
              onPause={handlePause}
              onScoreUpdate={handleScoreUpdate}
              isPaused={screen === 'paused'}
            />

            {screen === 'paused' && (
              <PauseScreen
                score={liveScore}
                pearls={livePearls}
                onResume={handleResume}
                onQuit={handleMenu}
              />
            )}
          </div>
        )}

        {/* ── Game Over Screen ── */}
        {screen === 'gameover' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <GameCanvas
              key={gameKey + '_frozen'}
              onGameOver={() => {}}
              onPause={() => {}}
              onScoreUpdate={() => {}}
              isPaused={true}
            />
            <GameOverScreen
              score={finalStats.current.score}
              pearls={finalStats.current.pearls}
              onRestart={handleRestart}
              onMenu={handleMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}
