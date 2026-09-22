import React from 'react';
import type { DeviceViewMode } from '../types';
import { Smartphone, Laptop, Columns, QrCode } from 'lucide-react';

interface HeaderProps {
  viewMode: DeviceViewMode;
  onViewModeChange: (mode: DeviceViewMode) => void;
  onOpenQRModal: () => void;
  latencyMs: string;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenQRModal,
  latencyMs,
}) => {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="iqoo-badge">iQOO</div>
        <h1 className="app-title">
          DevLens
          <span className="track-tag">Developer Tools Track</span>
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
          <span>Phone</span>
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
        <div className="bridge-status-pill" title="UltraLink Local Sync">
          <div className="pulse-dot" />
          <span>Office Kit</span>
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
