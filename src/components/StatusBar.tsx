import type { FC } from 'react';
import { Volume2, VolumeX, Monitor, Palette } from 'lucide-react';
import { GameState } from '../game/tictactoe_engine';

interface StatusBarProps {
  gameState: GameState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  theme: string;
  onCycleTheme: () => void;
}

export const StatusBar: FC<StatusBarProps> = ({
  gameState,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  theme,
  onCycleTheme
}) => {
  const currentTurnSymbol = gameState.currentTurn % 2 === 0 ? 'X (user1)' : 'O (user2)';

  return (
    <div className="statusbar">
      {/* ── Left status indicators ── */}
      <div className="status-left">
        <div className="status-item">
          <span className={`status-dot ${gameState.isGameOver ? '' : 'busy'}`} />
          <span>&gt;_ PowerShell · Active</span>
        </div>

        <div className="status-item">
          <span>Status:</span>
          {gameState.isGameOver ? (
            <span style={{ color: gameState.winner === 'draw' ? '#fb923c' : '#4ade80', fontWeight: 600 }}>
              {gameState.winner === 'draw' 
                ? 'Draw' 
                : `${gameState.winner} won!`}
            </span>
          ) : (
            <span style={{ color: '#facc15' }}>
              Turn {gameState.currentTurn + 1}/9: {currentTurnSymbol}
            </span>
          )}
        </div>

        <div className="status-item">
          <span>Mode:</span>
          <span style={{ 
            color: gameState.mode === 'pvp' ? '#4ade80' : gameState.mode === 'ai-smart' ? '#c084fc' : '#38bdf8', 
            fontWeight: 500 
          }}>
            {gameState.mode === 'pvp' ? '2 Players' : gameState.mode === 'ai-smart' ? '1P (Smart Bot)' : '1P (Random Bot)'}
          </span>
        </div>
      </div>

      {/* ── Right toggles & info ── */}
      <div className="status-right">
        {/* Sound toggle */}
        <div 
          className="status-item status-clickable"
          onClick={onToggleSound}
          title={`Sound Effects: ${soundEnabled ? 'Enabled' : 'Muted'}`}
        >
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
        </div>

        {/* CRT Scanlines toggle */}
        <div 
          className="status-item status-clickable"
          onClick={onToggleCrt}
          title={`CRT Monitor Effect: ${crtEnabled ? 'Enabled' : 'Disabled'}`}
        >
          <Monitor size={12} />
          <span>CRT {crtEnabled ? 'ON' : 'OFF'}</span>
        </div>

        {/* Theme switcher */}
        <div 
          className="status-item status-clickable"
          onClick={onCycleTheme}
          title="Click to cycle theme (PowerShell / Matrix / Retro)"
        >
          <Palette size={12} />
          <span style={{ textTransform: 'capitalize' }}>{theme}</span>
        </div>

        <div className="status-item">
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
