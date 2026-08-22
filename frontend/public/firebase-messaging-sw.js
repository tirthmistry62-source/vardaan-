// Firebase messaging service worker
// Handles background notifications when app is closed or in background

importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

// Initialize Firebase with config
firebase.initializeApp({
  apiKey: "AIzaSyBtIc2lvMevKY53G18nBXYUhs4f9U60hDk",
  authDomain: "vardaan-4652a.firebaseapp.com",
  projectId: "vardaan-4652a",
  storageBucket: "vardaan-4652a.firebasestorage.app",
  messagingSenderId: "811894366078",
  appId: "1:811894366078:web:30dbcf1b006e6237721d2f"
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
