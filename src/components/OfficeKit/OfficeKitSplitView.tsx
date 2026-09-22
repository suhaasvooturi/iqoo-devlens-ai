import React from 'react';
import type { Incident, AIModelMode, HardwareTelemetry, HotfixCommitResult } from '../../types';
import { WorkstationView } from '../Workstation/WorkstationView';
import { PhoneCockpitView } from '../PhoneCockpit/PhoneCockpitView';
import { ArrowLeftRight, Laptop, Smartphone } from 'lucide-react';

interface OfficeKitSplitViewProps {
  incident: Incident;
  telemetry: HardwareTelemetry;
  modelMode: AIModelMode;
  onModelModeChange: (mode: AIModelMode) => void;
  onDeployHotfix: (result: HotfixCommitResult) => void;
  isDeployed: boolean;
  deployedResult: HotfixCommitResult | null;
  onResetIncident: () => void;
}

export const OfficeKitSplitView: React.FC<OfficeKitSplitViewProps> = ({
  incident,
  telemetry,
  modelMode,
  onModelModeChange,
  onDeployHotfix,
  isDeployed,
  deployedResult,
  onResetIncident,
}) => {
  return (
    <div className="split-view-container">
      {/* Clean Dual-Device Synergy Banner */}
      <div className="office-kit-beam-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
            <ArrowLeftRight size={15} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>iQOO Office Kit UltraLink</span>
              <span style={{ fontSize: '10.5px', background: 'var(--status-success-bg)', color: 'var(--status-success)', border: '1px solid var(--status-success-border)', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                {telemetry.officeKitLatency}ms Local P2P
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Dual-screen developer loop: Review and approve hotfix on phone → Workstation terminal applies git commit instantly.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Laptop size={13} />
            <span>Laptop IDE</span>
          </div>
          <span>+</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={13} />
            <span>Phone Cockpit</span>
          </div>
        </div>
      </div>

      {/* Left Column: Workstation IDE & Terminal */}
      <WorkstationView
        incident={incident}
        isDeployed={isDeployed}
        deployedResult={deployedResult}
        onResetIncident={onResetIncident}
      />

      {/* Right Column: Mobile Cockpit */}
      <PhoneCockpitView
        incident={incident}
        telemetry={telemetry}
        modelMode={modelMode}
        onModelModeChange={onModelModeChange}
        onDeployHotfix={onDeployHotfix}
        isDeployed={isDeployed}
        deployedResult={deployedResult}
      />
    </div>
  );
};
