import React, { useState } from 'react';
import type { Incident } from '../types';
import { INCIDENT_PRESETS } from '../data/incidentPresets';
import { parseCustomErrorLog } from '../services/aiDiagnosticEngine';
import { Plus, Sparkles, FileCode, Flame } from 'lucide-react';

interface IncidentPickerProps {
  currentIncident: Incident;
  onSelectIncident: (inc: Incident) => void;
}

export const IncidentPicker: React.FC<IncidentPickerProps> = ({
  currentIncident,
  onSelectIncident,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customErrorInput, setCustomErrorInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customErrorInput.trim()) return;
    const parsed = parseCustomErrorLog(customErrorInput);
    onSelectIncident(parsed);
    setIsCustomOpen(false);
    setCustomErrorInput('');
  };

  return (
    <div className="incident-bar">
      <div className="incident-bar-title">
        <Flame size={16} color="var(--iqoo-orange)" />
        <span>Failure Presets & Telemetry Ingestion:</span>
      </div>

      <div className="presets-container">
        {INCIDENT_PRESETS.map((preset) => {
          const isActive = preset.id === currentIncident.id;
          return (
            <button
              key={preset.id}
              className={`preset-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectIncident(preset)}
            >
              <FileCode size={13} />
              <span>{preset.framework.split('/')[0].trim()}</span>
              <span style={{ opacity: 0.6, fontSize: '11px' }}>
                ({preset.category.split('/')[0].trim()})
              </span>
            </button>
          );
        })}

        <button
          className="preset-chip"
          style={{ borderStyle: 'dashed', borderColor: 'var(--border-light)' }}
          onClick={() => setIsCustomOpen(!isCustomOpen)}
        >
          <Plus size={13} />
          <span>Paste Custom Error</span>
        </button>
      </div>

      {isCustomOpen && (
        <div style={{ width: '100%', marginTop: '10px', animation: 'pulseGlow 0.3s' }}>
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              rows={3}
              placeholder="Paste terminal stack trace, compiler panic, or runtime exception here..."
              value={customErrorInput}
              onChange={(e) => setCustomErrorInput(e.target.value)}
              style={{
                width: '100%',
                background: '#07090F',
                border: '1px solid var(--border-orange)',
                borderRadius: '8px',
                padding: '10px',
                color: '#E2E8F0',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="action-btn"
                onClick={() => setIsCustomOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="scan-trigger-btn"
                style={{ padding: '6px 16px', fontSize: '11px' }}
              >
                <Sparkles size={13} />
                Ingest & Diagnose
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
