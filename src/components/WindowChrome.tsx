import type { FC } from 'react';
import { RotateCcw, Bot, Users, Code, Maximize2, Minimize2, Minus, X, Dices, Sparkles } from 'lucide-react';
import { GameMode } from '../game/tictactoe_engine';

interface WindowChromeProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRestart: () => void;
  gameMode: GameMode;
  onToggleGameMode: () => void;
  onToggleBotDifficulty: () => void;
  onOpenCodeModal: () => void;
}

export const WindowChrome: FC<WindowChromeProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onRestart,
  gameMode,
  onToggleGameMode,
  onToggleBotDifficulty,
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
          title={gameMode !== 'pvp' ? 'Currently in 1-Player mode (vs Computer). Click to switch to 2 Players.' : 'Currently in 2-Player mode. Click to switch to 1 Player (vs Computer).'}
        >
          {gameMode !== 'pvp' ? (
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

        {/* Bot Style Toggle: Random (default) vs Smart */}
        {gameMode !== 'pvp' && (
          <button
            className="icon-btn"
            onClick={onToggleBotDifficulty}
            title={gameMode === 'ai-random' ? 'Current Bot: Random Shots (Default). Click to switch to Smart Bot.' : 'Current Bot: Smart Tactical. Click to switch to Random Bot.'}
            style={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
          >
            {gameMode === 'ai-random' ? (
              <>
                <Dices size={13} style={{ color: '#facc15' }} />
                <span>Bot: Random</span>
              </>
            ) : (
              <>
                <Sparkles size={13} style={{ color: '#c084fc' }} />
                <span>Bot: Smart</span>
              </>
            )}
          </button>
        )}

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
