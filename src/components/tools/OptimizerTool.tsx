import React, { useState } from 'react';
import { runOptimizer, TOOL_SAMPLES, type OptimizerOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { Zap, Sparkles, Copy, Check, TrendingUp, Cpu, HardDrive } from 'lucide-react';

export const OptimizerTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.optimizer.code);
  const [result, setResult] = useState<OptimizerOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const output = runOptimizer(code);
      setResult(output);
      setIsOptimizing(false);

      addHistoryItem({
        toolId: 'optimizer',
        toolName: 'Code Optimizer',
        language: 'TypeScript',
        summary: `Optimized from ${output.timeComplexityBefore} to ${output.timeComplexityAfter} (${output.speedupPercentage})`,
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#F59E0B" />
            <span>Code Optimizer</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Detect algorithmic bottlenecks, eliminate redundant memory allocations, and accelerate execution throughput.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCode(TOOL_SAMPLES.optimizer.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample Loop
          </button>
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isOptimizing ? 'Profiling & Optimizing...' : 'Optimize Code'}</span>
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

      {/* Output Stats & Code */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Performance Benchmark Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <TrendingUp size={13} color="var(--status-success)" />
                <span>Estimated Speedup</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }}>
                {result.speedupPercentage}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <HardDrive size={13} color="var(--accent-primary)" />
                <span>Memory Allocation</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {result.memorySavings}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <Cpu size={13} color="#3B82F6" />
                <span>Time Complexity</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#F87171' }}>{result.timeComplexityBefore}</span> → <span style={{ color: 'var(--status-success)' }}>{result.timeComplexityAfter}</span>
              </div>
            </div>
          </div>

          {/* Bottleneck Explanation */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Optimization Rationale:</strong> {result.bottleneckExplanation}
          </div>

          {/* Optimized Code Output */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Optimized Implementation</span>
              <button onClick={handleCopy} className="action-btn" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre style={{ margin: 0, padding: '12px', background: '#0D0D11', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#34D399', overflowX: 'auto', lineHeight: 1.6 }}>
              <code>{result.optimizedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
