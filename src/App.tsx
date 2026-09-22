import React, { useState, useEffect } from 'react';
import type { DeviceViewMode, AIModelMode, Incident, HardwareTelemetry, HotfixCommitResult } from './types';
import { INCIDENT_PRESETS } from './data/incidentPresets';
import { Header } from './components/Header';
import { IncidentPicker } from './components/IncidentPicker';
import { OfficeKitSplitView } from './components/OfficeKit/OfficeKitSplitView';
import { PhoneCockpitView } from './components/PhoneCockpit/PhoneCockpitView';
import { WorkstationView } from './components/Workstation/WorkstationView';
import { QRModal } from './components/QRModal';
import { officeKitBridge } from './services/bridgeService';
import './styles/theme.css';
import './styles/components.css';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<DeviceViewMode>('split');
  const [currentIncident, setCurrentIncident] = useState<Incident>(INCIDENT_PRESETS[0]);
  const [modelMode, setModelMode] = useState<AIModelMode>('edge-local');
  const [isDeployed, setIsDeployed] = useState(false);
  const [deployedResult, setDeployedResult] = useState<HotfixCommitResult | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    npuInferenceSpeed: '28.6 tokens/s',
    modelActive: 'Qwen2.5-Coder-1.5B (4-bit NPU)',
    batteryTemp: '32.1°C',
    mode: 'Monster Mode',
    officeKitLatency: '2.4',
    syncStatus: 'SYNCED',
  });

  // Auto-detect mobile screen on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setViewMode('phone');
    }
  }, []);

  // Subscribe to Office Kit Bridge for cross-tab or cross-device real-time sync
  useEffect(() => {
    const unsubscribe = officeKitBridge.subscribe((msg) => {
      if (msg.type === 'INCIDENT_SELECTED') {
        setCurrentIncident(msg.incident);
        setIsDeployed(false);
        setDeployedResult(null);
      } else if (msg.type === 'HOTFIX_DEPLOYED') {
        setIsDeployed(true);
        setDeployedResult(msg.hotfix);
      }
    });
    return unsubscribe;
  }, []);

  // Subtle Web Audio high-tech sound synthesizers
  const playTechAudio = (frequency = 880, type: OscillatorType = 'sine', duration = 0.12) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleSelectIncident = (incident: Incident) => {
    playTechAudio(520, 'triangle', 0.1);
    setCurrentIncident(incident);
    setIsDeployed(false);
    setDeployedResult(null);
    officeKitBridge.send({ type: 'INCIDENT_SELECTED', incident });
  };

  const handleDeployHotfix = (result: HotfixCommitResult) => {
    playTechAudio(960, 'sine', 0.25);
    setIsDeployed(true);
    setDeployedResult(result);
    officeKitBridge.send({
      type: 'HOTFIX_DEPLOYED',
      hotfix: result,
      incidentId: currentIncident.id,
    });
  };

  const handleResetIncident = () => {
    setIsDeployed(false);
    setDeployedResult(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-space)' }}>
      {/* Top Bar with View Mode Switcher and Office Kit Telemetry */}
      <Header
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          playTechAudio(640, 'sine', 0.08);
          setViewMode(mode);
        }}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        latencyMs={telemetry.officeKitLatency}
      />

      <main className="app-container">
        {/* Incident Presets Bar */}
        <IncidentPicker
          currentIncident={currentIncident}
          onSelectIncident={handleSelectIncident}
        />

        {/* Dynamic View Layout */}
        {viewMode === 'split' && (
          <OfficeKitSplitView
            incident={currentIncident}
            telemetry={telemetry}
            modelMode={modelMode}
            onModelModeChange={(mode) => {
              setModelMode(mode);
              setTelemetry((prev) => ({
                ...prev,
                npuInferenceSpeed: mode === 'edge-local' ? '28.6 tokens/s' : '42.1 tokens/s',
              }));
            }}
            onDeployHotfix={handleDeployHotfix}
            isDeployed={isDeployed}
            deployedResult={deployedResult}
            onResetIncident={handleResetIncident}
          />
        )}

        {viewMode === 'phone' && (
          <PhoneCockpitView
            incident={currentIncident}
            telemetry={telemetry}
            modelMode={modelMode}
            onModelModeChange={(mode) => {
              setModelMode(mode);
              setTelemetry((prev) => ({
                ...prev,
                npuInferenceSpeed: mode === 'edge-local' ? '28.6 tokens/s' : '42.1 tokens/s',
              }));
            }}
            onDeployHotfix={handleDeployHotfix}
            isDeployed={isDeployed}
            deployedResult={deployedResult}
          />
        )}

        {viewMode === 'workstation' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <WorkstationView
              incident={currentIncident}
              isDeployed={isDeployed}
              deployedResult={deployedResult}
              onResetIncident={handleResetIncident}
            />
          </div>
        )}
      </main>

      {/* QR Connect Modal */}
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

export default App;
