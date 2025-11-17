import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler for push notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Handle background message
});

AppRegistry.registerComponent(appName, () => App);
