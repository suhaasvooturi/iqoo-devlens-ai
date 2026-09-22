import React, { useState } from 'react';
import { runDebugger, TOOL_SAMPLES, type DebuggerOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { Bug, Copy, Check, Sparkles, FileDiff } from 'lucide-react';

export const DebuggerTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.debugger.code);
  const [errorLog, setErrorLog] = useState(TOOL_SAMPLES.debugger.error);
  const [result, setResult] = useState<DebuggerOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const output = runDebugger(code, errorLog);
      setResult(output);
      setIsAnalyzing(false);

      addHistoryItem({
        toolId: 'debugger',
        toolName: 'AI Debugger',
        language: 'TypeScript',
        summary: `Fixed: ${output.rootCause.slice(0, 60)}...`,
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const handleCopyFixed = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bug size={16} color="#EF4444" />
            <span>AI Debugger</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Paste defective code and stack trace to pinpoint root cause and synthesize verified git diff patch.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setCode(TOOL_SAMPLES.debugger.code);
              setErrorLog(TOOL_SAMPLES.debugger.error);
            }}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample Error
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isAnalyzing ? 'Analyzing AST...' : 'Diagnose & Generate Fix'}</span>
          </button>
        </div>
      </div>

      {/* Dual Input: Code Editor + Error Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Source Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Terminal Error / Stack Trace
          </label>
          <textarea
            value={errorLog}
            onChange={(e) => setErrorLog(e.target.value)}
            rows={10}
            placeholder="Paste console error, TypeError, panic, or unhandled rejection..."
            style={{
              width: '100%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              color: '#F87171',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Diagnosis & Git Patch Output */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {/* Root Cause Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
              Root Cause Identified (Line {result.culpritLine})
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {result.rootCause}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
              💡 <strong>Remediation:</strong> {result.explanation}
            </div>
          </div>

          {/* Unified Diff & Fixed Code */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                <FileDiff size={14} color="var(--accent-primary)" />
                <span>Unified Patch & Fixed Implementation</span>
              </div>
              <button onClick={handleCopyFixed} className="action-btn" style={{ fontSize: '11px', padding: '3px 10px' }}>
                {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Fixed Code'}</span>
              </button>
            </div>

            <div className="diff-container">
              {result.gitDiff.split('\n').map((line, i) => {
                const isAdd = line.startsWith('+') && !line.startsWith('+++');
                const isDel = line.startsWith('-') && !line.startsWith('---');
                return (
                  <div key={i} className={`diff-line ${isAdd ? 'diff-add' : isDel ? 'diff-del' : 'diff-context'}`}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
