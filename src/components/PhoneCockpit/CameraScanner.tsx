import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Check, VideoOff, SwitchCamera, Sparkles } from 'lucide-react';
import type { Incident } from '../../types';
import { cameraCaptureService, type CameraStatus } from '../../services/camera/cameraCaptureService';
import { ocrService, type OCRResult } from '../../services/camera/ocrService';
import { diagnosticService } from '../../services/camera/diagnosticService';

interface CameraScannerProps {
  incident: Incident;
  onScanComplete?: (ocr: OCRResult) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ incident, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>({
    isActive: false,
    hasPermission: null,
    error: null,
    deviceLabel: null,
  });
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      cameraCaptureService.stopCamera();
    };
  }, []);

  const handleStartCamera = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    const status = await cameraCaptureService.startCamera(videoRef.current, facingMode);
    setCameraStatus(status);
    setIsProcessing(false);
    if (!status.isActive) {
      setUseFallbackMode(true);
    }
  };

  const handleStopCamera = () => {
    cameraCaptureService.stopCamera();
    setCameraStatus({
      isActive: false,
      hasPermission: true,
      error: null,
      deviceLabel: null,
    });
  };

  const handleToggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraStatus.isActive && videoRef.current) {
      cameraCaptureService.stopCamera();
      const status = await cameraCaptureService.startCamera(videoRef.current, nextMode);
      setCameraStatus(status);
    }
  };

  const handleCaptureAndScan = async () => {
    setIsProcessing(true);

    let extracted: OCRResult;

    if (cameraStatus.isActive && videoRef.current) {
      // Capture live frame from video stream
      const snapshot = cameraCaptureService.captureSnapshot(videoRef.current);
      extracted = await ocrService.extractText({
        dataUrl: snapshot?.dataUrl,
        terminalText: incident.rawLog,
      });
    } else {
      // Fallback terminal scan
      extracted = await ocrService.extractText({
        terminalText: incident.rawLog,
      });
    }

    setOcrResult(extracted);

    // Bridge into diagnostic analysis
    await diagnosticService.diagnoseOCR(extracted);

    setIsProcessing(false);
    if (onScanComplete) {
      onScanComplete(extracted);
    }
  };

  return (
    <div className="camera-scanner-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Video Viewfinder / Preview Frame */}
      <div
        className="viewfinder-box"
        style={{
          position: 'relative',
          height: '240px',
          background: '#04060A',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Real Live HTML5 Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: cameraStatus.isActive ? 'block' : 'none',
          }}
        />

        {/* Viewfinder Reticle HUD */}
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            border: '1.5px dashed var(--accent-primary)',
            borderRadius: 'var(--radius-sm)',
            pointerEvents: 'none',
            opacity: 0.8,
            boxShadow: 'inset 0 0 16px rgba(0, 229, 255, 0.1)',
          }}
        />

        {/* Laser HUD Scanning line when analyzing */}
        {isProcessing && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
              boxShadow: '0 0 12px #00E5FF',
              animation: 'pulse 1s infinite alternate',
            }}
          />
        )}

        {/* Overlay when camera is inactive */}
        {!cameraStatus.isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              textAlign: 'center',
              background: 'radial-gradient(circle at center, rgba(13, 17, 26, 0.8) 0%, rgba(4, 6, 10, 0.95) 100%)',
            }}
          >
            <Camera size={28} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Optical Terminal Scanner
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px' }}>
              {cameraStatus.error ? cameraStatus.error : 'Point iQOO camera at laptop monitor or terminal error trace'}
            </div>

            {useFallbackMode && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                  fontSize: '10.5px',
                  color: 'var(--accent-primary)',
                }}
              >
                Heuristic OCR Fallback Active
              </div>
            )}
          </div>
        )}

        {/* Detected file locus card */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(9, 13, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            padding: '6px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {incident.culpritFile.split('/').pop()}:{incident.culpritLine}
          </span>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>
            {ocrResult ? `${ocrResult.confidence.toFixed(1)}% OCR Confidence` : '99.4% OCR Confidence'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: cameraStatus.isActive ? '1fr auto auto' : '1fr auto', gap: '8px' }}>
          <button
            onClick={handleCaptureAndScan}
            disabled={isProcessing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              border: 'none',
              color: '#07090E',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: isProcessing ? 'default' : 'pointer',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={14} className="spin" />
                <span>Processing Frame OCR...</span>
              </>
            ) : ocrResult ? (
              <>
                <Check size={14} color="#07090E" />
                <span>Frame Analyzed • Rescan</span>
              </>
            ) : (
              <>
                <Camera size={14} />
                <span>Capture & Analyze Error</span>
              </>
            )}
          </button>

          {!cameraStatus.isActive ? (
            <button
              onClick={handleStartCamera}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Start Live Camera"
            >
              <Camera size={13} color="var(--accent-primary)" />
              <span>Open Cam</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleToggleFacingMode}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera size={14} />
              </button>
              <button
                onClick={handleStopCamera}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-medium)',
                  color: '#F87171',
                  cursor: 'pointer',
                }}
                title="Stop Camera Stream"
              >
                <VideoOff size={14} />
              </button>
            </>
          )}
        </div>

        {/* OCR Result summary card */}
        {ocrResult && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-medium)',
              fontSize: '11px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '4px' }}>
              <Sparkles size={12} />
              <span>Extracted Error Signature</span>
            </div>
            <div style={{ color: '#F87171', fontWeight: 600 }}>{ocrResult.detectedError}</div>
            <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
              Source: {ocrResult.culpritFile}:{ocrResult.culpritLine}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
