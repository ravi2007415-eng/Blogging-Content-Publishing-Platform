import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { Bell, Calendar, Sparkles, X } from 'lucide-react';

export const ToastNotification = () => {
  const { activeToast, dismissToast } = useContext(NotificationContext);

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'EVENT': return <Calendar size={18} className="text-pink" />;
      case 'POST': return <Sparkles size={18} className="text-cyan" />;
      default: return <Bell size={18} className="text-indigo" />;
    }
  };

  return (
    <div className="toast-notification-wrapper">
      <div className="toast-card glass-panel shadow-lg">
        <div className="toast-icon-box">
          {getIcon()}
        </div>
        <div className="toast-content">
          <h4 className="toast-title">{activeToast.title}</h4>
          <p className="toast-message">{activeToast.message}</p>
        </div>
        <button onClick={dismissToast} className="toast-close-btn">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
