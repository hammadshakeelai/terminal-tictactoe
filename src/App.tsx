import { useState, useRef, useEffect } from 'react';
import { WindowChrome } from './components/WindowChrome';
import { Terminal } from './components/Terminal';
import { StatusBar } from './components/StatusBar';
import { MobileKeyBar } from './components/MobileKeyBar';
import { CodeModal } from './components/CodeModal';
import { GameState, createInitialState } from './game/tictactoe_engine';
import { playEnterSound } from './lib/sound';
import './styles/terminal.css';

export function App() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState('ai'));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [theme, setTheme] = useState<'powershell' | 'matrix' | 'retro'>('powershell');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [terminalKey, setTerminalKey] = useState(0);

  const onSelectCellRef = useRef<((cell: number) => void) | null>(null);

  // Sync theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Restart Handler: completely resets board and restarts game session
  const handleRestart = () => {
    if (soundEnabled) playEnterSound();
    setGameState(prev => createInitialState(prev.mode));
    setTerminalKey(k => k + 1);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(f => !f);
  };

  const handleToggleGameMode = () => {
    const nextMode = gameState.mode === 'pvp' ? 'ai' : 'pvp';
    setGameState(createInitialState(nextMode));
    setTerminalKey(k => k + 1);
  };

  const handleCycleTheme = () => {
    const themes: Array<'powershell' | 'matrix' | 'retro'> = ['powershell', 'matrix', 'retro'];
    const currentIdx = themes.indexOf(theme);
    const next = themes[(currentIdx + 1) % themes.length];
    setTheme(next);
  };

  return (
    <div className="desktop-wrapper">
      <div className={`terminal-window ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Title bar with tabs, restart button, and window buttons */}
        <WindowChrome
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onRestart={handleRestart}
          gameMode={gameState.mode}
          onToggleGameMode={handleToggleGameMode}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
        />

        {/* Main Terminal Screen Area */}
        <Terminal
          key={terminalKey}
          gameState={gameState}
          setGameState={setGameState}
          soundEnabled={soundEnabled}
          onRestart={handleRestart}
          onSelectCellRef={onSelectCellRef}
        />

        {/* Quick Touch / Numeric Keypad */}
        <MobileKeyBar
          onSelectCell={(num) => onSelectCellRef.current?.(num)}
          onRestart={handleRestart}
          board={gameState.board}
          pickedCells={gameState.pickedCells}
          disabled={gameState.isGameOver}
        />

        {/* Status Bar */}
        <StatusBar
          gameState={gameState}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          crtEnabled={crtEnabled}
          onToggleCrt={() => setCrtEnabled(c => !c)}
          theme={theme}
          onCycleTheme={handleCycleTheme}
        />

        {/* CRT Scanlines Overlay */}
        {crtEnabled && <div className="crt-overlay" />}
      </div>

      {/* Code Viewer Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}

export default App;
