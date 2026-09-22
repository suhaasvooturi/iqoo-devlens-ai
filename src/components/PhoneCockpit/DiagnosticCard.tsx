import React, { useState } from 'react';
import type { Incident, AIModelMode, HardwareTelemetry } from '../../types';
import { Cpu, AlertTriangle, Zap, Server, Volume2, VolumeX, Bell, Sparkles } from 'lucide-react';

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

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(incident.voiceBriefing);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="diag-card">
      {/* Human Incident Context Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(0, 229, 255, 0.08))',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10.5px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }}>
          <Bell size={12} color="var(--iqoo-orange)" />
          <span>{incident.devContext?.reportedBy || 'Sentry Monitoring'}</span>
        </div>
        <div style={{ color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>
          {incident.devContext?.assignee || 'Suhas (Lead Dev)'}
        </div>
      </div>

      <div className="diag-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              className={`diag-severity-badge ${
                incident.severity === 'CRITICAL' ? 'severity-critical' : 'severity-high'
              }`}
            >
              <AlertTriangle size={12} />
              {incident.severity} · {incident.severityScore}/10
            </span>

            {/* Audio Voice Briefing Button */}
            <button
              onClick={handleToggleAudio}
              className="action-btn"
              style={{
                background: isPlayingAudio ? 'var(--iqoo-orange)' : 'var(--bg-card-secondary)',
                borderColor: isPlayingAudio ? 'var(--iqoo-orange)' : 'var(--border-light)',
                color: isPlayingAudio ? '#FFFFFF' : 'var(--cyber-cyan)',
                fontSize: '10.5px',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
              title="Read diagnosis aloud using on-device speech synthesis"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX size={12} />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 size={12} />
                  <span>Audio Briefing</span>
                </>
              )}
            </button>
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '6px' }}>
            {incident.errorType}
          </h3>
        </div>
      </div>

      {/* Culprit File Pointer */}
      <div className="diag-culprit-pill" title={incident.culpritFile}>
        <Zap size={12} color="var(--iqoo-orange)" />
        <span>
          {incident.culpritFile}:{incident.culpritLine}
        </span>
      </div>

      {/* Senior Dev Human Summary */}
      <div>
        <div className="diag-section-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} color="var(--iqoo-orange)" />
          <span>Senior Engineer Breakdown</span>
        </div>
        <div className="diag-explanation" style={{ fontSize: '12px', lineHeight: 1.55, color: '#E2E8F0' }}>
          {incident.humanSummary || incident.rootCause}
        </div>
      </div>

      {/* Impact & Blast Radius */}
      <div>
        <div className="diag-section-label">User & System Impact</div>
        <div className="diag-impact">{incident.impactAnalysis}</div>
      </div>

      {/* Model Engine Switcher (Open-Source / Edge NPU Bonus) */}
      <div style={{ background: '#090C12', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 600 }}>
            Inference Engine
          </span>
          <span style={{ fontSize: '10px', color: 'var(--status-success)', fontFamily: 'var(--font-mono)' }}>
            {modelMode === 'edge-local' ? 'On-Device NPU' : 'Cloud Serverless'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <button
            className={`action-btn ${modelMode === 'edge-local' ? 'active' : ''}`}
            onClick={() => onModelModeChange('edge-local')}
            style={{
              justifyContent: 'center',
              fontSize: '11px',
              borderColor: modelMode === 'edge-local' ? 'var(--iqoo-orange)' : 'var(--border-subtle)',
              background: modelMode === 'edge-local' ? 'var(--iqoo-orange-subtle)' : 'transparent',
              color: modelMode === 'edge-local' ? 'var(--iqoo-orange)' : '#94A3B8',
            }}
          >
            <Cpu size={12} />
            <span>Local Qwen (NPU)</span>
          </button>

          <button
            className={`action-btn ${modelMode === 'cloud-deep' ? 'active' : ''}`}
            onClick={() => onModelModeChange('cloud-deep')}
            style={{
              justifyContent: 'center',
              fontSize: '11px',
              borderColor: modelMode === 'cloud-deep' ? 'var(--cyber-cyan)' : 'var(--border-subtle)',
              background: modelMode === 'cloud-deep' ? 'var(--cyber-cyan-subtle)' : 'transparent',
              color: modelMode === 'cloud-deep' ? 'var(--cyber-cyan)' : '#94A3B8',
            }}
          >
            <Server size={12} />
            <span>DeepSeek Cloud</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
          <span>Throughput: {telemetry.npuInferenceSpeed}</span>
          <span>Temp: {telemetry.batteryTemp}</span>
        </div>
      </div>
    </div>
  );
};
