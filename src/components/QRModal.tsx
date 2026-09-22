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
        background: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-orange)',
          borderRadius: '20px',
          padding: '28px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px var(--iqoo-orange-glow)',
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
            color: '#94A3B8',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--iqoo-orange)', padding: '6px', borderRadius: '8px', color: '#FFF' }}>
            <Smartphone size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Connect Physical Phone</h3>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>iQOO Office Kit Cross-Device Synergy</p>
          </div>
        </div>

        {/* High-Tech QR Code Display */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '18px',
          }}
        >
          <svg width="180" height="180" viewBox="0 0 100 100" fill="#000000">
            <rect x="5" y="5" width="28" height="28" fill="#000" />
            <rect x="9" y="9" width="20" height="20" fill="#fff" />
            <rect x="13" y="13" width="12" height="12" fill="#FF5500" />

            <rect x="67" y="5" width="28" height="28" fill="#000" />
            <rect x="71" y="9" width="20" height="20" fill="#fff" />
            <rect x="75" y="13" width="12" height="12" fill="#FF5500" />

            <rect x="5" y="67" width="28" height="28" fill="#000" />
            <rect x="9" y="71" width="20" height="20" fill="#fff" />
            <rect x="13" y="75" width="12" height="12" fill="#FF5500" />

            <rect x="38" y="8" width="5" height="5" />
            <rect x="48" y="12" width="5" height="5" />
            <rect x="42" y="24" width="6" height="6" />
            <rect x="54" y="22" width="4" height="4" />
            <rect x="8" y="42" width="6" height="6" />
            <rect x="22" y="46" width="5" height="5" />
            <rect x="38" y="40" width="8" height="8" fill="#FF5500" />
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

        <div style={{ background: '#090C12', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Local Network URL</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyber-cyan)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUrl}
            </span>
            <button
              onClick={handleCopy}
              style={{ background: 'transparent', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}
            >
              {copied ? <Check size={14} color="#00F59B" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.5 }}>
          💡 <strong style={{ color: '#FFF' }}>Hackathon Demo Tip:</strong> Scan this with any phone on the same Wi-Fi network to control your laptop terminal and deploy hotfixes with 1-tap!
        </div>
      </div>
    </div>
  );
};
