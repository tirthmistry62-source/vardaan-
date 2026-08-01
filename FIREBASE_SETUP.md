# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up push notifications for the Vardaan+ app using Firebase Cloud Messaging.

## Overview

Push notifications are sent to parents' devices when:
- A vaccination is due in 15 days
- A vaccination is due in 7 days (urgent reminder)
- A vaccination is recorded by a doctor

## Step 1: Create a Firebase Project

### 1.1 Go to Firebase Console
- Visit [https://console.firebase.google.com](https://console.firebase.google.com)
- Click **"Create a project"** or **"Add project"**

### 1.2 Project Details
- **Project name**: `Vardaan Plus` (or your preferred name)
- Accept the terms and click **"Continue"**
- **Google Analytics**: You can enable or disable (optional)
- Click **"Create project"**

### 1.3 Wait for Setup
- Firebase will set up your project (takes 1-2 minutes)
- Click **"Continue"** when ready

## Step 2: Set Up Cloud Messaging

### 2.1 Enable Cloud Messaging
1. In Firebase Console, go to **Build → Cloud Messaging**
2. Click **"Enable Cloud Messaging"**
3. You'll see the **Server API key** and **Project ID** (save these)

### 2.2 Create a Service Account (for production)
1. Go to **Project Settings** (gear icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate New Private Key"**
4. Save the JSON file securely (needed for production)

## Step 3: Configure Backend

### 3.1 Update `.env` File

Add these to your `backend/.env` file:

```env
# Firebase Cloud Messaging
FIREBASE_API_KEY=your_server_api_key_here
FIREBASE_PROJECT_ID=your-project-id-here
```

**Where to find these:**
- **FIREBASE_API_KEY**: Firebase Console → Project Settings → Cloud Messaging tab → "Server API Key"
- **FIREBASE_PROJECT_ID**: Firebase Console → Project Settings → General tab → "Project ID"

### 3.2 Restart Backend Server

```bash
# Stop the running server (Ctrl+C)
# Then restart:
cd backend
uvicorn server:app --reload --port 8001
```

Verify FCM is enabled by checking the terminal output or calling the API:
```bash
curl http://localhost:8001/
# Should show status: ok
```

## Step 4: Configure Frontend (React)

### 4.1 Install Firebase SDK

```bash
cd frontend
npm install firebase
```

### 4.2 Create Firebase Configuration

Create `frontend/src/lib/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase config from your Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Request permission and get token
export async function requestFCMToken() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      return token;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  return null;
}

// Handle incoming messages
export function setupMessageListener(callback) {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    callback(payload);
  });
}
```

### 4.3 Get Web Push Credentials

1. Firebase Console → Project Settings → Cloud Messaging
2. Copy:
   - **Web Push Certificates → Key pair** (this is your VAPID key)
   - **Web API Key**
   - **Sender ID** (in Project Settings → General)

3. Update the `firebaseConfig` in `frontend/src/lib/firebase.js` with your values

### 4.4 Create public/firebase-messaging-sw.js

This service worker handles notifications when the app is in background:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'vaccination-reminder',
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### 4.5 Register Service Worker

In `frontend/src/index.js` or `App.js`:

```javascript
// Register FCM service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}
```

## Step 5: Register Device Token on Login/Signup

### 5.1 Update ParentLogin.jsx

```javascript
import { requestFCMToken } from '@/lib/firebase';

const submit = async (e) => {
  e.preventDefault();
  // ... existing login code ...
  
  try {
    const { data } = await api.post("/parent/login", { aadhaar, password });
    setSession({ token: data.token, role: "parent", user: data.parent });
    
    // Register device for push notifications
    const fcmToken = await requestFCMToken();
    if (fcmToken) {
      try {
        await api.post("/parent/device-token", {
          fcm_token: fcmToken,
          device_name: navigator.userAgent.split('(')[1].split(')')[0],
          device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'web',
        });
        console.log('Device registered for push notifications');
      } catch (tokenError) {
        console.warn('Could not register device token:', tokenError);
      }
    }
    
    toast.success(`Welcome, ${data.parent.full_name.split(" ")[0]}`);
    nav("/parent/dashboard", { replace: true });
  } catch (err) {
    toast.error(err?.response?.data?.detail || "Login failed");
  } finally {
    setLoading(false);
  }
};
```

### 5.2 Update ParentRegister.jsx

Add the same FCM registration code after successful registration.

## Step 6: Handle Background Messages

### 6.1 Setup Message Listener

In `frontend/src/components/AppShell.jsx` or a hook:

```javascript
import { useEffect } from 'react';
import { setupMessageListener } from '@/lib/firebase';

export function useNotificationListener() {
  useEffect(() => {
    setupMessageListener((payload) => {
      console.log('Notification received:', payload);
      // You can show a toast or update UI here
      // For example:
      // toast.info(payload.notification.title);
    });
  }, []);
}
```

## Step 7: Update Database Schema

Run this SQL in Supabase Dashboard:

```sql
-- Device Tokens (for push notifications via Firebase)
CREATE TABLE IF NOT EXISTS device_tokens (
    id uuid PRIMARY KEY,
    parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    fcm_token text NOT NULL UNIQUE,
    device_name text,
    device_type text,  -- 'ios' or 'android'
    is_active boolean DEFAULT true,
    last_used timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_parent ON device_tokens(parent_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_active ON device_tokens(is_active);

-- Disable RLS
ALTER TABLE device_tokens DISABLE ROW LEVEL SECURITY;
```

## Step 8: Test Push Notifications

### 8.1 Test Backend Endpoint

```bash
# Trigger vaccination reminders check
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders

# Should return:
# {"reminders_created": 5}
```

### 8.2 Test on Web

1. Open your app at `http://localhost:3000`
2. Log in as a parent
3. Accept the notification permission popup
4. Go to parent dashboard
5. Check if device is registered:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:8001/api/parent/device-tokens
   ```

### 8.3 Send Test Notification

Use Firebase Console:
1. Go to **Engage → Cloud Messaging**
2. Click **"New campaign"** → **"Firebase Notification message"**
3. Enter title and message
4. Select your app
5. Click **"Send test message"**
6. Select your device and click **"Test"**

## API Endpoints

### Register Device Token

**POST** `/api/parent/device-token`

```json
{
  "fcm_token": "eW3zr...",
  "device_name": "iPhone 14",
  "device_type": "ios"
}
```

### Unregister Device Token

**POST** `/api/parent/device-token/unregister`

```json
{
  "fcm_token": "eW3zr..."
}
```

### List Device Tokens

**GET** `/api/parent/device-tokens`

Returns list of all registered devices for the parent.

## Troubleshooting

### Notifications not appearing

1. **Check permission**: Browser must have notification permission
2. **Check service worker**: Open DevTools → Application → Service Workers
3. **Check FCM token**: Open DevTools Console → look for "Device registered..." message
4. **Check Firebase config**: Verify all keys are correct in `firebase.js`
5. **Check backend logs**: Look for FCM send errors

### FCM send failed

1. **Check API key**: Verify `FIREBASE_API_KEY` is correct in `.env`
2. **Check project ID**: Verify `FIREBASE_PROJECT_ID` is correct in `.env`
3. **Check device token**: Ensure token is valid (usually 152+ characters)
4. **Check quota**: Firebase has rate limits (see console for details)

### Service Worker not registering

1. **Check manifest**: Ensure `firebase-messaging-sw.js` exists in `public/`
2. **Check HTTPS**: Service workers require HTTPS (except localhost)
3. **Check path**: Path must be `/firebase-messaging-sw.js`

### Token registration fails

1. **Check permissions**: Browser must allow notifications
2. **Check token**: FCM token might be invalid
3. **Check server**: Backend might be down or throwing error
4. **Check database**: `device_tokens` table might not exist (run schema SQL)

## Production Deployment

### Security Considerations

1. **Use Service Account JSON** instead of Server API Key:
   - More secure for backend
   - Can set role-based permissions
   
2. **Rotate VAPID Key regularly**

3. **Monitor FCM quota** in Firebase Console

4. **Enable request validation** on Firebase Console

### Environment Setup

Set these in production:
```env
FIREBASE_API_KEY=prod_api_key
FIREBASE_PROJECT_ID=prod-project-id
# Service Account JSON (for advanced setup)
FIREBASE_SERVICE_ACCOUNT_JSON=/path/to/service-account.json
```

### Monitor

- Firebase Console → Analytics → Messaging
- Monitor delivery rates
- Check error logs
- Set up alerts for failed sends

## Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Guide](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Firebase Messaging SDK Reference](https://firebase.google.com/docs/reference/js/messaging)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
