import type { FC } from 'react';
import { RotateCcw, Bot, Users, Code, Maximize2, Minimize2, Minus, X } from 'lucide-react';

interface WindowChromeProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRestart: () => void;
  gameMode: 'pvp' | 'ai';
  onToggleGameMode: () => void;
  onOpenCodeModal: () => void;
}

export const WindowChrome: FC<WindowChromeProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onRestart,
  gameMode,
  onToggleGameMode,
  onOpenCodeModal,
}) => {
  return (
    <div className="titlebar">
      {/* ── Tabs strip ── */}
      <div className="tab-strip">
        <div className="tab active" title="Windows PowerShell - python tictactoe_game.py">
          <span className="tab-icon">&gt;_</span>
          <span>Windows PowerShell</span>
          <button 
            className="tab-close" 
            onClick={(e) => { e.stopPropagation(); onRestart(); }} 
            title="Reset Terminal session"
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Action Toolbar Buttons ── */}
      <div className="titlebar-actions">
        {/* Prominent Restart Button */}
        <button
          className="icon-btn primary"
          onClick={onRestart}
          title="Restart Tic-Tac-Toe Game (Ctrl+R)"
          aria-label="Restart Game"
        >
          <RotateCcw size={13} />
          <span>Restart</span>
        </button>

        {/* Mode Toggle Button: 1 Player default, button to change to 2 Players */}
        <button
          className="icon-btn"
          onClick={onToggleGameMode}
          title={gameMode === 'ai' ? 'Currently in 1-Player mode (You vs Computer). Click to switch to 2-Player mode.' : 'Currently in 2-Player mode. Click to switch to 1-Player mode (vs Computer).'}
        >
          {gameMode === 'ai' ? (
            <>
              <Users size={13} style={{ color: '#4ade80' }} />
              <span>Change to 2 Players</span>
            </>
          ) : (
            <>
              <Bot size={13} style={{ color: '#38bdf8' }} />
              <span>Change to 1 Player</span>
            </>
          )}
        </button>

        {/* View Code Button */}
        <button
          className="icon-btn"
          onClick={onOpenCodeModal}
          title="View Python Source Code (safetynet2)"
        >
          <Code size={13} />
          <span>Python Code</span>
        </button>
      </div>

      {/* Drag region */}
      <div className="window-drag" onDoubleClick={onToggleFullscreen} />

      {/* Window Controls */}
      <div className="window-controls">
        <button 
          className="win-btn" 
          title="Minimize" 
          onClick={() => alert("Mirage Terminal is locked in place!")}
        >
          <Minus size={13} />
        </button>
        <button 
          className="win-btn" 
          title={isFullscreen ? "Restore" : "Maximize"} 
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
        <button 
          className="win-btn close" 
          title="Close" 
          onClick={onRestart}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
