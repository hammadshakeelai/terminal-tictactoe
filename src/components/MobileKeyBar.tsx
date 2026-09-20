import type { FC } from 'react';
import { RotateCcw } from 'lucide-react';
import { CellValue } from '../game/tictactoe_engine';

interface MobileKeyBarProps {
  onSelectCell: (cell: number) => void;
  onRestart: () => void;
  board: CellValue[];
  pickedCells: number[];
  disabled: boolean;
}

export const MobileKeyBar: FC<MobileKeyBarProps> = ({
  onSelectCell,
  onRestart,
  board,
  pickedCells,
  disabled
}) => {
  return (
    <div className="mobile-keypad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 2px 4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--fg-dim)', fontWeight: 500 }}>
          Quick Touch / Numeric Pad:
        </span>
        <button 
          className="key-btn action-btn" 
          onClick={onRestart}
          style={{ height: '26px', fontSize: '11px' }}
        >
          <RotateCcw size={11} style={{ marginRight: '4px' }} />
          Restart
        </button>
      </div>

      <div className="keypad-row">
        {[1, 2, 3].map(num => {
          const isPicked = pickedCells.includes(num);
          const val = board[num];
          return (
            <button
              key={num}
              className="key-btn"
              onClick={() => onSelectCell(num)}
              disabled={disabled || isPicked}
              style={{
                opacity: isPicked ? 0.45 : 1,
                color: val === 'x' ? '#f87171' : val === 'o' ? '#38bdf8' : 'var(--fg-bright)',
                cursor: isPicked || disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {val !== ' ' ? `${num} (${val})` : num}
            </button>
          );
        })}
      </div>

      <div className="keypad-row">
        {[4, 5, 6].map(num => {
          const isPicked = pickedCells.includes(num);
          const val = board[num];
          return (
            <button
              key={num}
              className="key-btn"
              onClick={() => onSelectCell(num)}
              disabled={disabled || isPicked}
              style={{
                opacity: isPicked ? 0.45 : 1,
                color: val === 'x' ? '#f87171' : val === 'o' ? '#38bdf8' : 'var(--fg-bright)',
                cursor: isPicked || disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {val !== ' ' ? `${num} (${val})` : num}
            </button>
          );
        })}
      </div>

      <div className="keypad-row">
        {[7, 8, 9].map(num => {
          const isPicked = pickedCells.includes(num);
          const val = board[num];
          return (
            <button
              key={num}
              className="key-btn"
              onClick={() => onSelectCell(num)}
              disabled={disabled || isPicked}
              style={{
                opacity: isPicked ? 0.45 : 1,
                color: val === 'x' ? '#f87171' : val === 'o' ? '#38bdf8' : 'var(--fg-bright)',
                cursor: isPicked || disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {val !== ' ' ? `${num} (${val})` : num}
            </button>
          );
        })}
      </div>
    </div>
  );
};
