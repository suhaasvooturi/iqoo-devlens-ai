import React, { useState } from 'react';
import type { Incident, HotfixCommitResult } from '../../types';
import { CheckCircle, GitCommit, Play, FileDiff } from 'lucide-react';
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
    }, 1100);
  };

  const handleDeploy = () => {
    // Generate a realistic git commit hash
    const randomHex = Math.random().toString(16).substring(2, 9);
    const result: HotfixCommitResult = {
      commitHash: randomHex,
      branch: 'main',
      message: `fix(${incident.category.toLowerCase().split('/')[0].trim()}): resolve ${incident.errorType.slice(0, 32)} [DevLens AI]`,
      appliedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      filesChanged: 1,
      insertions: 5,
      deletions: 2,
    };

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF5500', '#00E5FF', '#00F59B'],
      });
    } catch {
      // safe fallback
    }

    onDeployHotfix(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Diff Header & Tab Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#FFFFFF' }}>
          <FileDiff size={13} color="var(--iqoo-orange)" />
          <span>Synthesized Git Patch</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveDiffTab('unified')}
            style={{
              background: activeDiffTab === 'unified' ? 'var(--bg-card-secondary)' : 'transparent',
              border: '1px solid',
              borderColor: activeDiffTab === 'unified' ? 'var(--border-light)' : 'transparent',
              color: activeDiffTab === 'unified' ? '#FFFFFF' : '#94A3B8',
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Unified Diff
          </button>
          <button
            onClick={() => setActiveDiffTab('fixed')}
            style={{
              background: activeDiffTab === 'fixed' ? 'var(--bg-card-secondary)' : 'transparent',
              border: '1px solid',
              borderColor: activeDiffTab === 'fixed' ? 'var(--border-light)' : 'transparent',
              color: activeDiffTab === 'fixed' ? '#FFFFFF' : '#94A3B8',
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Fixed Code
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
          <pre style={{ padding: '10px', color: '#CBD5E1', fontSize: '10px', overflowX: 'auto' }}>
            <code>{incident.fixedCode}</code>
          </pre>
        )}
      </div>

      {/* Test Verification Sandbox */}
      <div className="test-sandbox">
        <div className="test-summary-row">
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0' }}>
            Automated Test Sandbox
          </span>
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: testState === 'passed' ? 'var(--status-success)' : 'var(--status-critical)',
              fontWeight: 700,
            }}
          >
            {testState === 'passed'
              ? `✅ ${incident.testSuite.totalTests}/${incident.testSuite.totalTests} PASSED`
              : `❌ ${incident.testSuite.passedBefore}/${incident.testSuite.totalTests} PASSED`}
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
          <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
            {testState === 'passed' ? 'Regression proof verified' : incident.testSuite.failingTestName.slice(0, 32) + '...'}
          </span>

          {testState !== 'passed' && (
            <button
              onClick={handleRunTests}
              disabled={testState === 'running'}
              className="action-btn"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              <Play size={10} />
              <span>{testState === 'running' ? 'Verifying...' : 'Run Verification'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 1-Tap Deploy Hotfix Trigger */}
      <button
        className={`deploy-hotfix-btn ${isDeployed ? 'deployed' : ''}`}
        onClick={handleDeploy}
      >
        {isDeployed ? (
          <>
            <CheckCircle size={16} />
            <span>Hotfix Pushed to Main ({deployedResult?.commitHash})</span>
          </>
        ) : (
          <>
            <GitCommit size={16} />
            <span>Apply Hotfix & Push to Git</span>
          </>
        )}
      </button>
    </div>
  );
};
