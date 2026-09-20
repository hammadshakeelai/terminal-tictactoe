import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
  type FormEvent,
  type KeyboardEvent
} from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  CellValue,
  createInitialState,
  formatOctothrope,
  INITIAL_GUIDE,
  checkWinner,
  getBestAIMove
} from '../game/tictactoe_engine';
import { PYTHON_TICTACTOE_CODE } from '../game/tictactoe_code';
import { playKeyClick, playEnterSound, playWinSound, playErrorSound } from '../lib/sound';

interface TerminalProps {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  soundEnabled: boolean;
  onRestart: () => void;
  onSelectCellRef: MutableRefObject<((cell: number) => void) | null>;
}

interface TerminalLine {
  id: string;
  type: 'banner' | 'prompt' | 'system' | 'guide' | 'board' | 'win' | 'draw' | 'error' | 'code';
  content: string | string[];
}

export const Terminal: FC<TerminalProps> = ({
  gameState,
  setGameState,
  soundEnabled,
  onRestart,
  onSelectCellRef
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputPrompt, setInputPrompt] = useState('user1: enter which cell do you want to mark ; ');
  const [isTypingInit, setIsTypingInit] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, inputValue, inputPrompt, scrollToBottom]);

  // Focus terminal input on click
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Boot sequence: Display PowerShell welcome banner and auto-type "python tictactoe_game.py init"
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const bannerLines: TerminalLine[] = [
        {
          id: 'b1',
          type: 'banner',
          content: 'Windows PowerShell'
        },
        {
          id: 'b2',
          type: 'banner',
          content: 'Copyright (C) Microsoft Corporation. All rights reserved.\n'
        },
        {
          id: 'b3',
          type: 'banner',
          content: 'Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows\n'
        },
        {
          id: 'b4',
          type: 'system',
          content: "Mirage Terminal: type 'help' for commands · 'python tictactoe_game.py' to run.\n"
        }
      ];

      setLines(bannerLines);

      // Simulated auto-type of "python tictactoe_game.py init"
      const commandToType = 'python tictactoe_game.py init';
      await new Promise(r => setTimeout(r, 450));
      if (cancelled) return;

      for (let i = 1; i <= commandToType.length; i++) {
        if (cancelled) return;
        setInputValue(commandToType.slice(0, i));
        if (soundEnabled && i % 2 === 0) playKeyClick(0.12);
        await new Promise(r => setTimeout(r, 22 + Math.random() * 20));
      }

      await new Promise(r => setTimeout(r, 200));
      if (cancelled) return;

      if (soundEnabled) playEnterSound();

      // Commit the command to lines
      setLines(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          type: 'prompt',
          content: `PS C:\\Users\\user> ${commandToType}`
        },
        {
          id: `guide-${Date.now()}`,
          type: 'guide',
          content: INITIAL_GUIDE
        }
      ]);

      setInputValue('');
      setIsTypingInit(false);
      setInputPrompt('user1: enter which cell do you want to mark ; ');
      inputRef.current?.focus();
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  // Process a cell move
  const processMove = useCallback((cell: number) => {
    if (gameState.isGameOver) {
      // Game already finished, inform user
      setLines(prev => [
        ...prev,
        {
          id: `info-${Date.now()}`,
          type: 'system',
          content: "Game finished! Click 'Restart' button or type 'restart' to play again."
        }
      ]);
      return;
    }

    const { board, pickedCells, currentTurn, mode } = gameState;
    const isUser1 = currentTurn % 2 === 0;
    const symbol: CellValue = isUser1 ? 'x' : 'o';

    // Check validity
    if (cell < 1 || cell > 9 || pickedCells.includes(cell)) {
      if (soundEnabled) playErrorSound();
      setLines(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'error',
          content: `Invalid cell ${cell} or already occupied. Please pick an open cell between 1 and 9.`
        }
      ]);
      return;
    }

    if (soundEnabled) playEnterSound();

    // Valid move
    const newBoard = [...board];
    newBoard[cell] = symbol;
    const newPicked = [...pickedCells, cell];
    const octothropeLines = formatOctothrope(newBoard);

    // Check win condition
    const winner = checkWinner(newBoard);
    const isDraw = !winner && newPicked.length === 9;

    const updatedLines: TerminalLine[] = [
      {
        id: `board-${Date.now()}`,
        type: 'board',
        content: octothropeLines
      }
    ];

    if (winner) {
      if (soundEnabled) playWinSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      updatedLines.push({
        id: `win-${Date.now()}`,
        type: 'win',
        content: `${winner} won`
      });
      updatedLines.push({
        id: `list-${Date.now()}`,
        type: 'system',
        content: `[${newPicked.join(', ')}]\nGame Over! Click 'Restart' or type 'restart' to play again.`
      });

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        pickedCells: newPicked,
        isGameOver: true,
        winner,
        waitingForInput: false
      }));

      setLines(prev => [...prev, ...updatedLines]);
      setInputPrompt("PS C:\\Users\\user> ");
      return;
    }

    if (isDraw) {
      if (soundEnabled) playErrorSound();
      updatedLines.push({
        id: `draw-${Date.now()}`,
        type: 'draw',
        content: 'DRAW'
      });
      updatedLines.push({
        id: `list-${Date.now()}`,
        type: 'system',
        content: `[${newPicked.join(', ')}]\nGame Over! Click 'Restart' or type 'restart' to play again.`
      });

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        pickedCells: newPicked,
        isGameOver: true,
        winner: 'draw',
        waitingForInput: false
      }));

      setLines(prev => [...prev, ...updatedLines]);
      setInputPrompt("PS C:\\Users\\user> ");
      return;
    }

    // Advance turn
    const nextTurn = currentTurn + 1;
    const nextPlayerNum = nextTurn % 2 === 0 ? 1 : 2;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      pickedCells: newPicked,
      currentTurn: nextTurn
    }));

    setLines(prev => [...prev, ...updatedLines]);
    setInputPrompt(`user${nextPlayerNum}: enter which cell do you want to mark ; `);

    // If vs AI and it's AI's turn (user2, 'o')
    if (mode === 'ai' && nextPlayerNum === 2) {
      setTimeout(() => {
        const aiCell = getBestAIMove(newBoard, newPicked);
        if (aiCell > 0) {
          // AI types its move
          if (soundEnabled) playKeyClick();
          processAIMove(aiCell, newBoard, newPicked, nextTurn);
        }
      }, 500);
    }
  }, [gameState, setGameState, soundEnabled]);

  // Handle AI turn
  const processAIMove = (aiCell: number, board: CellValue[], picked: number[], turn: number) => {
    const newBoard = [...board];
    newBoard[aiCell] = 'o';
    const newPicked = [...picked, aiCell];
    const octothropeLines = formatOctothrope(newBoard);

    const winner = checkWinner(newBoard);
    const isDraw = !winner && newPicked.length === 9;

    const updatedLines: TerminalLine[] = [
      {
        id: `ai-input-${Date.now()}`,
        type: 'prompt',
        content: `user2: enter which cell do you want to mark ; ${aiCell} [AI Move]`
      },
      {
        id: `ai-board-${Date.now()}`,
        type: 'board',
        content: octothropeLines
      }
    ];

    if (winner) {
      if (soundEnabled) playWinSound();
      updatedLines.push({
        id: `win-${Date.now()}`,
        type: 'win',
        content: `${winner} won`
      });
      updatedLines.push({
        id: `list-${Date.now()}`,
        type: 'system',
        content: `[${newPicked.join(', ')}]\nGame Over! Click 'Restart' or type 'restart' to play again.`
      });

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        pickedCells: newPicked,
        isGameOver: true,
        winner,
        waitingForInput: false
      }));

      setLines(prev => [...prev, ...updatedLines]);
      setInputPrompt("PS C:\\Users\\user> ");
      return;
    }

    if (isDraw) {
      if (soundEnabled) playErrorSound();
      updatedLines.push({
        id: `draw-${Date.now()}`,
        type: 'draw',
        content: 'DRAW'
      });
      updatedLines.push({
        id: `list-${Date.now()}`,
        type: 'system',
        content: `[${newPicked.join(', ')}]\nGame Over! Click 'Restart' or type 'restart' to play again.`
      });

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        pickedCells: newPicked,
        isGameOver: true,
        winner: 'draw',
        waitingForInput: false
      }));

      setLines(prev => [...prev, ...updatedLines]);
      setInputPrompt("PS C:\\Users\\user> ");
      return;
    }

    const nextTurn = turn + 1;
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      pickedCells: newPicked,
      currentTurn: nextTurn
    }));

    setLines(prev => [...prev, ...updatedLines]);
    setInputPrompt(`user1: enter which cell do you want to mark ; `);
  };

  // Wire ref so external components (MobileKeyBar) can trigger moves
  useEffect(() => {
    onSelectCellRef.current = (cell: number) => {
      if (!isTypingInit) {
        processMove(cell);
      }
    };
  }, [isTypingInit, processMove, onSelectCellRef]);

  // Handle Enter key submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTypingInit) return;

    const trimmed = inputValue.trim();
    if (!trimmed && gameState.isGameOver) {
      onRestart();
      return;
    }

    // Save to command history
    if (trimmed) {
      setHistory(prev => [...prev, trimmed]);
      setHistoryIdx(-1);
    }

    // Handle input in active game vs command mode
    if (!gameState.isGameOver) {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num)) {
        // Echo input line
        setLines(prev => [
          ...prev,
          {
            id: `in-${Date.now()}`,
            type: 'prompt',
            content: `${inputPrompt}${trimmed}`
          }
        ]);
        setInputValue('');
        processMove(num);
        return;
      }
    }

    // General CLI commands
    const rawCmd = trimmed.toLowerCase();
    setLines(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        type: 'prompt',
        content: `${inputPrompt}${trimmed}`
      }
    ]);
    setInputValue('');

    if (rawCmd === 'clear' || rawCmd === 'cls') {
      setLines([]);
    } else if (rawCmd === 'restart' || rawCmd === 'reset') {
      onRestart();
    } else if (rawCmd === 'python tictactoe_game.py' || rawCmd === 'python tictactoe_game.py init') {
      onRestart();
    } else if (rawCmd === 'cat tictactoe_game.py' || rawCmd === 'cat tictactoe.py') {
      setLines(prev => [
        ...prev,
        {
          id: `code-${Date.now()}`,
          type: 'code',
          content: PYTHON_TICTACTOE_CODE.split('\n')
        }
      ]);
    } else if (rawCmd === 'ls' || rawCmd === 'dir') {
      setLines(prev => [
        ...prev,
        {
          id: `fs-${Date.now()}`,
          type: 'system',
          content: [
            "    Directory: C:\\Users\\user",
            "",
            "Mode                 LastWriteTime         Length Name",
            "----                 -------------         ------ ----",
            "-a---          11/12/2024  7:05 PM           1842 tictactoe_game.py",
            "-a---          09/20/2026  8:00 AM            512 README.md"
          ]
        }
      ]);
    } else if (rawCmd === 'help') {
      setLines(prev => [
        ...prev,
        {
          id: `help-${Date.now()}`,
          type: 'system',
          content: [
            "Available Commands:",
            "  python tictactoe_game.py  - Start/Restart the Tic-Tac-Toe game",
            "  cat tictactoe_game.py     - View the original Python source code",
            "  restart                   - Reset game to initial state",
            "  mode ai / mode pvp        - Switch between Bot and 2-Player mode",
            "  ls / dir                  - List files in current directory",
            "  clear / cls               - Clear terminal screen",
            "  help                      - Show this command reference"
          ]
        }
      ]);
    } else if (rawCmd === 'mode ai') {
      setGameState(createInitialState('ai'));
      setLines(prev => [
        ...prev,
        {
          id: `mode-${Date.now()}`,
          type: 'system',
          content: "Switched to 'vs Computer (AI)' mode. Game restarted!"
        },
        {
          id: `guide-${Date.now()}`,
          type: 'guide',
          content: INITIAL_GUIDE
        }
      ]);
      setInputPrompt('user1: enter which cell do you want to mark ; ');
    } else if (rawCmd === 'mode pvp') {
      setGameState(createInitialState('pvp'));
      setLines(prev => [
        ...prev,
        {
          id: `mode-${Date.now()}`,
          type: 'system',
          content: "Switched to '2-Player (PvP)' mode. Game restarted!"
        },
        {
          id: `guide-${Date.now()}`,
          type: 'guide',
          content: INITIAL_GUIDE
        }
      ]);
      setInputPrompt('user1: enter which cell do you want to mark ; ');
    } else if (trimmed) {
      if (soundEnabled) playErrorSound();
      setLines(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'error',
          content: `'${trimmed}' is not recognized as an internal command. Type 'help' for options or enter a number 1-9.`
        }
      ]);
    }
  };

  // Handle special keys (Arrow Up/Down, Ctrl+L, Ctrl+R)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < history.length) {
          setHistoryIdx(nextIdx);
          setInputValue(history[nextIdx]);
        } else {
          setHistoryIdx(-1);
          setInputValue('');
        }
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      onRestart();
    } else if (soundEnabled && e.key.length === 1) {
      playKeyClick();
    }
  };

  return (
    <div className="terminal-body" onClick={handleTerminalClick}>
      <div className="terminal-scroll" ref={scrollRef}>
        {/* Render lines */}
        {lines.map(line => {
          if (Array.isArray(line.content)) {
            return (
              <div key={line.id} style={{ marginBottom: '8px' }}>
                {line.content.map((subLine, idx) => {
                  let className = 'terminal-line';
                  if (line.type === 'guide') className += ' grid-guide';
                  if (line.type === 'board') className += ' octothrope-board';
                  if (line.type === 'code') className += ' code-line';

                  // Highlight 'x' and 'o' inside board
                  return (
                    <div key={idx} className={className}>
                      {line.type === 'board' ? (
                        subLine.split('').map((char, cIdx) => {
                          if (char === 'x') return <span key={cIdx} className="char-x">{char}</span>;
                          if (char === 'o') return <span key={cIdx} className="char-o">{char}</span>;
                          return char;
                        })
                      ) : (
                        subLine
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          if (line.type === 'banner') {
            return (
              <div key={line.id} className="terminal-line ps-banner">
                {line.content}
              </div>
            );
          }

          if (line.type === 'prompt') {
            return (
              <div key={line.id} className="terminal-line ps-prompt">
                {line.content}
              </div>
            );
          }

          if (line.type === 'win') {
            return (
              <div key={line.id} className="win-announcement">
                🏆 {line.content}
              </div>
            );
          }

          if (line.type === 'draw') {
            return (
              <div key={line.id} className="draw-announcement">
                🤝 {line.content}
              </div>
            );
          }

          if (line.type === 'error') {
            return (
              <div key={line.id} className="terminal-line" style={{ color: 'var(--error)' }}>
                {line.content}
              </div>
            );
          }

          return (
            <div key={line.id} className="terminal-line" style={{ color: 'var(--fg-dim)' }}>
              {line.content}
            </div>
          );
        })}

        {/* Live Input Prompt */}
        {!isTypingInit && (
          <form onSubmit={handleSubmit} className="input-row">
            <span className={gameState.isGameOver ? "ps-prompt" : "turn-prompt"}>
              {inputPrompt}
            </span>
            <span style={{ color: 'var(--fg-bright)', marginLeft: '4px' }}>
              {inputValue}
            </span>
            <span className="cursor-block" />
            <input
              ref={inputRef}
              type="text"
              className="hidden-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        )}

        {isTypingInit && (
          <div className="input-row">
            <span className="ps-prompt">PS C:\Users\user&gt; </span>
            <span style={{ color: 'var(--fg-bright)', marginLeft: '4px' }}>
              {inputValue}
            </span>
            <span className="cursor-block" />
          </div>
        )}
      </div>
    </div>
  );
};
