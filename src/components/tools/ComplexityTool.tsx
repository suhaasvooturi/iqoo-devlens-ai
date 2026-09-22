import React, { useState } from 'react';
import { runComplexityAnalyzer, TOOL_SAMPLES, type ComplexityOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { BarChart3, Sparkles, Clock, HardDrive } from 'lucide-react';

export const ComplexityTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.complexity.code);
  const [result, setResult] = useState<ComplexityOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const output = runComplexityAnalyzer(code);
      setResult(output);
      setIsAnalyzing(false);

      addHistoryItem({
        toolId: 'complexity',
        toolName: 'Complexity Analyzer',
        language: 'Python',
        summary: `Time: ${output.timeComplexity}, Space: ${output.spaceComplexity}`,
        status: output.scalabilityRating === 'Poor' ? 'warning' : 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const complexityScale = [
    { label: 'O(1)', class: 'Constant', color: '#10B981' },
    { label: 'O(log n)', class: 'Logarithmic', color: '#10B981' },
    { label: 'O(n)', class: 'Linear', color: '#3B82F6' },
    { label: 'O(n log n)', class: 'Linearithmic', color: '#8B5CF6' },
    { label: 'O(n²)', class: 'Quadratic', color: '#F59E0B' },
    { label: 'O(2ⁿ)', class: 'Exponential', color: '#EF4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 size={16} color="#8B5CF6" />
            <span>Complexity Analyzer</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Formally estimate Big-O Time & Space asymptotic bounds and pinpoint recursion or loop hotspots.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCode(TOOL_SAMPLES.complexity.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample (Merge Sort)
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isAnalyzing ? 'Computing Asymptotics...' : 'Analyze Complexity'}</span>
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

      {/* Output Cards */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Time Complexity */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <Clock size={13} color="var(--accent-primary)" />
                  <span>Time Complexity</span>
                </div>
                <span style={{ fontSize: '10.5px', background: 'var(--bg-surface-raised)', padding: '1px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  Scalability: {result.scalabilityRating}
                </span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {result.timeComplexity}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                {result.timeExplanation}
              </div>
            </div>

            {/* Space Complexity */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <HardDrive size={13} color="#3B82F6" />
                  <span>Space Complexity</span>
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Hotspot L{result.hotspotLine}
                </span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {result.spaceComplexity}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                {result.spaceExplanation}
              </div>
            </div>
          </div>

          {/* Big-O Curve Benchmark Scale */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Asymptotic Complexity Scale
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
              {complexityScale.map((c) => {
                const isCurrent = result.timeComplexity.includes(c.label);
                return (
                  <div
                    key={c.label}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      background: isCurrent ? 'var(--bg-surface-raised)' : 'var(--bg-app)',
                      border: '1px solid',
                      borderColor: isCurrent ? c.color : 'var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isCurrent ? c.color : 'var(--text-secondary)' }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {c.class}
                    </div>
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
