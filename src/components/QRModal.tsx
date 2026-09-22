import React from 'react';
import { X, Smartphone, Copy, Check } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:5173';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
            <Smartphone size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Connect Smartphone</h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>iQOO Office Kit Local Pairing</p>
          </div>
        </div>

        {/* Clean High-Contrast QR Code */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <svg width="170" height="170" viewBox="0 0 100 100" fill="#000000">
            <rect x="5" y="5" width="28" height="28" fill="#000" />
            <rect x="9" y="9" width="20" height="20" fill="#fff" />
            <rect x="13" y="13" width="12" height="12" fill="#F97316" />

            <rect x="67" y="5" width="28" height="28" fill="#000" />
            <rect x="71" y="9" width="20" height="20" fill="#fff" />
            <rect x="75" y="13" width="12" height="12" fill="#F97316" />

            <rect x="5" y="67" width="28" height="28" fill="#000" />
            <rect x="9" y="71" width="20" height="20" fill="#fff" />
            <rect x="13" y="75" width="12" height="12" fill="#F97316" />

            <rect x="38" y="8" width="5" height="5" />
            <rect x="48" y="12" width="5" height="5" />
            <rect x="42" y="24" width="6" height="6" />
            <rect x="54" y="22" width="4" height="4" />
            <rect x="8" y="42" width="6" height="6" />
            <rect x="22" y="46" width="5" height="5" />
            <rect x="38" y="40" width="8" height="8" fill="#F97316" />
            <rect x="52" y="44" width="7" height="7" />
            <rect x="68" y="42" width="5" height="5" />
            <rect x="82" y="46" width="6" height="6" />
            <rect x="42" y="60" width="6" height="6" />
            <rect x="56" y="62" width="5" height="5" />
            <rect x="40" y="76" width="7" height="7" />
            <rect x="54" y="80" width="6" height="6" />
            <rect x="72" y="72" width="7" height="7" />
            <rect x="84" y="84" width="5" height="5" />
          </svg>
        </div>

        <div style={{ background: 'var(--bg-app)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '3px' }}>Local Network Address</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUrl}
            </span>
            <button
              onClick={handleCopy}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {copied ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          Scan with your smartphone camera to test phone-first debugging and hotfix approval on mobile.
        </div>
      </div>
    </div>
  );
};
