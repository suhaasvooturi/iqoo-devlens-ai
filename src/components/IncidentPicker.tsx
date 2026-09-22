import React, { useState } from 'react';
import type { Incident } from '../types';
import { INCIDENT_PRESETS } from '../data/incidentPresets';
import { parseCustomErrorLog } from '../services/aiDiagnosticEngine';
import { Plus, Terminal } from 'lucide-react';

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
        <Terminal size={14} color="var(--text-secondary)" />
        <span>Incidents & Stack Traces:</span>
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
              <span>{preset.framework.split('/')[0].trim()}</span>
              <span style={{ opacity: 0.6, fontSize: '11px' }}>
                · {preset.category.split('/')[0].trim()}
              </span>
            </button>
          );
        })}

        <button
          className="preset-chip"
          style={{ borderStyle: 'dashed' }}
          onClick={() => setIsCustomOpen(!isCustomOpen)}
        >
          <Plus size={12} />
          <span>Custom Trace</span>
        </button>
      </div>

      {isCustomOpen && (
        <div style={{ width: '100%', marginTop: '6px' }}>
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              rows={3}
              placeholder="Paste terminal error, compiler panic, or exception stack trace..."
              value={customErrorInput}
              onChange={(e) => setCustomErrorInput(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-app)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
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
                style={{ width: 'auto', padding: '5px 14px', fontSize: '11.5px' }}
              >
                Parse & Inspect
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
