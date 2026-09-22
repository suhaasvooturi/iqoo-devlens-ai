import React, { useState } from 'react';
import type { Incident, HotfixCommitResult } from '../../types';
import { Check, GitCommit, Play, GitPullRequest, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatchStudioProps {
  incident: Incident;
  onDeployHotfix: (result: HotfixCommitResult) => void;
  isDeployed: boolean;
  deployedResult: HotfixCommitResult | null;
}

export const PatchStudio: React.FC<PatchStudioProps> = ({
  incident,
  onDeployHotfix,
  isDeployed,
  deployedResult,
}) => {
  const [testState, setTestState] = useState<'initial' | 'running' | 'passed'>('initial');
  const [activeDiffTab, setActiveDiffTab] = useState<'unified' | 'fixed'>('unified');

  const handleRunTests = () => {
    setTestState('running');
    setTimeout(() => {
      setTestState('passed');
    }, 800);
  };

  const handleDeploy = () => {
    const randomHex = Math.random().toString(16).substring(2, 9);
    const result: HotfixCommitResult = {
      commitHash: randomHex,
      branch: incident.devContext?.activeBranch || 'main',
      message: `fix(${incident.category.toLowerCase().split('/')[0].trim()}): resolve ${incident.errorType.slice(0, 32)}`,
      appliedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      filesChanged: 1,
      insertions: 5,
      deletions: 2,
    };

    try {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.85 },
      });
    } catch {
      // ignore
    }

    onDeployHotfix(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* GitHub-style PR Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GitPullRequest size={13} color="var(--accent-primary)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Hotfix Patch
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            (+5 -2)
          </span>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
          <button
            onClick={() => setActiveDiffTab('unified')}
            style={{
              background: activeDiffTab === 'unified' ? 'var(--bg-app)' : 'transparent',
              border: activeDiffTab === 'unified' ? '1px solid var(--border-subtle)' : 'none',
              color: activeDiffTab === 'unified' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Diff
          </button>
          <button
            onClick={() => setActiveDiffTab('fixed')}
            style={{
              background: activeDiffTab === 'fixed' ? 'var(--bg-app)' : 'transparent',
              border: activeDiffTab === 'fixed' ? '1px solid var(--border-subtle)' : 'none',
              color: activeDiffTab === 'fixed' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Fixed File
          </button>
        </div>
      </div>

      {/* Code Diff Box */}
      <div className="diff-container">
        {activeDiffTab === 'unified' ? (
          <div>
            {incident.gitDiff.split('\n').map((line, idx) => {
              const isAdd = line.startsWith('+') && !line.startsWith('+++');
              const isDel = line.startsWith('-') && !line.startsWith('---');
              return (
                <div
                  key={idx}
                  className={`diff-line ${isAdd ? 'diff-add' : isDel ? 'diff-del' : 'diff-context'}`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        ) : (
          <pre style={{ padding: '10px', color: 'var(--text-secondary)', fontSize: '11px', overflowX: 'auto' }}>
            <code>{incident.fixedCode}</code>
          </pre>
        )}
      </div>

      {/* GitHub Actions CI Sandbox */}
      <div className="test-sandbox">
        <div className="test-summary-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} color={testState === 'passed' ? 'var(--status-success)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              CI Checks & Test Runner
            </span>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: testState === 'passed' ? 'var(--status-success)' : '#F87171',
              fontWeight: 600,
            }}
          >
            {testState === 'passed'
              ? `All ${incident.testSuite.totalTests} Checks Passed`
              : `${incident.testSuite.failedBefore} Failing Check`}
          </span>
        </div>

        <div className="test-progress-bar">
          <div
            className={`test-progress-fill ${testState === 'passed' ? 'progress-green' : 'progress-red'}`}
            style={{
              width:
                testState === 'passed'
                  ? '100%'
                  : `${(incident.testSuite.passedBefore / incident.testSuite.totalTests) * 100}%`,
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {testState === 'passed' ? 'Ready to merge safely' : incident.testSuite.failingTestName.slice(0, 30) + '...'}
          </span>

          {testState !== 'passed' && (
            <button
              onClick={handleRunTests}
              disabled={testState === 'running'}
              className="action-btn"
              style={{ fontSize: '10.5px', padding: '3px 8px' }}
            >
              <Play size={10} />
              <span>{testState === 'running' ? 'Running CI...' : 'Run CI Checks'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Merge / Deploy Button */}
      <button
        className={`deploy-hotfix-btn ${isDeployed ? 'deployed' : ''}`}
        onClick={handleDeploy}
      >
        {isDeployed ? (
          <>
            <Check size={14} />
            <span>Merged to {deployedResult?.branch} ({deployedResult?.commitHash})</span>
          </>
        ) : (
          <>
            <GitCommit size={14} />
            <span>Approve & Merge Hotfix</span>
          </>
        )}
      </button>
    </div>
  );
};
