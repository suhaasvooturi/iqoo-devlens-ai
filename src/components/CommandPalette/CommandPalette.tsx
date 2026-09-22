import React, { useState, useEffect, useRef } from 'react';
import type { DevToolId } from '../../types';
import {
  Search,
  Bug,
  Code2,
  Zap,
  FlaskConical,
  ShieldAlert,
  BarChart3,
  FileText,
  Repeat,
  Smartphone,
  QrCode,
  History,
  Trash2,
  Sparkles,
  Command,
} from 'lucide-react';

export interface CommandItem {
  id: string;
  title: string;
  category: 'AI Developer Tools' | 'Phone & Hardware' | 'Workspace';
  icon: React.FC<{ size: number; color?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (id: DevToolId) => void;
  onOpenQR: () => void;
  onRunDemo: () => void;
  onClearHistory: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenQR,
  onRunDemo,
  onClearHistory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'debug',
      title: 'Debug Code & Fix Stack Trace',
      category: 'AI Developer Tools',
      icon: Bug,
      shortcut: '2',
      action: () => {
        onSelectTool('debugger');
        onClose();
      },
    },
    {
      id: 'explain',
      title: 'Explain Complex Code (ELI5 & Walkthrough)',
      category: 'AI Developer Tools',
      icon: Code2,
      shortcut: '3',
      action: () => {
        onSelectTool('explainer');
        onClose();
      },
    },
    {
      id: 'optimize',
      title: 'Optimize Algorithmic Performance',
      category: 'AI Developer Tools',
      icon: Zap,
      shortcut: '4',
      action: () => {
        onSelectTool('optimizer');
        onClose();
      },
    },
    {
      id: 'testgen',
      title: 'Generate Unit Test Suite',
      category: 'AI Developer Tools',
      icon: FlaskConical,
      shortcut: '5',
      action: () => {
        onSelectTool('testgen');
        onClose();
      },
    },
    {
      id: 'security',
      title: 'Security Scan & OWASP Audit',
      category: 'AI Developer Tools',
      icon: ShieldAlert,
      shortcut: '6',
      action: () => {
        onSelectTool('security');
        onClose();
      },
    },
    {
      id: 'complexity',
      title: 'Analyze Big-O Complexity',
      category: 'AI Developer Tools',
      icon: BarChart3,
      shortcut: '7',
      action: () => {
        onSelectTool('complexity');
        onClose();
      },
    },
    {
      id: 'docgen',
      title: 'Generate JSDoc & Markdown Docs',
      category: 'AI Developer Tools',
      icon: FileText,
      shortcut: '8',
      action: () => {
        onSelectTool('docgen');
        onClose();
      },
    },
    {
      id: 'converter',
      title: 'Convert Code Syntax Between Languages',
      category: 'AI Developer Tools',
      icon: Repeat,
      shortcut: '9',
      action: () => {
        onSelectTool('converter');
        onClose();
      },
    },
    {
      id: 'sentinel',
      title: 'Open DevLens Phone Sentinel Cockpit',
      category: 'Phone & Hardware',
      icon: Smartphone,
      shortcut: '0',
      action: () => {
        onSelectTool('sentinel');
        onClose();
      },
    },
    {
      id: 'demo',
      title: 'Run Hackathon Demo Flow (Incident → Insight → Fix)',
      category: 'Phone & Hardware',
      icon: Sparkles,
      shortcut: 'D',
      action: () => {
        onRunDemo();
        onClose();
      },
    },
    {
      id: 'connect',
      title: 'Connect iQOO Phone via QR Code',
      category: 'Phone & Hardware',
      icon: QrCode,
      shortcut: 'Q',
      action: () => {
        onOpenQR();
        onClose();
      },
    },
    {
      id: 'dashboard',
      title: 'View Dashboard & Developer History',
      category: 'Workspace',
      icon: History,
      shortcut: '1',
      action: () => {
        onSelectTool('dashboard');
        onClose();
      },
    },
    {
      id: 'clear-history',
      title: 'Clear Local Activity History',
      category: 'Workspace',
      icon: Trash2,
      action: () => {
        onClearHistory();
        onClose();
      },
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '640px',
          maxWidth: '92vw',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 229, 255, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={18} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tools... (↑↓ to navigate, Enter to select)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              background: 'var(--bg-app)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span>ESC</span>
          </div>
        </div>

        {/* Command list */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No commands matching "{query}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-surface-raised)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {cmd.title}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-dim)' }}>
                        {cmd.category}
                      </div>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--bg-app)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-dim)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '8px 16px',
            background: 'var(--bg-app)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-dim)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Command size={11} />
            <span>DevLens Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
