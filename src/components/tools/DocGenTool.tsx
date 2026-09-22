import React, { useState } from 'react';
import { runDocGenerator, TOOL_SAMPLES, type DocGenOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';

export const DocGenTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.docgen.code);
  const [format, setFormat] = useState<'jsdoc' | 'docstring' | 'markdown'>('jsdoc');
  const [result, setResult] = useState<DocGenOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const output = runDocGenerator(code, format);
      setResult(output);
      setIsGenerating(false);

      addHistoryItem({
        toolId: 'docgen',
        toolName: 'Documentation Generator',
        language: format.toUpperCase(),
        summary: `Generated ${format} documentation for component`,
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 400);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.documentedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} color="#06B6D4" />
            <span>Documentation Generator</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Automatically extract API contracts, parameter types, returns, and write complete Markdown / JSDoc documentation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
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
            <option value="jsdoc">JSDoc / TSDoc</option>
            <option value="markdown">Markdown README</option>
          </select>

          <button
            onClick={() => setCode(TOOL_SAMPLES.docgen.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample Store
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isGenerating ? 'Synthesizing Docs...' : 'Generate Documentation'}</span>
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
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{result.summary}</span>
            <button onClick={handleCopy} className="action-btn" style={{ fontSize: '11px', padding: '3px 9px' }}>
              {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Documentation'}</span>
            </button>
          </div>

          <pre style={{ margin: 0, padding: '14px', background: '#0D0D11', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', overflowX: 'auto', lineHeight: 1.6 }}>
            <code>{result.documentedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
