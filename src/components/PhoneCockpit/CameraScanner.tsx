import React, { useState } from 'react';
import { Scan, CheckCircle2, RefreshCw } from 'lucide-react';
import type { Incident } from '../../types';

interface CameraScannerProps {
  incident: Incident;
  onScanComplete?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ incident, onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [detectedConfidence, setDetectedConfidence] = useState(99.4);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanSuccess(false);

    // Simulate laser OCR capture
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      setDetectedConfidence(+(98.5 + Math.random() * 1.4).toFixed(1));
      if (onScanComplete) onScanComplete();
    }, 1200);
  };

  return (
    <div className="camera-scanner-card">
      <div className="viewfinder-box">
        {/* HUD Targeting Overlay */}
        <div className="hud-overlay">
          <div className="hud-corner corner-tl" />
          <div className="hud-corner corner-tr" />
          <div className="hud-corner corner-bl" />
          <div className="hud-corner corner-br" />
        </div>

        {/* Animated Laser Scanning Line */}
        <div className="laser-scanner-line" />

        {/* Simulated Monitor Terminal Screen through viewfinder */}
        <div className="hud-terminal-preview">
          <div>$ {incident.testSuite.name}</div>
          <div style={{ color: '#FF5577', fontWeight: 600 }}>{incident.errorType}</div>
          <div>at {incident.culpritFile}:{incident.culpritLine}</div>
          <div style={{ opacity: 0.4 }}>... 14 stack frames omitted ...</div>
        </div>

        {/* OCR Detected Bounding Box */}
        <div
          className="ocr-detected-box"
          style={{ top: '48%', left: '16%', right: '16%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>TARGET LOCUS: {incident.culpritFile.split('/').pop()}:{incident.culpritLine}</span>
            <span style={{ color: 'var(--cyber-cyan)' }}>{detectedConfidence}% OCR</span>
          </div>
        </div>
      </div>

      <div className="scanner-actions">
        <button
          className="scan-trigger-btn"
          onClick={handleTriggerScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCw size={14} className="spin" />
              <span>Scanning Viewfinder...</span>
            </>
          ) : scanSuccess ? (
            <>
              <CheckCircle2 size={14} color="#00F59B" />
              <span>Stack Frame Locked!</span>
            </>
          ) : (
            <>
              <Scan size={14} />
              <span>Capture & OCR Monitor</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
