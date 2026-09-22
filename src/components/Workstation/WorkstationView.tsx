import React, { useState, useEffect } from 'react';
import type { Incident, HotfixCommitResult } from '../../types';
import {
  Folder,
  FileCode,
  Terminal as TerminalIcon,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface WorkstationViewProps {
  incident: Incident;
  isDeployed: boolean;
  deployedResult: HotfixCommitResult | null;
  onResetIncident: () => void;
}

export const WorkstationView: React.FC<WorkstationViewProps> = ({
  incident,
  isDeployed,
  deployedResult,
  onResetIncident,
}) => {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Load initial error logs when incident changes
  useEffect(() => {
    setTerminalLogs([
      `$ cd /workspaces/iqoo-project`,
      `$ ${incident.testSuite.name}`,
      `Running test suite for ${incident.framework}...`,
      `[FAIL] ${incident.testSuite.failingTestName}`,
      incident.rawLog,
      `Tests: ${incident.testSuite.failedBefore} failed, ${incident.testSuite.passedBefore} passed, ${incident.testSuite.totalTests} total`,
      `💥 Build pipeline exited with code 1`,
      `devlens-sentinel: incident alert broadcasted to iQOO Office Kit bridge.`,
    ]);
  }, [incident]);

  // When hotfix is deployed from phone, stream git actions in terminal
  useEffect(() => {
    if (isDeployed && deployedResult) {
      const deployLogs = [
        `\n--- [OFFICE KIT BRIDGE INCOMING HOTFIX] ---`,
        `$ git apply --stat devlens-${deployedResult.commitHash}.patch`,
        ` ${incident.culpritFile} | ${deployedResult.insertions} +++++  ${deployedResult.deletions} --`,
        `$ git commit -m "${deployedResult.message}"`,
        `[${deployedResult.branch} ${deployedResult.commitHash}] ${deployedResult.message}`,
        ` ${deployedResult.filesChanged} file changed, ${deployedResult.insertions} insertions(+), ${deployedResult.deletions} deletions(-)`,
        `$ git push origin ${deployedResult.branch}`,
        `To github.com:iqoo-org/devtools.git`,
        `   e82a10c..${deployedResult.commitHash}  ${deployedResult.branch} -> ${deployedResult.branch}`,
        `$ ${incident.testSuite.name}`,
        `PASS ${incident.culpritFile}`,
        `✅ All ${incident.testSuite.totalTests} tests passed in 0.42s. 0 regressions.`,
        `🚀 Hotfix verified and live in production!`,
      ];

      deployLogs.forEach((log, index) => {
        setTimeout(() => {
          setTerminalLogs((prev) => [...prev, log]);
        }, index * 120);
      });
    }
  }, [isDeployed, deployedResult, incident]);

  return (
    <div className="workstation-container">
      <div className="workstation-window">
        {/* Title Bar */}
        <div className="window-titlebar">
          <div className="window-controls">
            <div className="window-dot dot-red" />
            <div className="window-dot dot-yellow" />
            <div className="window-dot dot-green" />
          </div>

          <div className="window-title">
            <span>iqoo-workstation — </span>
            <GitBranch size={12} style={{ display: 'inline', margin: '0 4px' }} />
            <span style={{ color: isDeployed ? 'var(--status-success)' : 'var(--iqoo-orange)' }}>
              main {isDeployed ? `(${deployedResult?.commitHash})` : '• uncommitted changes'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onResetIncident}
              className="action-btn"
              style={{ fontSize: '11px', padding: '3px 8px' }}
              title="Reset incident state"
            >
              <RotateCcw size={11} />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Multi-Pane Layout */}
        <div className="workstation-grid">
          {/* File Tree Pane */}
          <div className="file-tree-pane">
            <div className="tree-header">Repository Files</div>
            <div className="tree-item">
              <Folder size={13} color="var(--iqoo-orange)" />
              <span>src/</span>
            </div>
            <div className="tree-item" style={{ paddingLeft: '18px' }}>
              <Folder size={13} color="#64748B" />
              <span>components/</span>
            </div>
            <div
              className={`tree-item ${!isDeployed ? 'culprit' : ''}`}
              style={{ paddingLeft: '28px' }}
            >
              <FileCode size={13} />
              <span>{incident.culpritFile.split('/').pop()}</span>
              {!isDeployed && <AlertCircle size={11} color="var(--status-critical)" />}
            </div>
            <div className="tree-item" style={{ paddingLeft: '28px' }}>
              <FileCode size={13} />
              <span>Navbar.test.tsx</span>
            </div>
            <div className="tree-item" style={{ paddingLeft: '18px' }}>
              <Folder size={13} color="#64748B" />
              <span>services/</span>
            </div>
            <div className="tree-item" style={{ paddingLeft: '28px' }}>
              <FileCode size={13} />
              <span>api.ts</span>
            </div>
            <div className="tree-item">
              <FileCode size={13} />
              <span>package.json</span>
            </div>
          </div>

          {/* Editor & Terminal Center Pane */}
          <div className="editor-terminal-pane">
            {/* Editor Tab Bar */}
            <div className="editor-tab-bar">
              <div className="editor-tab active">
                <FileCode size={13} color={isDeployed ? 'var(--status-success)' : 'var(--iqoo-orange)'} />
                <span>{incident.culpritFile.split('/').pop()}</span>
                {isDeployed && (
                  <span style={{ fontSize: '9px', color: 'var(--status-success)', fontWeight: 700 }}>
                    [HOTFIXED]
                  </span>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div className="code-editor-section">
              {isDeployed ? (
                <div style={{ marginBottom: '12px', padding: '8px 12px', background: 'rgba(0, 245, 155, 0.1)', border: '1px solid var(--status-success)', borderRadius: '6px', color: '#00F59B', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} />
                  <span>Patch applied successfully via iQOO Office Kit Bridge. Test suite passed cleanly.</span>
                </div>
              ) : (
                <div style={{ marginBottom: '12px', padding: '8px 12px', background: 'rgba(255, 51, 102, 0.1)', border: '1px solid var(--status-critical)', borderRadius: '6px', color: '#FF5577', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={14} />
                  <span>Failure detected at line {incident.culpritLine}. Sentinel broadcasted stack trace to phone.</span>
                </div>
              )}

              <pre style={{ margin: 0 }}>
                <code>{isDeployed ? incident.fixedCode : incident.originalCode}</code>
              </pre>
            </div>

            {/* Live Terminal Output */}
            <div className="terminal-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#64748B' }}>
                <TerminalIcon size={12} />
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Integrated Workstation Terminal (zsh)
                </span>
              </div>

              {terminalLogs.map((line, idx) => {
                const isErr = line.includes('FAIL') || line.includes('Error') || line.includes('Traceback') || line.includes('exit code 1');
                const isSuccess = line.includes('PASS') || line.includes('Hotfix verified') || line.includes('All') || line.includes('Ready');
                const isPrompt = line.startsWith('$');
                return (
                  <div
                    key={idx}
                    className={isErr ? 'terminal-err' : isSuccess ? 'terminal-success' : isPrompt ? 'terminal-prompt' : ''}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
