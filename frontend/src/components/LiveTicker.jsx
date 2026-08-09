import React, { useState, useEffect } from 'react';
import { Radio, Zap, ChevronRight, X } from 'lucide-react';
import { MOCK_TICKER_ITEMS } from '../mockData';

export const LiveTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % MOCK_TICKER_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const currentItem = MOCK_TICKER_ITEMS[currentIndex];

  return (
    <div className="live-ticker-bar">
      <div className="live-ticker-container">
        <div className="live-badge">
          <Radio size={14} className="animate-pulse" />
          <span>LIVE UPDATES</span>
        </div>
        <div className="ticker-content">
          <span className="ticker-tag">{currentItem.tag}</span>
          <span className="ticker-text">{currentItem.text}</span>
        </div>
        <button className="ticker-close" onClick={() => setVisible(false)} title="Dismiss Ticker">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default LiveTicker;
