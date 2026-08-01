import { useEffect, useCallback } from 'react';
import { requestFCMToken, setupForegroundMessageListener, getDeviceInfo, isFirebaseConfigured } from '@/lib/firebase';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * Hook to manage push notification registration and setup
 * @param {Object} user - Current user object with id
 * @param {boolean} enabled - Whether to enable push notifications
 */
export function usePushNotifications(user, enabled = true) {
  // Register device token when user logs in
  useEffect(() => {
    if (!enabled || !user) return;

    const registerDevice = async () => {
      // Only register on mobile or if Firebase is configured
      if (!isFirebaseConfigured()) {
        console.log('Firebase not configured, push notifications disabled');
        return;
      }

      try {
        // Request notification permission and get token
        const fcmToken = await requestFCMToken();

        if (!fcmToken) {
          console.log('User denied notification permission or token unavailable');
          return;
        }

        // Get device info
        const deviceInfo = getDeviceInfo();

        // Register device token with backend
        try {
          await api.post('/parent/device-token', {
            fcm_token: fcmToken,
            device_name: deviceInfo.deviceName,
            device_type: deviceInfo.deviceType,
          });
          console.log('Device registered for push notifications');
        } catch (error) {
          console.warn('Failed to register device token:', error);
          // Don't show error to user, it's not critical
        }
      } catch (error) {
        console.error('Error in push notification setup:', error);
      }
    };

    // Register device after a short delay to ensure app is fully loaded
    const timeout = setTimeout(registerDevice, 500);
    return () => clearTimeout(timeout);
  }, [user, enabled]);

  // Setup listener for foreground messages
  useEffect(() => {
    if (!enabled || !isFirebaseConfigured()) return;

    const handleForegroundMessage = (payload) => {
      const title = payload.notification?.title || 'Vardaan+';
      const body = payload.notification?.body || '';

      // Show toast notification when app is in foreground
      toast.info(body, {
        description: title,
        duration: 5000,
      });

      // You can also play a sound here
      // playNotificationSound();
    };

    setupForegroundMessageListener(handleForegroundMessage);
  }, [enabled]);

  // Unregister device on logout
  const unregisterDevice = useCallback(async (fcmToken) => {
    if (!fcmToken) return;

    try {
      await api.post('/parent/device-token/unregister', {
        fcm_token: fcmToken,
      });
      console.log('Device unregistered');
    } catch (error) {
      console.warn('Failed to unregister device:', error);
    }
  }, []);

  return {
    unregisterDevice,
  };
}
