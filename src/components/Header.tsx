import React from 'react';
import type { DeviceViewMode } from '../types';
import { Smartphone, Laptop, Columns, QrCode, Command } from 'lucide-react';

interface HeaderProps {
  viewMode: DeviceViewMode;
  onViewModeChange: (mode: DeviceViewMode) => void;
  onOpenQRModal: () => void;
  onOpenCommandPalette?: () => void;
  latencyMs: string;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenQRModal,
  onOpenCommandPalette,
  latencyMs,
}) => {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="iqoo-badge">iQOO</div>
        <h1 className="app-title">
          DevLens AI
          <span className="track-tag">AI Engineering Copilot</span>
        </h1>
      </div>

      <div className="view-switcher">
        <button
          className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
          onClick={() => onViewModeChange('split')}
          title="Dual Screen Synergy"
        >
          <Columns size={13} />
          <span>Office Kit Dual</span>
        </button>
        <button
          className={`view-btn ${viewMode === 'phone' ? 'active' : ''}`}
          onClick={() => onViewModeChange('phone')}
          title="Phone Cockpit"
        >
          <Smartphone size={13} />
          <span>iQOO Phone</span>
        </button>
        <button
          className={`view-btn ${viewMode === 'workstation' ? 'active' : ''}`}
          onClick={() => onViewModeChange('workstation')}
          title="Laptop IDE & Terminal"
        >
          <Laptop size={13} />
          <span>Workstation</span>
        </button>
      </div>

      <div className="header-actions">
        {onOpenCommandPalette && (
          <button
            className="action-btn"
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Ctrl+K)"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Command size={12} color="var(--accent-primary)" />
            <span>Palette</span>
            <span style={{ fontSize: '9.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>Ctrl+K</span>
          </button>
        )}

        <div className="bridge-status-pill" title="UltraLink Local Sync">
          <div className="pulse-dot" />
          <span>UltraLink</span>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{latencyMs}ms</span>
        </div>

        <button className="action-btn" onClick={onOpenQRModal} title="Connect smartphone via QR code">
          <QrCode size={13} />
          <span>Connect Phone</span>
        </button>
      </div>
    </header>
  );
};
