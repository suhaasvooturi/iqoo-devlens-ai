import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

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
        {/* Hardware volume rocker & power key */}
        <div className="phone-volume-rocker" />
        <div className="phone-power-button" />

        {/* Screen */}
        <div className="phone-screen">
          {/* Top Status Bar */}
          <div className="phone-status-bar">
            <span>{currentTime}</span>

            {/* Centered front camera punch hole */}
            <div className="camera-punch-hole" />

            <div className="phone-status-icons">
              <span className="monster-mode-badge">MONSTER</span>
              <span style={{ fontSize: '10px', color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>5G</span>
              <Wifi size={12} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <BatteryMedium size={14} color="var(--status-success)" />
                <span style={{ fontSize: '9px' }}>98%</span>
              </div>
            </div>
          </div>

          {/* Phone Inner Interactive Content */}
          <div className="phone-content">{children}</div>

          {/* Bottom Home Pill */}
          <div
            style={{
              height: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'auto',
              paddingBottom: '4px',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
