import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('16:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="phone-viewport-wrapper">
      <div className="phone-hardware-frame">
        {/* Screen */}
        <div className="phone-screen">
          {/* Authentic Minimal Status Bar */}
          <div className="phone-status-bar">
            <span>{currentTime}</span>

            {/* Subtle Front Camera */}
            <div className="camera-punch-hole" />

            <div className="phone-status-icons">
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>5G</span>
              <Wifi size={12} color="var(--text-secondary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Battery size={13} color="var(--text-secondary)" />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>98%</span>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="phone-content">{children}</div>

          {/* Bottom Home Indicator */}
          <div
            style={{
              height: '14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'auto',
              paddingBottom: '2px',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
