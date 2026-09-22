import React from 'react';
import type { Incident, AIModelMode, HardwareTelemetry, HotfixCommitResult } from '../../types';
import { WorkstationView } from '../Workstation/WorkstationView';
import { PhoneCockpitView } from '../PhoneCockpit/PhoneCockpitView';
import { ArrowRightLeft } from 'lucide-react';

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
      {/* Office Kit Dual-Screen Synergy Banner */}
      <div className="office-kit-beam-banner">
        <div className="beam-line" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--iqoo-orange)', padding: '6px', borderRadius: '8px', color: '#FFF' }}>
            <ArrowRightLeft size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>iQOO Office Kit UltraLink Synergy</span>
              <span style={{ fontSize: '10px', background: 'rgba(0, 229, 255, 0.15)', color: 'var(--cyber-cyan)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-cyan)' }}>
                LATENCY: {telemetry.officeKitLatency}ms
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              Seamless phone-to-laptop dev loop: Trigger 1-tap hotfix on iQOO Phone → Instant git apply & commit on Laptop Workstation.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase' }}>Phone Phase</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--iqoo-orange)' }}>Red & Green Light Ready</div>
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

      {/* Right Column: iQOO Smartphone Cockpit */}
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
