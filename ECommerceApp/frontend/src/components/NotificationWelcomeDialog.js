import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Paper,
  useTheme,
} from '@mui/material';
import { Notifications, CheckCircle } from '@mui/icons-material';
import NotificationSetup from './NotificationSetup';

const NotificationWelcomeDialog = ({ open, onClose, userName }) => {
  const theme = useTheme();

  const handleSetupComplete = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1
        }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Notifications sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Welcome back, {userName}! 👋
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Stay connected with E-Shop and never miss out on:
          </Typography>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2">🚀 New product launches</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2">💰 Exclusive deals & flash sales</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2">📦 Order status updates</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                <Typography variant="body2">🎁 Personalized recommendations</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        <NotificationSetup onSetupComplete={handleSetupComplete} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          color="secondary"
          variant="outlined"
          fullWidth
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Maybe Later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationWelcomeDialog;