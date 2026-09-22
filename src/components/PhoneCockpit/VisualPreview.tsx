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
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Visual Preview Header */}
      <div
        style={{
          padding: '12px 14px',
          background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.08), rgba(0, 229, 255, 0.06))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={15} color="var(--cyber-cyan)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>
            Live UX Impact Simulation
          </span>
        </div>

        {/* Before / After Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-card-secondary)', borderRadius: '8px', padding: '2px' }}>
          <button
            onClick={() => setActiveState('before')}
            style={{
              background: activeState === 'before' ? 'rgba(255, 51, 102, 0.2)' : 'transparent',
              border: activeState === 'before' ? '1px solid var(--status-critical)' : 'none',
              color: activeState === 'before' ? '#FF5577' : '#94A3B8',
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Broken UI
          </button>
          <button
            onClick={() => setActiveState('after')}
            style={{
              background: activeState === 'after' ? 'rgba(0, 245, 155, 0.2)' : 'transparent',
              border: activeState === 'after' ? '1px solid var(--status-success)' : 'none',
              color: activeState === 'after' ? '#00F59B' : '#94A3B8',
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Fixed UI
          </button>
        </div>
      </div>

      {/* Rendered Mock Viewport */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            background: '#07090E',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {activeState === 'before' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'pulseGlow 2s infinite' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 51, 102, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-critical)',
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#FF5577' }}>
                {incident.visualPreview?.beforeLabel || 'Crash: Uncaught Error'}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', maxWidth: '280px', lineHeight: 1.4 }}>
                {incident.visualPreview?.brokenStateDescription || incident.rawLog}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0, 245, 155, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-success)',
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00F59B' }}>
                {incident.visualPreview?.afterLabel || 'Fixed: Live & Working'}
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', maxWidth: '280px', lineHeight: 1.4 }}>
                {incident.visualPreview?.fixedStateDescription || 'Issue resolved cleanly without regression.'}
              </div>
            </div>
          )}
        </div>

        {/* Human context explanation */}
        <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.5, background: 'var(--bg-card-secondary)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--iqoo-orange)' }}>
          💡 <strong style={{ color: '#FFF' }}>Why this matters to users:</strong> {incident.impactAnalysis}
        </div>
      </div>
    </div>
  );
};
