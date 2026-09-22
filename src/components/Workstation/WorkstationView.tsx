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
      `process exited with code 1`,
      `office-kit-bridge: broadcasted failure to mobile companion (<2.4ms)`,
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
        `To github.com:suhaasvooturi/iqoo-devlens-ai.git`,
        `   e82a10c..${deployedResult.commitHash}  ${deployedResult.branch} -> ${deployedResult.branch}`,
        `$ ${incident.testSuite.name}`,
        `PASS ${incident.culpritFile}`,
        `✅ All ${incident.testSuite.totalTests} checks passing (0 regressions)`,
        `Deployment complete.`,
      ];

      deployLogs.forEach((log, index) => {
        setTimeout(() => {
          setTerminalLogs((prev) => [...prev, log]);
        }, index * 100);
      });
    }
  }, [isDeployed, deployedResult, incident]);

  const activeCode = isDeployed ? incident.fixedCode : incident.originalCode;
  const codeLines = activeCode.split('\n');

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
            <span style={{ color: isDeployed ? 'var(--status-success)' : 'var(--accent-primary)' }}>
              {incident.devContext?.activeBranch || 'main'} {isDeployed ? `(${deployedResult?.commitHash})` : '• uncommitted changes'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onResetIncident}
              className="action-btn"
              style={{ fontSize: '11px', padding: '2px 8px' }}
              title="Reset state"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Multi-Pane Layout */}
        <div className="workstation-grid">
          {/* File Tree Pane */}
          <div className="file-tree-pane">
            <div className="tree-header">Explorer</div>
            <div className="tree-item">
              <Folder size={13} color="var(--accent-primary)" />
              <span>src/</span>
            </div>
            <div className="tree-item" style={{ paddingLeft: '18px' }}>
              <Folder size={13} color="var(--text-muted)" />
              <span>components/</span>
            </div>
            <div
              className={`tree-item ${!isDeployed ? 'culprit' : ''}`}
              style={{ paddingLeft: '28px' }}
            >
              <FileCode size={13} />
              <span>{incident.culpritFile.split('/').pop()}</span>
              {!isDeployed && <AlertCircle size={11} color="var(--status-error)" />}
            </div>
            <div className="tree-item" style={{ paddingLeft: '28px' }}>
              <FileCode size={13} />
              <span>Navbar.test.tsx</span>
            </div>
            <div className="tree-item" style={{ paddingLeft: '18px' }}>
              <Folder size={13} color="var(--text-muted)" />
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
                <FileCode size={13} color={isDeployed ? 'var(--status-success)' : 'var(--accent-primary)'} />
                <span>{incident.culpritFile.split('/').pop()}</span>
                {isDeployed && (
                  <span style={{ fontSize: '10px', color: 'var(--status-success)', fontWeight: 600 }}>
                    [MODIFIED & PASSED]
                  </span>
                )}
              </div>
            </div>

            {/* Code Editor with Line Numbers */}
            <div className="code-editor-section">
              {isDeployed ? (
                <div style={{ marginBottom: '10px', padding: '6px 10px', background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-sm)', color: 'var(--status-success)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} />
                  <span>Patch merged cleanly from mobile companion. All checks passing.</span>
                </div>
              ) : (
                <div style={{ marginBottom: '10px', padding: '6px 10px', background: 'var(--status-error-bg)', border: '1px solid var(--status-error-border)', borderRadius: 'var(--radius-sm)', color: '#F87171', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={13} />
                  <span>Exception at line {incident.culpritLine}. Stack trace transmitted to iQOO phone companion.</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ userSelect: 'none', color: 'var(--text-dim)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {codeLines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre style={{ margin: 0, overflowX: 'auto', flex: 1 }}>
                  <code>{activeCode}</code>
                </pre>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="terminal-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                <TerminalIcon size={12} />
                <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Terminal — zsh
                </span>
              </div>

              {terminalLogs.map((line, idx) => {
                const isErr = line.includes('FAIL') || line.includes('Error') || line.includes('Traceback') || line.includes('code 1');
                const isSuccess = line.includes('PASS') || line.includes('passing') || line.includes('complete');
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
