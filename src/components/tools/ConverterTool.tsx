import React, { useState } from 'react';
import { runCodeConverter, TOOL_SAMPLES, type ConverterOutput } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { Repeat, Sparkles, Copy, Check, ArrowRight, Info } from 'lucide-react';

export const ConverterTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.converter.code);
  const [sourceLang, setSourceLang] = useState('Python');
  const [targetLang, setTargetLang] = useState('TypeScript');
  const [result, setResult] = useState<ConverterOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const languages = ['Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust'];

  const handleConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      const output = runCodeConverter(code, sourceLang, targetLang);
      setResult(output);
      setIsConverting(false);

      addHistoryItem({
        toolId: 'converter',
        toolName: 'Code Converter',
        language: `${sourceLang} → ${targetLang}`,
        summary: `Translated code from ${sourceLang} to ${targetLang}`,
        status: 'success',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Repeat size={16} color="#F97316" />
            <span>Code Converter</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Translate functions, algorithms, and data structures across languages with idiomatic conventions.
          </p>
        </div>

        {/* Language Selectors */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
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
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <ArrowRight size={13} color="var(--text-muted)" />

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
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
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setCode(TOOL_SAMPLES.converter.code);
              setSourceLang('Python');
              setTargetLang('TypeScript');
            }}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample
          </button>
          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isConverting ? 'Translating...' : 'Translate Code'}</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Idiomatic Notes */}
          {result.notes.length > 0 && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Info size={14} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Translation Notes:</strong>{' '}
                {result.notes.join(' • ')}
              </div>
            </div>
          )}

          {/* Converted Code */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Translated to {result.targetLang}
              </span>
              <button onClick={handleCopy} className="action-btn" style={{ fontSize: '11px', padding: '3px 9px' }}>
                {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Converted Code'}</span>
              </button>
            </div>

            <pre style={{ margin: 0, padding: '14px', background: '#0D0D11', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', overflowX: 'auto', lineHeight: 1.6 }}>
              <code>{result.convertedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
