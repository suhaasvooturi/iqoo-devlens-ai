import React, { useState } from 'react';
import type { Incident, AIModelMode, HardwareTelemetry, HotfixCommitResult } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { CameraScanner } from './CameraScanner';
import { DiagnosticCard } from './DiagnosticCard';
import { PairPilotChat } from './PairPilotChat';
import { VisualPreview } from './VisualPreview';
import { PatchStudio } from './PatchStudio';
import { FileText, Camera, MessageSquare, Monitor, GitPullRequest, GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';

interface PhoneCockpitViewProps {
  incident: Incident;
  telemetry: HardwareTelemetry;
  modelMode: AIModelMode;
  onModelModeChange: (mode: AIModelMode) => void;
  onDeployHotfix: (result: HotfixCommitResult) => void;
  isDeployed: boolean;
  deployedResult: HotfixCommitResult | null;
}

export const PhoneCockpitView: React.FC<PhoneCockpitViewProps> = ({
  incident,
  telemetry,
  modelMode,
  onModelModeChange,
  onDeployHotfix,
  isDeployed,
  deployedResult,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'scanner' | 'chat' | 'preview' | 'patch'>('diagnosis');

  const handleScanComplete = () => {
    setTimeout(() => {
      setActiveTab('diagnosis');
    }, 500);
  };

  return (
    <PhoneFrame>
      {/* Real Developer Incident Header (Linear/GitHub Mobile style) */}
      <div className="phone-incident-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GitBranch size={13} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>
            {incident.devContext?.activeBranch || 'main'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {isDeployed ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontSize: '11px', fontWeight: 600 }}>
              <CheckCircle2 size={12} />
              Resolved
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F87171', fontSize: '11px', fontWeight: 600 }}>
              <AlertCircle size={12} />
              Active Incident
            </span>
          )}
        </div>
      </div>

      {/* Clean Linear-style Navigation Tabs */}
      <div className="phone-nav-tabs">
        <button
          className={`phone-tab-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnosis')}
        >
          <FileText size={12} />
          <span>Overview</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <Camera size={12} />
          <span>Scan</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={12} />
          <span>Chat</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          <Monitor size={12} />
          <span>UX</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'patch' ? 'active' : ''}`}
          onClick={() => setActiveTab('patch')}
        >
          <GitPullRequest size={12} />
          <span>Diff</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'diagnosis' && (
        <DiagnosticCard
          incident={incident}
          modelMode={modelMode}
          onModelModeChange={onModelModeChange}
          telemetry={telemetry}
        />
      )}

      {activeTab === 'scanner' && (
        <CameraScanner incident={incident} onScanComplete={handleScanComplete} />
      )}

      {activeTab === 'chat' && <PairPilotChat incident={incident} />}

      {activeTab === 'preview' && (
        <VisualPreview incident={incident} isDeployed={isDeployed} />
      )}

      {activeTab === 'patch' && (
        <PatchStudio
          incident={incident}
          onDeployHotfix={onDeployHotfix}
          isDeployed={isDeployed}
          deployedResult={deployedResult}
        />
      )}
    </PhoneFrame>
  );
};
