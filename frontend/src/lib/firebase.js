import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration - UPDATE WITH YOUR VALUES FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
};

console.log("FIREBASE ENV TEST:", {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  senderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
});

let app;
let messaging;

// Initialize Firebase only if config is provided
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId
  );
};

export function initializeFirebase() {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Push notifications will be disabled.');
    return null;
  }

  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    console.log('Firebase initialized successfully');
    return messaging;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token if successful, null otherwise
 */
export async function requestFCMToken() {
  if (!isFirebaseConfigured() || !messaging) {
    console.warn('Firebase not configured');
    return null;
  }

  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Check if already granted
    if (Notification.permission === 'granted') {
      return await getFCMToken();
    }

    // Request permission
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await getFCMToken();
      }
    }

    console.log('Notification permission denied');
    return null;
  } catch (error) {
    console.error('Error requesting FCM token:', error);
    return null;
  }
}

/**
 * Get FCM token (assumes permission already granted)
 * @returns {Promise<string|null>}
 */
async function getFCMToken() {
  if (!messaging) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || "",
    });

    if (token) {
      console.log('FCM token obtained:', token.substring(0, 20) + '...');
      return token;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }

  return null;
}

/**
 * Setup listener for foreground messages
 * @param {Function} callback - Called when message is received while app is in foreground
 */
export function setupForegroundMessageListener(callback) {
  if (!messaging) {
    console.warn('Firebase not initialized');
    return;
  }

  try {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      callback(payload);
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
}

/**
 * Get device info for registration
 * @returns {Object} device info
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = 'web';
  let deviceName = 'Web Browser';

  // Detect device type
  if (/mobile|android|iphone|ipad|windows phone/i.test(ua)) {
    deviceType = /iphone|ipad/i.test(ua) ? 'ios' : 'android';
    deviceName = ua.split('(')[1].split(')')[0];
  } else {
    // Extract browser/OS info
    if (/chrome/i.test(ua)) {
      deviceName = 'Chrome';
    } else if (/firefox/i.test(ua)) {
      deviceName = 'Firefox';
    } else if (/safari/i.test(ua)) {
      deviceName = 'Safari';
    } else if (/edge/i.test(ua)) {
      deviceName = 'Edge';
    }
  }

  return {
    deviceType,
    deviceName: deviceName.substring(0, 100),
  };
}
