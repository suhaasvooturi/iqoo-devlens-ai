import React, { useState, useEffect } from 'react';
import type { DevToolId, DashboardStats, AnalysisHistoryItem } from '../../types';
import { officeKitBridge, type BridgeEventLog } from '../../services/bridgeService';
import {
  Bug,
  Code2,
  Zap,
  FlaskConical,
  ShieldAlert,
  BarChart3,
  FileText,
  Repeat,
  ArrowRight,
  CheckCircle2,
  History,
  Activity,
  Cpu,
  Wifi,
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Command,
  ChevronRight,
  Radio,
  FileCheck,
} from 'lucide-react';

interface DashboardToolProps {
  stats: DashboardStats;
  history: AnalysisHistoryItem[];
  onSelectTool: (id: DevToolId) => void;
  onClearHistory: () => void;
  onOpenCommandPalette?: () => void;
}

export const DashboardTool: React.FC<DashboardToolProps> = ({
  stats,
  history,
  onSelectTool,
  onClearHistory,
  onOpenCommandPalette,
}) => {
  const [eventLogs, setEventLogs] = useState<BridgeEventLog[]>(officeKitBridge.getEventLogs());
  const [demoStep, setDemoStep] = useState<number | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Subscribe to bridge events
  useEffect(() => {
    return officeKitBridge.subscribeLogs((logs) => {
      setEventLogs(logs);
    });
  }, []);

  // Demo flow runner: Incident -> Insight -> Fix -> Test -> Security -> Phone Sync
  const handleRunHackathonDemo = () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoStep(1);

    const steps = [
      { step: 1, delay: 900 },  // Error Detected
      { step: 2, delay: 1100 }, // Root Cause Found
      { step: 3, delay: 1100 }, // Fix Generated
      { step: 4, delay: 1000 }, // Test Generated
      { step: 5, delay: 1000 }, // Security Check Passed
      { step: 6, delay: 1200 }, // Fix Sent to iQOO Device
    ];

    let currentTimeout = 0;
    steps.forEach(({ step, delay }) => {
      currentTimeout += delay;
      setTimeout(() => {
        setDemoStep(step);
        if (step === 6) {
          officeKitBridge.send({
            type: 'PHONE_SEND_FIX',
            patchDiff: '@@ -4,2 +4,3 @@ -avatar.url +avatar?.url ?? fallback',
            incidentId: 'demo-hydration-fix',
          });
          setTimeout(() => setIsDemoRunning(false), 2000);
        }
      }, currentTimeout);
    });
  };

  const handleResetDemo = () => {
    setIsDemoRunning(false);
    setDemoStep(null);
  };

  const systemStatusItems = [
    { label: 'AI Engine', val: 'Online (Qwen 1.5B 4-bit NPU)', icon: Cpu, status: 'ok' },
    { label: 'Code Analysis Engine', val: 'Active (AST & Bytecode Parser)', icon: Activity, status: 'ok' },
    { label: 'Security Engine', val: 'Active (OWASP Top 10 Static Audit)', icon: ShieldCheck, status: 'ok' },
    { label: 'Device Link', val: 'UltraLink P2P Synced (<2.2ms)', icon: Wifi, status: 'ok' },
    { label: 'Phone Sentinel', val: 'Armed & Ready (Camera OCR + Voice)', icon: Smartphone, status: 'ok' },
    { label: 'Local Workspace', val: 'git: main (Clean / On-Device)', icon: FileCheck, status: 'ok' },
  ];

  const quickTools: Array<{ id: DevToolId; name: string; desc: string; icon: React.FC<{ size: number; color?: string }>; shortcut: string }> = [
    { id: 'debugger', name: 'AI Debugger', desc: 'Paste stack trace + code for root cause & git diff', icon: Bug, shortcut: '2' },
    { id: 'explainer', name: 'Code Explainer', desc: 'Executive summary, line walk & ELI5 breakdown', icon: Code2, shortcut: '3' },
    { id: 'optimizer', name: 'Code Optimizer', desc: 'Detect algorithmic bottlenecks (O(N²) → O(N))', icon: Zap, shortcut: '4' },
    { id: 'testgen', name: 'Test Generator', desc: 'Synthesize unit test suites for 5 frameworks', icon: FlaskConical, shortcut: '5' },
    { id: 'security', name: 'Security Scanner', desc: 'Scan for SQLi, XSS, and hardcoded tokens', icon: ShieldAlert, shortcut: '6' },
    { id: 'complexity', name: 'Complexity Analyzer', desc: 'Calculate asymptotic Big-O time & space curves', icon: BarChart3, shortcut: '7' },
    { id: 'docgen', name: 'Doc Generator', desc: 'Generate typed JSDoc & Markdown API specs', icon: FileText, shortcut: '8' },
    { id: 'converter', name: 'Code Converter', desc: 'Multi-language idiomatic code translation', icon: Repeat, shortcut: '9' },
  ];

  const workflowSteps = [
    { num: 1, title: 'Error Detected', desc: 'Terminal crash or camera OCR scan' },
    { num: 2, title: 'DevLens Analysis', desc: 'Local NPU / AST diagnostic engine' },
    { num: 3, title: 'Root Cause & Fix', desc: 'Pinpoint culprit line & unified diff' },
    { num: 4, title: 'Tests & Security', desc: 'Auto-verify happy paths & OWASP' },
    { num: 5, title: 'Workstation Push', desc: '1-tap patch deploy & sync to laptop' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(13, 17, 26, 0.95) 60%, rgba(255, 85, 0, 0.05) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 32px -8px rgba(0, 229, 255, 0.07)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                background: 'rgba(0, 229, 255, 0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                border: '1px solid rgba(0, 229, 255, 0.3)',
              }}
            >
              DevLens AI
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>iQOO Developer Ecosystem</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.4px' }}>
            Your AI Engineering Copilot
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Code faster. Debug smarter. Stay connected across laptop workstation and iQOO mobile cockpit.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Command size={14} color="var(--accent-primary)" />
              <span>Command Palette</span>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', background: 'var(--bg-app)', padding: '1px 5px', borderRadius: '3px' }}>
                Ctrl+K
              </span>
            </button>
          )}

          <button
            onClick={handleRunHackathonDemo}
            disabled={isDemoRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-sm)',
              background: isDemoRunning ? 'rgba(0, 229, 255, 0.2)' : 'var(--accent-primary)',
              border: 'none',
              color: isDemoRunning ? 'var(--accent-primary)' : '#07090E',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: isDemoRunning ? 'default' : 'pointer',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.35)',
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={14} />
            <span>{isDemoRunning ? 'Demo Flow Running...' : 'Run Hackathon Demo Flow'}</span>
          </button>
        </div>
      </div>

      {/* SYSTEM STATUS GRID */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', marginBottom: '10px' }}>
          System Status & Health
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
          }}
        >
          {systemStatusItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Icon size={15} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.val}
                  </div>
                </div>
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--status-success)',
                    boxShadow: '0 0 6px var(--status-success)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* DEVELOPER ACTIVITY METRICS */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', marginBottom: '10px' }}>
          Developer Activity & Telemetry
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '12px' }}>Total Analyses</span>
              <Activity size={14} color="var(--accent-primary)" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              {stats.totalAnalyses}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Across all 9 tools</div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '12px' }}>Bugs Fixed</span>
              <Bug size={14} color="#10B981" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#10B981', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              {stats.bugsFixed}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Patches generated</div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '12px' }}>Tests Generated</span>
              <FlaskConical size={14} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#38BDF8', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              {stats.testsGenerated}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Unit assertions</div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '12px' }}>Vulnerabilities</span>
              <ShieldAlert size={14} color="#F87171" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#F87171', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              {stats.vulnerabilitiesFound}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>OWASP issues caught</div>
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '12px' }}>Optimizations</span>
              <Zap size={14} color="#FBBF24" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#FBBF24', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              {stats.optimizationsApplied}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Refactors proposed</div>
          </div>
        </div>
      </div>

      {/* DEMO / WORKFLOW RUNNER CARD */}
      {demoStep !== null && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            boxShadow: '0 0 24px rgba(0, 229, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 8px var(--accent-primary)',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Live Hackathon Demo Flow: "Incident → Insight → Fix"
              </span>
            </div>
            <button
              onClick={handleResetDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '11.5px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
            }}
          >
            {[
              { s: 1, title: '1. Error Detected', text: 'TypeError: Cannot read properties of undefined' },
              { s: 2, title: '2. Root Cause Found', text: 'Unchecked profile.avatar nested access' },
              { s: 3, title: '3. Fix Generated', text: 'data?.profile?.avatar?.url ?? default' },
              { s: 4, title: '4. Test Generated', text: '5 Vitest cases passing (100% branch)' },
              { s: 5, title: '5. Security Check', text: 'Zero OWASP injection flaws found' },
              { s: 6, title: '6. Sent to iQOO', text: 'Hotfix pushed to phone & laptop' },
            ].map((st) => {
              const isPast = demoStep >= st.s;
              const isCurrent = demoStep === st.s;
              return (
                <div
                  key={st.s}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCurrent
                      ? 'rgba(0, 229, 255, 0.12)'
                      : isPast
                      ? 'var(--bg-surface-raised)'
                      : 'var(--bg-app)',
                    border: isCurrent
                      ? '1px solid var(--accent-primary)'
                      : isPast
                      ? '1px solid var(--border-medium)'
                      : '1px solid var(--border-subtle)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: isPast ? 'var(--accent-primary)' : 'var(--text-dim)' }}>
                    {isPast ? <CheckCircle2 size={12} color="var(--accent-primary)" /> : <span>○</span>}
                    <span>{st.title}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: isPast ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '4px' }}>
                    {st.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID: TOOLS & WORKFLOW (COL 1) / PHONE STATUS & EVENT FEED (COL 2) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        {/* Column 1: Incident Workflow & Quick Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Incident -> Insight -> Fix Visualizer */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', marginBottom: '12px' }}>
              Developer Workflow: Incident → Insight → Fix
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {workflowSteps.map((wf, idx) => (
                <React.Fragment key={wf.num}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      padding: '8px 10px',
                      background: 'var(--bg-app)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      minWidth: '120px',
                      flex: 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'rgba(0, 229, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        {wf.num}
                      </span>
                      <span>{wf.title}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{wf.desc}</div>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <ChevronRight size={13} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Quick Action Tools */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.8px', marginBottom: '10px' }}>
              Quick Action Tools
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '10px',
              }}
            >
              {quickTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.background = 'var(--bg-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-surface)';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{tool.name}</span>
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-dim)',
                            background: 'var(--bg-app)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                          }}
                        >
                          {tool.shortcut}
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Phone Status & Real-Time Event Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* iQOO Phone Status Card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={15} color="var(--accent-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>iQOO Device Status</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--status-success)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }} />
                <span>Connected</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Hardware</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>iQOO 12 / Neo9 Pro</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Battery & Temp</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>86% • 31.8°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>UltraLink Sync</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>1.9 ms latency</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>On-Device NPU</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Qwen-Coder 4-bit</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTool('sentinel')}
              style={{
                marginTop: '14px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>Launch Phone Cockpit</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Real-Time Cross-Device Event Stream */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="var(--accent-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Device Link Stream
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                WORKSTATION ↔ PHONE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
              {eventLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '10.5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, color: log.source === 'phone' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                      {log.source.toUpperCase()}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: '1.3' }}>{log.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ANALYSIS HISTORY */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={15} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Recent Developer Operations
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({history.length} saved)</span>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              style={{
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Clear Local History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No analyses recorded yet. Run any tool to record sessions in local persistence.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectTool(item.toolId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface-raised)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-app)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      background: 'rgba(0, 229, 255, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.toolName}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.summary}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <ArrowRight size={13} color="var(--text-dim)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
