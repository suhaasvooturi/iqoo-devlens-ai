import React, { useState } from 'react';
import type { Incident } from '../../types';
import { CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';

interface VisualPreviewProps {
  incident: Incident;
  isDeployed: boolean;
}

export const VisualPreview: React.FC<VisualPreviewProps> = ({ incident, isDeployed }) => {
  const [activeState, setActiveState] = useState<'before' | 'after'>(isDeployed ? 'after' : 'before');

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Visual Preview Header */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--bg-surface-raised)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={14} color="var(--text-secondary)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            App Simulation
          </span>
        </div>

        {/* Before / After Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
          <button
            onClick={() => setActiveState('before')}
            style={{
              background: activeState === 'before' ? 'var(--status-error-bg)' : 'transparent',
              border: activeState === 'before' ? '1px solid var(--status-error-border)' : '1px solid transparent',
              color: activeState === 'before' ? '#F87171' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Failing UI
          </button>
          <button
            onClick={() => setActiveState('after')}
            style={{
              background: activeState === 'after' ? 'var(--status-success-bg)' : 'transparent',
              border: activeState === 'after' ? '1px solid var(--status-success-border)' : '1px solid transparent',
              color: activeState === 'after' ? 'var(--status-success)' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Fixed UI
          </button>
        </div>
      </div>

      {/* Rendered Mock Viewport */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            background: '#09090B',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {activeState === 'before' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--status-error-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F87171',
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#F87171' }}>
                {incident.visualPreview?.beforeLabel || 'Crash: Uncaught Error'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.4 }}>
                {incident.visualPreview?.brokenStateDescription || incident.rawLog}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--status-success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-success)',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--status-success)' }}>
                {incident.visualPreview?.afterLabel || 'Fixed: Live & Working'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-primary)', maxWidth: '280px', lineHeight: 1.4 }}>
                {incident.visualPreview?.fixedStateDescription || 'Issue resolved cleanly without regression.'}
              </div>
            </div>
          )}
        </div>

        {/* Impact Note */}
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-surface-raised)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Customer Impact:</strong> {incident.impactAnalysis}
        </div>
      </div>
    </div>
  );
};
