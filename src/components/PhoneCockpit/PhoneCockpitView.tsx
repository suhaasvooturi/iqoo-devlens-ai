import React, { useState } from 'react';
import type { Incident, AIModelMode, HardwareTelemetry, HotfixCommitResult } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { CameraScanner } from './CameraScanner';
import { DiagnosticCard } from './DiagnosticCard';
import { PairPilotChat } from './PairPilotChat';
import { VisualPreview } from './VisualPreview';
import { PatchStudio } from './PatchStudio';
import { Scan, BrainCircuit, MessageSquare, Eye, GitPullRequest } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'scanner' | 'diagnosis' | 'chat' | 'preview' | 'patch'>('diagnosis');

  const handleScanComplete = () => {
    setTimeout(() => {
      setActiveTab('diagnosis');
    }, 600);
  };

  return (
    <PhoneFrame>
      {/* 5-Pill Humanized Phone Navigation Tabs */}
      <div
        className="phone-nav-tabs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2px',
          padding: '2px',
        }}
      >
        <button
          className={`phone-tab-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
          title="Camera OCR Scanner"
        >
          <Scan size={12} />
          <span>Scan</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnosis')}
          title="AI Diagnosis & Voice Briefing"
        >
          <BrainCircuit size={12} />
          <span>Intel</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
          title="Pair Pilot Copilot Chat"
        >
          <MessageSquare size={12} />
          <span>Chat</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
          title="Visual UI Simulation"
        >
          <Eye size={12} />
          <span>UX</span>
        </button>
        <button
          className={`phone-tab-btn ${activeTab === 'patch' ? 'active' : ''}`}
          onClick={() => setActiveTab('patch')}
          title="Git Diff & 1-Tap Deploy"
        >
          <GitPullRequest size={12} />
          <span>Diff</span>
        </button>
      </div>

      {/* Real-time Hardware & NPU Telemetry Banner */}
      <div className="phone-telemetry-banner">
        <div className="telemetry-item">
          <span className="telemetry-label">Assignee</span>
          <span className="telemetry-val" style={{ color: 'var(--cyber-cyan)', fontSize: '11px' }}>
            {(incident.devContext?.assignee || 'Suhas').split(' ')[0]}
          </span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">Engine</span>
          <span className="telemetry-val" style={{ fontSize: '10px' }}>
            {modelMode === 'edge-local' ? 'Qwen NPU' : 'DeepSeek Cloud'}
          </span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">NPU Speed</span>
          <span className="telemetry-val" style={{ color: 'var(--iqoo-orange)' }}>
            {telemetry.npuInferenceSpeed}
          </span>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'scanner' && (
        <CameraScanner incident={incident} onScanComplete={handleScanComplete} />
      )}

      {activeTab === 'diagnosis' && (
        <DiagnosticCard
          incident={incident}
          modelMode={modelMode}
          onModelModeChange={onModelModeChange}
          telemetry={telemetry}
        />
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
