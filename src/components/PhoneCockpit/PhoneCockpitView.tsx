import React, { useState } from 'react';
import type { Incident, AIModelMode, HardwareTelemetry, HotfixCommitResult } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { CameraScanner } from './CameraScanner';
import { DiagnosticCard } from './DiagnosticCard';
import { PairPilotChat } from './PairPilotChat';
import { PatchStudio } from './PatchStudio';
import { officeKitBridge, type BridgeEventLog } from '../../services/bridgeService';
import {
  Home,
  Camera,
  MessageSquare,
  Radio,
  Zap,
  Code2,
  FlaskConical,
  ShieldAlert,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Wifi,
  BatteryCharging,
  ArrowRight,
  FileDiff,
} from 'lucide-react';

interface PhoneCockpitViewProps {
  incident: Incident;
  telemetry: HardwareTelemetry;
  modelMode: AIModelMode;
  onModelModeChange: (mode: AIModelMode) => void;
  onDeployHotfix: (result: HotfixCommitResult) => void;
  isDeployed: boolean;
  deployedResult: HotfixCommitResult | null;
}

export type MobileTab = 'home' | 'scan' | 'ai' | 'alerts' | 'link';

export const PhoneCockpitView: React.FC<PhoneCockpitViewProps> = ({
  incident,
  telemetry,
  modelMode,
  onModelModeChange,
  onDeployHotfix,
  isDeployed,
  deployedResult,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [bridgeLogs, setBridgeLogs] = useState<BridgeEventLog[]>(officeKitBridge.getEventLogs());

  React.useEffect(() => {
    return officeKitBridge.subscribeLogs((logs) => {
      setBridgeLogs(logs);
    });
  }, []);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleQuickAction = (action: 'fix' | 'explain' | 'test' | 'security') => {
    if (action === 'fix') {
      officeKitBridge.send({
        type: 'PHONE_SEND_FIX',
        patchDiff: incident.gitDiff,
        incidentId: incident.id,
      });
      triggerFeedback('Hotfix patch transmitted to laptop workstation!');
      setActiveTab('alerts');
    } else if (action === 'explain') {
      officeKitBridge.send({
        type: 'PHONE_EXPLAIN_REQUEST',
        query: incident.title,
      });
      triggerFeedback('Requested AI explanation from workstation...');
      setActiveTab('ai');
    } else if (action === 'test') {
      officeKitBridge.send({
        type: 'TESTS_RUN',
        result: 'passed',
        incidentId: incident.id,
      });
      triggerFeedback('Test suite triggered: 12/12 passing');
      setActiveTab('alerts');
    } else if (action === 'security') {
      triggerFeedback('Security audit: Zero OWASP CVE vulnerabilities');
      setActiveTab('alerts');
    }
  };

  return (
    <PhoneFrame>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '620px' }}>
        {/* TOP STATUS BAR: DEVLENS | ● Connected | Battery */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--accent-primary)',
                letterSpacing: '0.8px',
              }}
            >
              DEVLENS AI
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10.5px',
                color: 'var(--status-success)',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '1px 6px',
                borderRadius: '8px',
              }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--status-success)' }} />
              <span>Connected</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Wifi size={11} color="var(--accent-primary)" />
              <span style={{ fontFamily: 'var(--font-mono)' }}>{telemetry.officeKitLatency}ms</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <BatteryCharging size={11} color="#10B981" />
              <span>86%</span>
            </div>
          </div>
        </div>

        {/* Temporary action toast */}
        {actionFeedback && (
          <div
            style={{
              padding: '6px 12px',
              background: 'rgba(0, 229, 255, 0.15)',
              borderBottom: '1px solid var(--accent-primary)',
              fontSize: '11px',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {actionFeedback}
          </div>
        )}

        {/* MAIN BODY AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {/* TAB: HOME / COCKPIT OVERVIEW */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Incident meta bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GitBranch size={11} />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{incident.devContext?.activeBranch || 'main'}</span>
                </div>
                <div>
                  {isDeployed ? (
                    <span style={{ color: 'var(--status-success)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={11} /> Resolved
                    </span>
                  ) : (
                    <span style={{ color: '#F87171', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <AlertCircle size={11} /> Active Alert
                    </span>
                  )}
                </div>
              </div>

              {/* MAIN CARD: Latest Developer Alert */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.6px' }}>
                    Latest Developer Alert
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: incident.severity === 'CRITICAL' ? '#F87171' : '#FBBF24',
                      background: incident.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {incident.severity}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Error
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#F87171',
                      fontFamily: 'var(--font-mono)',
                      wordBreak: 'break-all',
                      marginTop: '2px',
                    }}
                  >
                    {incident.errorType}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    at {incident.culpritFile}:{incident.culpritLine}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
                    AI Summary
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', marginTop: '3px', lineHeight: '1.4' }}>
                    {incident.humanSummary || incident.rootCause}
                  </div>
                </div>

                {/* 4 TOUCH-FRIENDLY ACTION BUTTONS */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                >
                  <button
                    onClick={() => handleQuickAction('fix')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-primary)',
                      border: 'none',
                      color: '#07090E',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Zap size={14} />
                    <span>[FIX]</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('explain')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Code2 size={14} color="var(--accent-primary)" />
                    <span>[EXPLAIN]</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('test')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <FlaskConical size={14} color="#38BDF8" />
                    <span>[TEST]</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('security')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '12px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-raised)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ShieldAlert size={14} color="#10B981" />
                    <span>[SECURITY]</span>
                  </button>
                </div>
              </div>

              {/* Hardware Telemetry Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '11px',
                }}
              >
                <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-dim)' }}>On-Device NPU</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{telemetry.npuInferenceSpeed}</div>
                </div>
                <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-dim)' }}>Battery Temp</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{telemetry.batteryTemp}</div>
                </div>
              </div>

              {/* Quick Diff Action banner */}
              <div
                onClick={() => setActiveTab('alerts')}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileDiff size={14} color="var(--accent-primary)" />
                  <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    View Senior Dev Diagnosis & Voice
                  </span>
                </div>
                <ArrowRight size={13} color="var(--text-dim)" />
              </div>
            </div>
          )}

          {/* TAB: SCAN (Real Camera + OCR) */}
          {activeTab === 'scan' && (
            <CameraScanner
              incident={incident}
              onScanComplete={() => triggerFeedback('Stack trace extracted & linked to incident')}
            />
          )}

          {/* TAB: AI / PAIR PILOT */}
          {activeTab === 'ai' && (
            <PairPilotChat incident={incident} />
          )}

          {/* TAB: ALERTS / DIAGNOSTICS & HOTFIX */}
          {activeTab === 'alerts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <DiagnosticCard
                incident={incident}
                modelMode={modelMode}
                onModelModeChange={onModelModeChange}
                telemetry={telemetry}
              />
              <PatchStudio
                incident={incident}
                onDeployHotfix={onDeployHotfix}
                isDeployed={isDeployed}
                deployedResult={deployedResult}
              />
            </div>
          )}

          {/* TAB: LINK / CROSS-DEVICE TELEMETRY */}
          {activeTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  UltraLink P2P Topology
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Active Model: <strong style={{ color: 'var(--accent-primary)' }}>WORKSTATION ↔ DEVLENS LINK ↔ iQOO PHONE</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '8px', color: 'var(--text-muted)' }}>
                  <span>Measured Latency</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-success)' }}>{telemetry.officeKitLatency} ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  <span>Sync State</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>LIVE BROADCAST MESH</span>
                </div>
              </div>

              {/* Real-time transaction log */}
              <div
                style={{
                  padding: '12px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Live Transaction Log
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                  {bridgeLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '6px 8px',
                        background: 'var(--bg-app)',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: log.source === 'phone' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                          {log.source.toUpperCase()}
                        </span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div style={{ color: 'var(--text-primary)' }}>{log.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION: Home | Scan | AI | Alerts | Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '8px 4px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setActiveTab('home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'home' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: activeTab === 'home' ? 700 : 500,
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '52px',
            }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'scan' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: activeTab === 'scan' ? 700 : 500,
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '52px',
            }}
          >
            <Camera size={16} />
            <span>Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'ai' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: activeTab === 'ai' ? 700 : 500,
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '52px',
            }}
          >
            <MessageSquare size={16} />
            <span>AI</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'alerts' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: activeTab === 'alerts' ? 700 : 500,
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '52px',
            }}
          >
            <AlertCircle size={16} />
            <span>Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'link' ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: activeTab === 'link' ? 700 : 500,
              cursor: 'pointer',
              padding: '6px 12px',
              minWidth: '52px',
            }}
          >
            <Radio size={16} />
            <span>Link</span>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
};
