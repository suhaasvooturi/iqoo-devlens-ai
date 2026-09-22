import React, { useState } from 'react';
import { Camera, Check, RefreshCw } from 'lucide-react';
import type { Incident } from '../../types';

interface CameraScannerProps {
  incident: Incident;
  onScanComplete?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ incident, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      if (onScanComplete) onScanComplete();
    }, 900);
  };

  return (
    <div className="camera-scanner-card">
      <div className="viewfinder-box">
        {/* Subtle, real camera focus reticle */}
        <div className="hud-overlay" />

        {/* Clean terminal text in viewfinder */}
        <div className="hud-terminal-preview">
          <div style={{ color: 'var(--text-muted)' }}>$ {incident.testSuite.name}</div>
          <div style={{ color: '#F87171', fontWeight: 600, marginTop: '4px' }}>
            {incident.errorType}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            at {incident.culpritFile}:{incident.culpritLine}
          </div>
        </div>

        {/* Detected file locus card */}
        <div className="ocr-detected-box">
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {incident.culpritFile.split('/').pop()}:{incident.culpritLine}
          </span>
          <span style={{ color: 'var(--status-success)', fontSize: '10.5px', fontWeight: 600 }}>
            99.4% OCR Confidence
          </span>
        </div>
      </div>

      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="scan-trigger-btn"
          onClick={handleTriggerScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCw size={13} className="spin" />
              <span>Analyzing Screen Capture...</span>
            </>
          ) : scanSuccess ? (
            <>
              <Check size={14} color="#10B981" />
              <span>Stack Frame Extracted</span>
            </>
          ) : (
            <>
              <Camera size={14} />
              <span>Capture & Scan Monitor</span>
            </>
          )}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '0 4px' }}>
          <span>Align terminal or monitor inside frame</span>
          <span>Auto-OCR</span>
        </div>
      </div>
    </div>
  );
};
