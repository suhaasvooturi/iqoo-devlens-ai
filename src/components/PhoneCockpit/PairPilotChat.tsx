import React, { useState, useEffect, useRef } from 'react';
import type { Incident } from '../../types';
import { Send, Bot, Sparkles } from 'lucide-react';

interface PairPilotChatProps {
  incident: Incident;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const PairPilotChat: React.FC<PairPilotChatProps> = ({ incident }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (incident.copilotChat && incident.copilotChat.length > 0) {
      setMessages(
        incident.copilotChat.map((msg, i) => ({
          id: `msg-${i}`,
          sender: msg.sender,
          text: msg.text,
          time: msg.time || '16:30',
        }))
      );
    } else {
      setMessages([
        {
          id: 'msg-init',
          sender: 'ai',
          text: `Hey! I'm watching ${incident.culpritFile}. Ask me anything about this error or how the patch works!`,
          time: '16:30',
        },
      ]);
    }
  }, [incident]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      const lower = text.toLowerCase();

      if (lower.includes('why') || lower.includes('cause')) {
        aiResponseText = `The root issue is: ${incident.rootCause} It happens because the current environment doesn't satisfy the implicit assumptions of that code.`;
      } else if (lower.includes('backward') || lower.includes('break') || lower.includes('safe')) {
        aiResponseText = `The fix is 100% backward compatible. We kept the exact same function signatures and props, and wrapped the edge-case in defensive guards. All ${incident.testSuite.totalTests} tests pass cleanly!`;
      } else if (lower.includes('simple') || lower.includes('eli5')) {
        aiResponseText = `In plain English: ${incident.humanSummary}`;
      } else if (lower.includes('push') || lower.includes('deploy')) {
        aiResponseText = `You can tap the 'Diff' tab at the top and hit 'Approve & Merge Hotfix'—I'll immediately broadcast it to your laptop workstation.`;
      } else {
        aiResponseText = `Regarding "${text}": I analyzed the AST of ${incident.culpritFile}. With our patch, the execution pipeline remains safe without regressions. Would you like me to run the test suite again?`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 750);
  };

  const quickPrompts = [
    'Explain in simple terms',
    'Is this backward compatible?',
    'Why did this fail?',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '490px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Clean Dev Header */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--bg-surface-raised)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
            }}
          >
            <Bot size={15} />
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Pair Pilot
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              On-Device Engineer Assistant
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {(incident.devContext?.assignee || 'Suhas').split(' ')[0]}
        </div>
      </div>

      {/* Message Stream */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '3px',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: isUser ? 'var(--accent-primary)' : 'var(--bg-surface-raised)',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '12px',
                  lineHeight: '1.5',
                }}
              >
                {m.text}
              </div>
              <span style={{ fontSize: '9.5px', color: 'var(--text-dim)', padding: '0 2px' }}>
                {m.time}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Sparkles size={11} className="spin" color="var(--accent-primary)" />
            <span>Pair Pilot is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div
        style={{
          padding: '6px 10px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          background: 'var(--bg-app)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '10.5px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        style={{
          padding: '8px 10px',
          background: 'var(--bg-surface-raised)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Ask Pair Pilot a question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{
            flex: 1,
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 10px',
            color: 'var(--text-primary)',
            fontSize: '11.5px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
};
