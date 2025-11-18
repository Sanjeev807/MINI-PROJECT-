import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const TopNotificationToast = ({ notifications = [], onClose }) => {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      setCurrentNotification(latest);
      setVisible(true);

      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setCurrentNotification(null);
      if (onClose) onClose();
    }, 300);
  };

  if (!currentNotification) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'promotional': return '🎯';
      case 'account': return '👤';
      case 'wishlist': return '❤️';
      case 'engagement': return '🚀';
      case 'welcome': return '👋';
      case 'login': return '🔐';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return '#4CAF50';
      case 'promotional': return '#FF9800';
      case 'account': return '#2196F3';
      case 'wishlist': return '#E91E63';
      case 'engagement': return '#9C27B0';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#667eea';
    }
  };

  const toastContent = (
    <div
      style={{
        position: 'fixed',
        top: visible ? '20px' : '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: `3px solid ${getNotificationColor(currentNotification.type)}`,
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '400px',
        minWidth: '320px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 10000,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        animation: visible ? 'slideDown 0.3s ease-out' : 'slideUp 0.3s ease-in',
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
      }}
      onClick={handleClose}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: '24px',
          flexShrink: 0,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: `${getNotificationColor(currentNotification.type)}20`,
        }}
      >
        {getNotificationIcon(currentNotification.type)}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333',
            marginBottom: '4px',
            wordBreak: 'break-word',
            lineHeight: 1.3,
          }}
        >
          {currentNotification.title}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#666',
            wordBreak: 'break-word',
            lineHeight: 1.3,
          }}
        >
          {currentNotification.body}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f0f0f0';
          e.target.style.color = '#333';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#999';
        }}
      >
        ✕
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          backgroundColor: getNotificationColor(currentNotification.type),
          borderRadius: '0 0 9px 9px',
          animation: 'progressBar 5s linear',
        }}
      />
    </div>
  );

  // Create styles for animations
  if (!document.getElementById('top-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'top-notification-styles';
    style.textContent = `
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
      }
      
      @keyframes progressBar {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  return createPortal(toastContent, document.body);
};

export default TopNotificationToast;