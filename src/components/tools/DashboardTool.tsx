import React from 'react';
import type { DevToolId, DashboardStats, AnalysisHistoryItem } from '../../types';
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
  AlertTriangle,
  History,
  Activity,
} from 'lucide-react';

interface DashboardToolProps {
  stats: DashboardStats;
  history: AnalysisHistoryItem[];
  onSelectTool: (id: DevToolId) => void;
  onClearHistory: () => void;
}

export const DashboardTool: React.FC<DashboardToolProps> = ({
  stats,
  history,
  onSelectTool,
  onClearHistory,
}) => {
  const toolsList = [
    { id: 'debugger' as DevToolId, name: 'AI Debugger', desc: 'Paste code + error → Root cause & git patch fix', icon: Bug, color: '#EF4444' },
    { id: 'explainer' as DevToolId, name: 'Code Explainer', desc: 'Break down complex logic & algorithms simply', icon: Code2, color: '#3B82F6' },
    { id: 'optimizer' as DevToolId, name: 'Code Optimizer', desc: 'Identify bottlenecks & reduce CPU/memory footprint', icon: Zap, color: '#F59E0B' },
    { id: 'testgen' as DevToolId, name: 'Test Generator', desc: 'Generate complete unit test suites with edge cases', icon: FlaskConical, color: '#10B981' },
    { id: 'security' as DevToolId, name: 'Security Scanner', desc: 'Scan for OWASP Top 10 vulnerabilities & sanitization', icon: ShieldAlert, color: '#EC4899' },
    { id: 'complexity' as DevToolId, name: 'Complexity Analyzer', desc: 'Calculate Big-O time and space complexity curves', icon: BarChart3, color: '#8B5CF6' },
    { id: 'docgen' as DevToolId, name: 'Documentation Generator', desc: 'Generate typed JSDoc, Python docstrings & README', icon: FileText, color: '#06B6D4' },
    { id: 'converter' as DevToolId, name: 'Code Converter', desc: 'Translate code between Python, TS, Java, C++, Go', icon: Repeat, color: '#F97316' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(59, 130, 246, 0.04))',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>DevPilot Command Center</span>
            <span style={{ fontSize: '11px', background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-primary-border)' }}>
              9 Tools Active
            </span>
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            All-in-one developer productivity studio for debugging, explaining, optimizing, and securing your code.
          </p>
        </div>

        <button
          className="scan-trigger-btn"
          style={{ width: 'auto', padding: '8px 16px' }}
          onClick={() => onSelectTool('debugger')}
        >
          <Bug size={14} />
          <span>Launch AI Debugger</span>
        </button>
      </div>

      {/* 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11.5px', marginBottom: '8px' }}>
            <span>Total Analyses Run</span>
            <Activity size={14} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.totalAnalyses}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>All tools combined</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11.5px', marginBottom: '8px' }}>
            <span>Bugs & Panics Fixed</span>
            <Bug size={14} color="#EF4444" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.bugsFixed}</div>
          <div style={{ fontSize: '11px', color: 'var(--status-success)', marginTop: '4px' }}>100% verified patches</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11.5px', marginBottom: '8px' }}>
            <span>Vulnerabilities Caught</span>
            <ShieldAlert size={14} color="#EC4899" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.vulnerabilitiesFound}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>OWASP Top 10 safeguarded</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11.5px', marginBottom: '8px' }}>
            <span>Tests & Docs Generated</span>
            <FlaskConical size={14} color="#10B981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.testsGenerated}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Unit & integration cases</div>
        </div>
      </div>

      {/* Quick Tool Launchers Grid */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Developer Tools Suite
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {toolsList.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.background = 'var(--bg-surface-raised)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'var(--bg-app)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
                      <Icon size={16} color={t.color} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                  </div>
                  <ArrowRight size={13} color="var(--text-muted)" />
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {t.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <History size={14} color="var(--accent-primary)" />
            <span>Recent Analysis History</span>
          </div>

          {history.length > 0 && (
            <button onClick={onClearHistory} className="action-btn" style={{ fontSize: '11px', padding: '2px 8px' }}>
              Clear Log
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No recent analyses yet. Select any tool above to run an analysis!
            </div>
          ) : (
            history.slice(0, 8).map((h) => (
              <div
                key={h.id}
                onClick={() => onSelectTool(h.toolId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  {h.status === 'success' ? (
                    <CheckCircle2 size={14} color="var(--status-success)" />
                  ) : (
                    <AlertTriangle size={14} color="var(--status-warning)" />
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {h.toolName}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.summary}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span style={{ background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
                    {h.language}
                  </span>
                  <span style={{ whiteSpace: 'nowrap' }}>{h.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
