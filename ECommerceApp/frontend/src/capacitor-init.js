import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure StatusBar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#2874f0' });
      
      // Hide SplashScreen after app is ready
      await SplashScreen.hide();
    } catch (error) {
      console.error('Error initializing Capacitor:', error);
    }
  }
};

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};
