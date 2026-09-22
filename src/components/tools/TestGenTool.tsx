import React, { useState } from 'react';
import { runTestGenerator, TOOL_SAMPLES, type TestGenOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { FlaskConical, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';

export const TestGenTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.testgen.code);
  const [framework, setFramework] = useState('Jest / Vitest');
  const [result, setResult] = useState<TestGenOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const output = runTestGenerator(code, framework);
      setResult(output);
      setIsGenerating(false);

      addHistoryItem({
        toolId: 'testgen',
        toolName: 'Test Generator',
        language: framework,
        summary: `Created ${output.testCasesCount} test cases covering edge conditions`,
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.testCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FlaskConical size={16} color="#10B981" />
            <span>Test Generator</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Automatically synthesize unit tests, boundary conditions, edge cases, and mocking fixtures.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '5px 8px',
              fontSize: '11px',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          >
            <option>Jest / Vitest</option>
            <option>Pytest</option>
            <option>JUnit 5</option>
            <option>Go test</option>
            <option>Cargo test (Rust)</option>
          </select>

          <button
            onClick={() => setCode(TOOL_SAMPLES.testgen.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isGenerating ? 'Generating Tests...' : 'Generate Tests'}</span>
          </button>
        </div>
      </div>

      {/* Code Input */}
      <div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={9}
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
          }}
        />
      </div>

      {/* Output */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Covered Scenarios */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--status-success)" />
              <span>Coverage Scenarios ({result.testCasesCount} specs)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '6px' }}>
              {result.coveredScenarios.map((s, i) => (
                <div key={i} style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--status-success)' }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Test Code Output */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Generated Test Suite ({result.framework})</span>
              <button onClick={handleCopy} className="action-btn" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Test Suite'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, padding: '12px', background: '#0D0D11', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-primary)', overflowX: 'auto', lineHeight: 1.6 }}>
              <code>{result.testCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
