import { useState, type FC } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { PYTHON_TICTACTOE_CODE } from '../game/tictactoe_code';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_TICTACTOE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>tictactoe_game.py</span>
            <span style={{ fontSize: '11px', color: 'var(--fg-dim)', fontWeight: 'normal' }}>
              (safetynet2 commit 3088d12)
            </span>
          </div>
          <button 
            className="win-btn" 
            style={{ width: '28px', height: '28px', borderRadius: '4px' }}
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </div>

        {/* Info banner */}
        <div style={{ 
          padding: '10px 16px', 
          background: 'rgba(76, 194, 255, 0.08)', 
          borderBottom: '1px solid var(--border)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>
            Original source: <code>vscode/tictactoe.py/finalized.py</code> in <strong>hammadshakeelai/safetynet2</strong>
          </span>
          <a 
            href="https://github.com/hammadshakeelai/safetynet2/blob/3088d128ae99c145c5e11185b44950cb221d599d/vscode/tictactoe.py/finalized.py" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            <span>GitHub</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Body with syntax-like display */}
        <div className="modal-body">
          <pre style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {PYTHON_TICTACTOE_CODE}
          </pre>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="icon-btn primary" 
            onClick={handleCopy}
            style={{ padding: '6px 14px' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Python Code'}</span>
          </button>
          <button 
            className="icon-btn" 
            onClick={onClose}
            style={{ padding: '6px 14px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
