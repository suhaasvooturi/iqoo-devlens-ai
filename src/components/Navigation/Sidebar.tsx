import React from 'react';
import type { DevToolId } from '../../types';
import {
  LayoutDashboard,
  Bug,
  Code2,
  Zap,
  FlaskConical,
  ShieldAlert,
  BarChart3,
  FileText,
  Repeat,
  Smartphone,
} from 'lucide-react';

interface SidebarProps {
  activeTool: DevToolId;
  onSelectTool: (toolId: DevToolId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const navItems: Array<{ id: DevToolId; label: string; icon: React.FC<{ size: number; color?: string }>; shortcut: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
    { id: 'debugger', label: 'AI Debugger', icon: Bug, shortcut: '2' },
    { id: 'explainer', label: 'Code Explainer', icon: Code2, shortcut: '3' },
    { id: 'optimizer', label: 'Code Optimizer', icon: Zap, shortcut: '4' },
    { id: 'testgen', label: 'Test Generator', icon: FlaskConical, shortcut: '5' },
    { id: 'security', label: 'Security Scanner', icon: ShieldAlert, shortcut: '6' },
    { id: 'complexity', label: 'Complexity', icon: BarChart3, shortcut: '7' },
    { id: 'docgen', label: 'Doc Generator', icon: FileText, shortcut: '8' },
    { id: 'converter', label: 'Code Converter', icon: Repeat, shortcut: '9' },
    { id: 'sentinel', label: 'Phone Sentinel', icon: Smartphone, shortcut: '0' },
  ];

  return (
    <aside
      style={{
        width: '240px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 10px',
        gap: '4px',
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-dim)', padding: '4px 10px 8px', letterSpacing: '0.6px' }}>
        AI Developer Toolkit
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTool === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTool(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: isActive ? 'var(--bg-surface-raised)' : 'transparent',
              border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              transition: 'all var(--transition)',
              width: '100%',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'inherit'} />
              <span>{item.label}</span>
            </div>

            <span
              style={{
                fontSize: '9.5px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--bg-app)',
                padding: '1px 5px',
                borderRadius: '3px',
                color: 'var(--text-dim)',
              }}
            >
              {item.shortcut}
            </span>
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ padding: '8px 10px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px' }}>DevPilot Suite</div>
          <div>iQOO Hackathon 2026</div>
        </div>
      </div>
    </aside>
  );
};
