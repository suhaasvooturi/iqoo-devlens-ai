import React, { useState, useEffect, useRef } from 'react';
import type { Incident } from '../../types';
import { Send, Sparkles, Bot } from 'lucide-react';

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

  // Initialize chat when incident changes
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

    // Simulate thoughtful, human AI response
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
        aiResponseText = `You can tap the 'Hotfix Diff' tab at the top and hit 'Apply Hotfix & Push to Git'—I'll immediately broadcast it to your laptop and execute the git commit.`;
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
    }, 850);
  };

  const quickPrompts = [
    'Explain in simple terms',
    'Is this 100% backward compatible?',
    'Why did this fail?',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '490px',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Dev Buddy Header */}
      <div
        style={{
          padding: '12px 14px',
          background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.12), rgba(0, 229, 255, 0.08))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF5500, #FF2200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 0 10px var(--iqoo-orange-glow)',
            }}
          >
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Pair Pilot</span>
              <span style={{ fontSize: '9px', background: 'rgba(0, 245, 155, 0.2)', color: 'var(--status-success)', padding: '1px 5px', borderRadius: '4px' }}>
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>
              Your on-device senior engineer companion
            </div>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>
          {(incident.devContext?.assignee || 'Suhas').split(' ')[0]}
        </div>
      </div>

      {/* Message Stream */}
      <div
        style={{
          flex: 1,
          padding: '14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
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
                gap: '4px',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isUser ? 'var(--iqoo-orange)' : 'var(--bg-card-secondary)',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  color: isUser ? '#FFFFFF' : '#E2E8F0',
                  fontSize: '11.5px',
                  lineHeight: '1.5',
                  boxShadow: isUser ? '0 4px 12px var(--iqoo-orange-glow)' : 'none',
                }}
              >
                {m.text}
              </div>
              <span style={{ fontSize: '9px', color: '#64748B', padding: '0 4px' }}>
                {m.time}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '11px' }}>
            <Sparkles size={12} className="spin" color="var(--iqoo-orange)" />
            <span>Pair Pilot is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div
        style={{
          padding: '6px 12px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          background: 'rgba(10, 13, 20, 0.6)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              background: 'var(--bg-card-secondary)',
              border: '1px solid var(--border-light)',
              color: '#CBD5E1',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '12px',
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
          padding: '10px',
          background: '#090C12',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Ask Pair Pilot anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{
            flex: 1,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '8px 14px',
            color: '#FFFFFF',
            fontSize: '11px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--iqoo-orange)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 10px var(--iqoo-orange-glow)',
          }}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};
