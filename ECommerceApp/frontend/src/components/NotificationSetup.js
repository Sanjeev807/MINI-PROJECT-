import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  setupFCMForUser, 
  sendTestNotification, 
  getNotificationPermissionStatus,
  isFCMSupported 
} from '../services/notificationService';

const NotificationSetup = ({ compact = false, onSetupComplete }) => {
  const { user, token, fcmSetup } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [fcmSupported, setFcmSupported] = useState(false);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [testInProgress, setTestInProgress] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    checkSupport();
    checkPermissionStatus();
    // Auto-setup notifications for authenticated users if not already done
    if (user && token && !fcmSetup && permissionStatus !== 'denied') {
      // Small delay to let permission status check complete
      setTimeout(() => {
        if (permissionStatus === 'default') {
          // Auto-request permission for better UX
          handleSetupNotifications();
        }
      }, 1000);
    }
  }, [user, token, fcmSetup]);

  const checkSupport = async () => {
    const supported = await isFCMSupported();
    setFcmSupported(supported);
  };

  const checkPermissionStatus = () => {
    const status = getNotificationPermissionStatus();
    setPermissionStatus(status);
  };

  const showMessage = (msg, type = 'info', duration = 5000) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), duration);
  };

  const handleSetupNotifications = async () => {
    if (!token) {
      showMessage('Please log in first', 'error');
      return;
    }

    setSetupInProgress(true);
    try {
      const result = await setupFCMForUser(token);
      
      if (result.success) {
        if (result.warning) {
          showMessage(`⚠️ ${result.warning}`, 'warning');
        } else {
          showMessage('✅ Notifications enabled successfully!', 'success');
        }
        checkPermissionStatus();
        // Call the onSetupComplete callback if provided
        if (onSetupComplete) {
          onSetupComplete();
        }
      } else {
        if (result.isNetworkError) {
          showMessage('⚠️ Notifications enabled locally. Backend will sync when available.', 'warning');
          checkPermissionStatus();
          if (onSetupComplete) {
            onSetupComplete();
          }
        } else if (result.error && result.error.includes('Permission')) {
          showMessage('❌ Please allow notifications in your browser settings', 'error');
        } else {
          showMessage(`❌ Setup failed: ${result.error}`, 'error');
        }
      }
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, 'error');
    }
    setSetupInProgress(false);
  };

  const handleTestNotification = async () => {
    if (!token) {
      showMessage('Please log in first', 'error');
      return;
    }

    setTestInProgress(true);
    try {
      const result = await sendTestNotification(token);
      
      if (result.success) {
        showMessage('✅ Test notification sent! Check your notifications.', 'success');
      } else {
        showMessage(`❌ Test failed: ${result.error}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Test error: ${error.message}`, 'error');
    }
    setTestInProgress(false);
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return '#28a745';
      case 'denied': return '#dc3545';
      case 'default': return '#ffc107';
      case 'not-supported': return '#6c757d';
      default: return '#17a2b8';
    }
  };

  const getStatusText = () => {
    switch (permissionStatus) {
      case 'granted': return '✅ Notifications Enabled';
      case 'denied': return '❌ Notifications Blocked';
      case 'default': return '⚠️ Notifications Not Set';
      case 'not-supported': return '❌ Not Supported';
      default: return '⏳ Checking...';
    }
  };

  if (!fcmSupported) {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, borderLeft: '4px solid #6c757d'}}>
          <h3 style={styles.title}>🔔 Push Notifications</h3>
          <p style={styles.text}>
            Your browser doesn't support push notifications.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={{...styles.card, borderLeft: '4px solid #ffc107'}}>
          <h3 style={styles.title}>🔔 Push Notifications</h3>
          <p style={styles.text}>
            Please log in to enable push notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={compact ? styles.compactContainer : styles.container}>
      <div style={{...styles.card, ...(compact ? styles.compactCard : {}), borderLeft: `4px solid ${getStatusColor()}`}}>
        {!compact && <h3 style={styles.title}>🔔 Push Notifications</h3>}
        
        <div style={{...styles.status, color: getStatusColor()}}>
          {getStatusText()}
        </div>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: messageType === 'success' ? '#d4edda' : 
                           messageType === 'error' ? '#f8d7da' : 
                           messageType === 'warning' ? '#fff3cd' : '#d1ecf1',
            color: messageType === 'success' ? '#155724' : 
                   messageType === 'error' ? '#721c24' : 
                   messageType === 'warning' ? '#856404' : '#0c5460'
          }}>
            {message}
          </div>
        )}

        {!compact && (
          <div style={styles.info}>
            <p style={styles.text}>
              🔔 Notifications are automatically enabled when you log in. You'll receive instant alerts for:
            </p>
            <ul style={{margin: '0', paddingLeft: '20px', color: '#666'}}>
              <li>Order confirmations and shipping updates</li>
              <li>Exclusive deals and flash sales</li>
              <li>Wishlist stock alerts and price drops</li>
              <li>Account security notifications</li>
            </ul>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div style={styles.helpText}>
            <p><strong>To enable notifications:</strong></p>
            <ol>
              <li>Click the 🔒 icon in your address bar</li>
              <li>Set "Notifications" to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}

        {fcmSetup || permissionStatus === 'granted' ? (
          <div style={styles.successInfo}>
            ✅ You're all set! You'll receive notifications for:
            <ul>
              <li>Order confirmations and updates</li>
              <li>Shipping notifications</li>
              <li>Exclusive deals and offers</li>
              <li>Account security alerts</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px 0',
    maxWidth: '600px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e9ecef'
  },
  title: {
    margin: '0 0 16px 0',
    color: '#333',
    fontSize: '1.25rem'
  },
  status: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '16px'
  },
  text: {
    color: '#666',
    lineHeight: '1.5',
    margin: '0 0 16px 0'
  },
  message: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '0.95rem'
  },
  info: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-1px)'
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.7
    }
  },
  helpText: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '12px',
    fontSize: '0.9rem'
  },
  successInfo: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '0.9rem'
  },
  // Compact mode styles
  compactContainer: {
    margin: '0',
    maxWidth: 'none'
  },
  compactCard: {
    padding: '16px',
    boxShadow: 'none',
    border: 'none',
    borderRadius: '8px'
  },
  compactButtonContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }
};

export default NotificationSetup;