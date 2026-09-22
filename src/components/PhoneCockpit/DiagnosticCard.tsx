import React, { useState } from 'react';
import type { Incident, AIModelMode, HardwareTelemetry } from '../../types';
import { AlertCircle, Zap, Volume2, VolumeX, Cpu } from 'lucide-react';

interface DiagnosticCardProps {
  incident: Incident;
  modelMode: AIModelMode;
  onModelModeChange: (mode: AIModelMode) => void;
  telemetry: HardwareTelemetry;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({
  incident,
  modelMode,
  onModelModeChange,
  telemetry,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(incident.voiceBriefing || incident.rootCause);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="diag-card">
      {/* Incident Metadata Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className={`diag-severity-badge ${
              incident.severity === 'CRITICAL' ? 'severity-critical' : 'severity-high'
            }`}
          >
            <AlertCircle size={12} />
            {incident.severity}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {incident.framework}
          </span>
        </div>

        <button
          onClick={handleToggleAudio}
          className="action-btn"
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: isPlayingAudio ? 'var(--accent-primary)' : 'var(--bg-surface-raised)',
            color: isPlayingAudio ? '#FFFFFF' : 'var(--text-secondary)',
            borderColor: isPlayingAudio ? 'var(--accent-primary)' : 'var(--border-subtle)',
          }}
          title="Listen to audio diagnosis"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX size={12} />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 size={12} />
              <span>Audio Brief</span>
            </>
          )}
        </button>
      </div>

      {/* Incident Title */}
      <div className="diag-header">
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {incident.errorType}
        </h3>

        {/* Culprit File Pointer */}
        <div className="diag-culprit-pill">
          <Zap size={12} color="var(--accent-primary)" />
          <span>
            {incident.culpritFile}:{incident.culpritLine}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <div className="diag-section-label">Root Cause Summary</div>
        <div className="diag-explanation">
          {incident.humanSummary || incident.rootCause}
        </div>
      </div>

      {/* Impact */}
      <div>
        <div className="diag-section-label">Customer & System Impact</div>
        <div className="diag-impact">{incident.impactAnalysis}</div>
      </div>

      {/* Model Engine Selector (Subtle) */}
      <div
        style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Engine · {telemetry.npuInferenceSpeed}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onModelModeChange('edge-local')}
            style={{
              background: modelMode === 'edge-local' ? 'var(--bg-surface-raised)' : 'transparent',
              border: modelMode === 'edge-local' ? '1px solid var(--border-medium)' : '1px solid transparent',
              color: modelMode === 'edge-local' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            On-Device NPU
          </button>
          <button
            onClick={() => onModelModeChange('cloud-deep')}
            style={{
              background: modelMode === 'cloud-deep' ? 'var(--bg-surface-raised)' : 'transparent',
              border: modelMode === 'cloud-deep' ? '1px solid var(--border-medium)' : '1px solid transparent',
              color: modelMode === 'cloud-deep' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Cloud Model
          </button>
        </div>
      </div>
    </div>
  );
};
