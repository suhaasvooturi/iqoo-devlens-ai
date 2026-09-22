import React, { useState } from 'react';
import { runExplainer, TOOL_SAMPLES, type ExplainerOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { Code2, Sparkles, BookOpen, Layers, Smile } from 'lucide-react';

export const ExplainerTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.explainer.code);
  const [result, setResult] = useState<ExplainerOutput | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'lines' | 'eli5'>('summary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleExplain = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const output = runExplainer(code);
      setResult(output);
      setIsAnalyzing(false);

      addHistoryItem({
        toolId: 'explainer',
        toolName: 'Code Explainer',
        language: 'TypeScript',
        summary: output.summary.slice(0, 60) + '...',
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Code2 size={16} color="#3B82F6" />
            <span>Code Explainer</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Convert convoluted code, algorithms, and regex into clean, human explanations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCode(TOOL_SAMPLES.explainer.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample Code
          </button>
          <button
            onClick={handleExplain}
            disabled={isAnalyzing}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isAnalyzing ? 'Analyzing AST...' : 'Explain Code'}</span>
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

      {/* Output Tabs */}
      {result && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Concept Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Identified Concepts:</span>
            {result.keyConcepts.map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: '10.5px',
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--accent-primary)',
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <button
              onClick={() => setActiveTab('summary')}
              className={`action-btn ${activeTab === 'summary' ? 'active' : ''}`}
              style={{ fontSize: '11.5px' }}
            >
              <BookOpen size={13} />
              <span>Executive Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('lines')}
              className={`action-btn ${activeTab === 'lines' ? 'active' : ''}`}
              style={{ fontSize: '11.5px' }}
            >
              <Layers size={13} />
              <span>Line-by-Line Breakdown</span>
            </button>
            <button
              onClick={() => setActiveTab('eli5')}
              className={`action-btn ${activeTab === 'eli5' ? 'active' : ''}`}
              style={{ fontSize: '11.5px' }}
            >
              <Smile size={13} />
              <span>ELI5 (Simple Analogy)</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'summary' && (
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {result.summary}
            </div>
          )}

          {activeTab === 'lines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
              {result.lineByLine.map((l) => (
                <div
                  key={l.line}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.1fr 1fr',
                    gap: '10px',
                    padding: '6px 8px',
                    background: 'var(--bg-surface-raised)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11.5px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>L{l.line}</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.code}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{l.explanation}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'eli5' && (
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-primary)', background: 'var(--bg-surface-raised)', padding: '14px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #3B82F6' }}>
              💡 {result.eli5}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
