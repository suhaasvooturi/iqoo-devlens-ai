import React, { useState, useEffect } from 'react';
import type { DeviceViewMode, AIModelMode, Incident, HardwareTelemetry, HotfixCommitResult, DevToolId, DashboardStats, AnalysisHistoryItem } from './types';
import { INCIDENT_PRESETS } from './data/incidentPresets';
import { Header } from './components/Header';
import { Sidebar } from './components/Navigation/Sidebar';
import { DashboardTool } from './components/tools/DashboardTool';
import { DebuggerTool } from './components/tools/DebuggerTool';
import { ExplainerTool } from './components/tools/ExplainerTool';
import { OptimizerTool } from './components/tools/OptimizerTool';
import { TestGenTool } from './components/tools/TestGenTool';
import { SecurityScannerTool } from './components/tools/SecurityScannerTool';
import { ComplexityTool } from './components/tools/ComplexityTool';
import { DocGenTool } from './components/tools/DocGenTool';
import { ConverterTool } from './components/tools/ConverterTool';
import { IncidentPicker } from './components/IncidentPicker';
import { OfficeKitSplitView } from './components/OfficeKit/OfficeKitSplitView';
import { PhoneCockpitView } from './components/PhoneCockpit/PhoneCockpitView';
import { WorkstationView } from './components/Workstation/WorkstationView';
import { QRModal } from './components/QRModal';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { officeKitBridge } from './services/bridgeService';
import { getStats, getHistory, clearHistory } from './services/historyStorage';
import './styles/theme.css';
import './styles/components.css';

export const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<DevToolId>('dashboard');
  const [stats, setStats] = useState<DashboardStats>(getStats());
  const [history, setHistory] = useState<AnalysisHistoryItem[]>(getHistory());
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Phone Sentinel state (for iQOO Hackathon cross-device experience)
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

  // Refresh history and stats periodically or when activeTool changes
  useEffect(() => {
    setStats(getStats());
    setHistory(getHistory());
  }, [activeTool]);

  // Global keyboard shortcuts (Ctrl+K for Command Palette, 1-9 & 0 for Tools)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K Command Palette trigger
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Don't trigger number shortcuts if user is typing in input or textarea
      if (['TEXTAREA', 'INPUT'].includes((e.target as HTMLElement)?.tagName)) return;

      const keyMap: Record<string, DevToolId> = {
        '1': 'dashboard',
        '2': 'debugger',
        '3': 'explainer',
        '4': 'optimizer',
        '5': 'testgen',
        '6': 'security',
        '7': 'complexity',
        '8': 'docgen',
        '9': 'converter',
        '0': 'sentinel',
      };

      if (keyMap[e.key]) {
        setActiveTool(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Office Kit Bridge sync
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

  const handleSelectIncident = (incident: Incident) => {
    setCurrentIncident(incident);
    setIsDeployed(false);
    setDeployedResult(null);
    officeKitBridge.send({ type: 'INCIDENT_SELECTED', incident });
  };

  const handleDeployHotfix = (result: HotfixCommitResult) => {
    setIsDeployed(true);
    setDeployedResult(result);
    officeKitBridge.send({
      type: 'HOTFIX_DEPLOYED',
      hotfix: result,
      incidentId: currentIncident.id,
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleRunHackathonDemo = () => {
    setActiveTool('dashboard');
  };

  // Pure mobile cockpit view when on phone mode
  const isPureMobile = viewMode === 'phone';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        latencyMs={telemetry.officeKitLatency}
      />

      {/* Main Toolkit Shell: Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 56px)' }}>
        {/* Hide desktop sidebar on pure phone mode for dedicated mobile cockpit */}
        {!isPureMobile && <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />}

        <main style={{ flex: 1, padding: isPureMobile ? '12px' : '24px', overflowY: 'auto', maxWidth: isPureMobile ? '480px' : '1400px', margin: '0 auto', width: '100%' }}>
          {isPureMobile ? (
            // Dedicated standalone mobile cockpit
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
          ) : (
            // Desktop Tools Shell
            <>
              {activeTool === 'dashboard' && (
                <DashboardTool
                  stats={stats}
                  history={history}
                  onSelectTool={setActiveTool}
                  onClearHistory={handleClearHistory}
                  onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                />
              )}

              {activeTool === 'debugger' && <DebuggerTool />}
              {activeTool === 'explainer' && <ExplainerTool />}
              {activeTool === 'optimizer' && <OptimizerTool />}
              {activeTool === 'testgen' && <TestGenTool />}
              {activeTool === 'security' && <SecurityScannerTool />}
              {activeTool === 'complexity' && <ComplexityTool />}
              {activeTool === 'docgen' && <DocGenTool />}
              {activeTool === 'converter' && <ConverterTool />}

              {/* DevLens Sentinel: Phone-First Cross-Device View for Hackathon */}
              {activeTool === 'sentinel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <IncidentPicker
                    currentIncident={currentIncident}
                    onSelectIncident={handleSelectIncident}
                  />

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
                      onResetIncident={() => {
                        setIsDeployed(false);
                        setDeployedResult(null);
                      }}
                    />
                  )}

                  {viewMode === 'workstation' && (
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                      <WorkstationView
                        incident={currentIncident}
                        isDeployed={isDeployed}
                        deployedResult={deployedResult}
                        onResetIncident={() => {
                          setIsDeployed(false);
                          setDeployedResult(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Universal Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={setActiveTool}
        onOpenQR={() => setIsQRModalOpen(true)}
        onRunDemo={handleRunHackathonDemo}
        onClearHistory={handleClearHistory}
      />

      {/* QR Connect Modal */}
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};

export default App;
