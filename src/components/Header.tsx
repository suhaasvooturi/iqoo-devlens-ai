import React from 'react';
import type { DeviceViewMode } from '../types';
import { Smartphone, Laptop, SplitSquareVertical, QrCode } from 'lucide-react';

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
          DevLens AI
          <span className="track-tag">Developer Tools Track</span>
        </h1>
      </div>

      <div className="view-switcher">
        <button
          className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
          onClick={() => onViewModeChange('split')}
          title="Simulate iQOO Office Kit dual screen synergy"
        >
          <SplitSquareVertical size={14} />
          Office Kit Dual
        </button>
        <button
          className={`view-btn ${viewMode === 'phone' ? 'active' : ''}`}
          onClick={() => onViewModeChange('phone')}
          title="Phone-only view (iQOO Red Light phase)"
        >
          <Smartphone size={14} />
          Phone Cockpit
        </button>
        <button
          className={`view-btn ${viewMode === 'workstation' ? 'active' : ''}`}
          onClick={() => onViewModeChange('workstation')}
          title="Laptop IDE & Terminal workstation"
        >
          <Laptop size={14} />
          Workstation IDE
        </button>
      </div>

      <div className="header-actions">
        <div className="bridge-status-pill" title="iQOO Office Kit P2P sync active">
          <div className="pulse-dot"></div>
          <span>Office Kit UltraLink</span>
          <span style={{ color: 'var(--cyber-cyan)', fontWeight: 600 }}>{latencyMs}ms</span>
        </div>

        <button className="action-btn" onClick={onOpenQRModal} title="Connect physical smartphone via QR code">
          <QrCode size={14} />
          <span>Connect Phone</span>
        </button>
      </div>
    </header>
  );
};
