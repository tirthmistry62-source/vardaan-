// Firebase messaging service worker
// Handles background notifications when app is closed or in background

importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

// Initialize Firebase with config
firebase.initializeApp({
  apiKey: "YOUR_REACT_APP_FIREBASE_API_KEY",
  authDomain: "YOUR_REACT_APP_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_REACT_APP_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_REACT_APP_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_REACT_APP_FIREBASE_APP_ID"
});

// Get Firebase messaging instance
const messaging = firebase.messaging();

// Handle background messages when app is closed or minimized
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title || 'Vardaan+';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'vaccination-reminder',
    requireInteraction: true,  // Keeps notification visible until user interacts
    data: payload.data || {},
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();

  // Open app or focus window when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open the app
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
