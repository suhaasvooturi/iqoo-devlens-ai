import React, { useState } from 'react';
import { runSecurityScanner, TOOL_SAMPLES, type SecurityVulnerability } from '../../services/devPilotEngine';
import { addHistoryItem } from '../../services/historyStorage';
import { ShieldAlert, Sparkles, Check, Copy, Shield } from 'lucide-react';

export const SecurityScannerTool: React.FC = () => {
  const [code, setCode] = useState(TOOL_SAMPLES.security.code);
  const [vulns, setVulns] = useState<SecurityVulnerability[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const results = runSecurityScanner(code);
      setVulns(results);
      setIsScanning(false);

      addHistoryItem({
        toolId: 'security',
        toolName: 'Security Scanner',
        language: 'Python',
        summary: `Detected ${results.length} vulnerabilities (${results[0]?.cwe.slice(0, 30)})`,
        status: results[0]?.severity === 'CRITICAL' ? 'error' : 'warning',
        snippetPreview: code.slice(0, 50),
      });
    }, 450);
  };

  const handleCopySanitized = (id: string, sanitized: string) => {
    navigator.clipboard.writeText(sanitized);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={16} color="#EC4899" />
            <span>Security Scanner</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Audit source code for OWASP Top 10 vulnerabilities, injection flaws, unsafe memory access, and secret leakage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCode(TOOL_SAMPLES.security.code)}
            className="action-btn"
            style={{ fontSize: '11px' }}
          >
            Load Sample SQLi
          </button>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="scan-trigger-btn"
            style={{ width: 'auto', padding: '6px 14px', fontSize: '11.5px' }}
          >
            <Sparkles size={13} />
            <span>{isScanning ? 'Auditing AST...' : 'Run Security Audit'}</span>
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

      {/* Vulnerabilities Output */}
      {vulns && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--accent-primary)" />
            <span>Audit Findings ({vulns.length} issue{vulns.length > 1 ? 's' : ''} detected)</span>
          </div>

          {vulns.map((v) => {
            const isCrit = v.severity === 'CRITICAL';
            return (
              <div
                key={v.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid',
                  borderColor: isCrit ? 'var(--status-error-border)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-sm)',
                        background: isCrit ? 'var(--status-error-bg)' : 'var(--status-warning-bg)',
                        color: isCrit ? '#F87171' : '#FBBF24',
                        border: '1px solid',
                        borderColor: isCrit ? 'var(--status-error-border)' : 'var(--status-warning-border)',
                      }}
                    >
                      {v.severity}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {v.title}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Line {v.line} · {v.cwe}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {v.description}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-primary)', background: 'var(--bg-surface-raised)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-success)', marginBottom: '4px' }}>
                    Remediation Strategy:
                  </div>
                  {v.remediation}
                </div>

                {/* Sanitized Code */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sanitized Safe Implementation</span>
                    <button
                      onClick={() => handleCopySanitized(v.id, v.sanitizedCode)}
                      className="action-btn"
                      style={{ fontSize: '10.5px', padding: '2px 8px' }}
                    >
                      {copiedId === v.id ? <Check size={11} color="var(--status-success)" /> : <Copy size={11} />}
                      <span>{copiedId === v.id ? 'Copied' : 'Copy Fix'}</span>
                    </button>
                  </div>
                  <pre style={{ margin: 0, padding: '10px', background: '#0D0D11', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#34D399', overflowX: 'auto' }}>
                    <code>{v.sanitizedCode}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
