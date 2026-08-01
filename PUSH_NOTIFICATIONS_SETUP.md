# Push Notifications Setup - Complete Guide

Push notifications alert parents 15 and 7 days before vaccinations are due, directly on their devices.

## Quick Start (5 Steps)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: "Vardaan Plus"
4. Enable Google Analytics (optional)
5. Click "Create project" and wait for setup

### Step 2: Get Firebase Credentials

**For Backend:**
1. Firebase Console → Project Settings (gear icon)
2. Go to "Cloud Messaging" tab
3. Copy the **Server API Key** and **Project ID**
4. Add to `backend/.env`:
   ```env
   FIREBASE_API_KEY=<your_server_api_key>
   FIREBASE_PROJECT_ID=<your_project_id>
   ```

**For Frontend:**
1. Firebase Console → Project Settings
2. Go to "General" tab
3. Scroll down to "Your apps" section
4. Copy Web config values (if no web app, click "Add app")
5. Also copy **VAPID Key** from Cloud Messaging tab
6. Add to `frontend/.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=<your_api_key>
   REACT_APP_FIREBASE_AUTH_DOMAIN=<your_project>.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=<your_project_id>
   REACT_APP_FIREBASE_STORAGE_BUCKET=<your_project>.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
   REACT_APP_FIREBASE_APP_ID=<your_app_id>
   REACT_APP_FIREBASE_VAPID_KEY=<your_vapid_key>
   ```

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install firebase
```

### Step 4: Update Database Schema

In Supabase Dashboard → SQL Editor → New query:

```sql
-- Device Tokens (for push notifications via Firebase)
create table if not exists device_tokens (
    id uuid primary key,
    parent_id uuid not null references parents(id) on delete cascade,
    fcm_token text not null unique,
    device_name text,
    device_type text,  -- 'ios' or 'android'
    is_active boolean default true,
    last_used timestamptz,
    created_at timestamptz not null default now()
);
create index if not exists idx_device_tokens_parent on device_tokens(parent_id);
create index if not exists idx_device_tokens_active on device_tokens(is_active);

alter table device_tokens disable row level security;
```

### Step 5: Restart Servers

```bash
# Backend
cd backend
uvicorn server:app --reload --port 8001

# Frontend (in new terminal)
cd frontend
npm start
```

## How It Works

### User Journey

1. **User logs in** → Browser requests notification permission
2. **User approves** → Firebase generates FCM token
3. **Token sent to backend** → Stored in `device_tokens` table
4. **Vaccination reminder check runs** (daily) → Finds due vaccines
5. **Backend sends push notification** → Appears on user's device
6. **User sees notification** → Can click to open app

### Push Notification Flow

```
┌─────────────────────────────────────────────┐
│  Daily Cron Job                             │
│  check_and_create_vaccination_reminders()   │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│  For each child:                            │
│  - Calculate vaccine due dates (UIP)        │
│  - Check if 15 or 7 days before due date    │
│  - Skip if already recorded                 │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│  send_push_notification()                   │
│  - Get parent's device tokens               │
│  - Send FCM message to each device          │
│  - Create in-app notification               │
│  - Track in vaccination_reminders table     │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│  User's Device                              │
│  ✓ Push notification appears                │
│  ✓ Sound/vibration plays                    │
│  ✓ User can tap to open app                 │
└─────────────────────────────────────────────┘
```

## Files Created/Modified

### Backend Files
- `backend/server.py` - Added FCM send function and device token endpoints
- `backend/supabase_schema.sql` - Added device_tokens table
- `backend/.env.example` - Template for Firebase credentials

### Frontend Files
- `frontend/src/lib/firebase.js` - Firebase initialization and token management
- `frontend/src/hooks/usePushNotifications.js` - React hook for push notifications
- `frontend/src/pages/ParentLogin.jsx` - Register device on login
- `frontend/src/pages/ParentRegister.jsx` - Register device on signup
- `frontend/public/firebase-messaging-sw.js` - Service worker for background notifications
- `frontend/.env.example` - Template for Firebase credentials
- `frontend/src/App.js` - Initialize Firebase on app start

### Documentation
- `FIREBASE_SETUP.md` - Detailed Firebase setup guide
- `VACCINATION_REMINDERS.md` - Vaccination reminder system guide
- `PUSH_NOTIFICATIONS_SETUP.md` - This file

## API Endpoints

### Register Device Token

**POST** `/api/parent/device-token`

Called automatically when parent logs in/registers.

```bash
curl -X POST http://localhost:8001/api/parent/device-token \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fcm_token": "eW3zr...",
    "device_name": "iPhone 14",
    "device_type": "ios"
  }'
```

### Unregister Device Token

**POST** `/api/parent/device-token/unregister`

Called on logout (optional).

```bash
curl -X POST http://localhost:8001/api/parent/device-token/unregister \
  -H "Authorization: Bearer <token>" \
  -d '{"fcm_token": "eW3zr..."}'
```

### List Device Tokens

**GET** `/api/parent/device-tokens`

See all registered devices for current parent.

```bash
curl http://localhost:8001/api/parent/device-tokens \
  -H "Authorization: Bearer <token>"
```

### Trigger Reminder Check

**POST** `/api/admin/check-vaccination-reminders`

Manually trigger the reminder check (for testing).

```bash
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders
```

## Testing Push Notifications

### 1. Test Device Registration

```bash
# Login as parent and check logs
# Should see: "Device registered for push notifications"

# Or check via API:
curl http://localhost:8001/api/parent/device-tokens \
  -H "Authorization: Bearer <parent_token>"
```

### 2. Test Notification Sending

```bash
# Trigger reminder check
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders

# Should return: {"reminders_created": N}
```

### 3. Firebase Console Test

1. Firebase Console → Cloud Messaging
2. Click "Send Test Message"
3. Enter notification title and body
4. Select your app and device
5. Click "Test"

### 4. Check Device Tokens in Database

In Supabase Dashboard:

```sql
-- View all registered devices
SELECT * FROM device_tokens;

-- View for specific parent
SELECT * FROM device_tokens 
WHERE parent_id = '<parent_id>';

-- View reminders created
SELECT * FROM vaccination_reminders 
ORDER BY created_at DESC 
LIMIT 10;
```

## Troubleshooting

### Notifications not appearing

**Problem:** No notifications received even after setup

**Solutions:**
1. **Check permission**: Open browser DevTools → Application → Check notification permission
2. **Check service worker**: DevTools → Application → Service Workers → Should show "firebase-messaging-sw.js"
3. **Check console**: DevTools → Console → Look for "Device registered..." or errors
4. **Check device token**: Call `/api/parent/device-tokens` → Should show registered devices
5. **Check Firebase config**: Verify all env vars match Firebase Console

### FCM Send Failed

**Problem:** Backend logs show "FCM send failed"

**Solutions:**
1. Check `FIREBASE_API_KEY` is correct (from Cloud Messaging tab)
2. Check `FIREBASE_PROJECT_ID` is correct
3. Verify FCM token is valid (152+ characters)
4. Check Firebase project has Cloud Messaging enabled
5. Check quota in Firebase Console

### Service Worker Not Registering

**Problem:** DevTools shows no service worker

**Solutions:**
1. Verify `firebase-messaging-sw.js` exists in `frontend/public/`
2. Check browser console for registration errors
3. Try clearing browser cache: DevTools → Application → Storage → Clear site data
4. Service workers require HTTPS (except localhost)

### Device Token Not Saved

**Problem:** Call to `/parent/device-token` fails

**Solutions:**
1. Check parent is logged in (valid bearer token)
2. Check `device_tokens` table exists in Supabase
3. Check FCM token is valid (should be 100+ characters)
4. Check backend is running and accessible

### Duplicate Notifications

**Problem:** Same notification received multiple times

**Solutions:**
1. FCM token should be unique per device
2. Check `vaccination_reminders` table for duplicates
3. Clear `device_tokens` table if tokens are stale
4. Mark old tokens as inactive: `UPDATE device_tokens SET is_active = false WHERE ...`

## Production Checklist

- [ ] Set `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` in production backend
- [ ] Set all `REACT_APP_FIREBASE_*` variables in production frontend
- [ ] Update `firebase-messaging-sw.js` with production Firebase config
- [ ] Run database schema in production Supabase
- [ ] Test push notifications with production accounts
- [ ] Set up cron job to run vaccination reminder check daily
- [ ] Monitor Firebase quota usage
- [ ] Set up error logging for push notification failures
- [ ] Test on actual mobile devices (iOS and Android)

## Performance Notes

- Firebase Cloud Messaging is free for up to 500,000 messages per month
- After 500,000 messages, additional messages cost $0.50 per 1 million messages
- Push notifications are fire-and-forget (not guaranteed delivery)
- Delivery typically happens within seconds for active connections

## Advanced Setup

### Using Service Account (More Secure)

For production, use a Service Account JSON instead of API Key:

1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Set environment variable: `FIREBASE_SERVICE_ACCOUNT_JSON=/path/to/service-account.json`

### Custom Notification Sounds

Edit `firebase-messaging-sw.js` to use custom sound:

```javascript
const notificationOptions = {
  sound: 'https://your-domain.com/notification-sound.wav',
  // ... other options
};
```

### Notification Actions

Add action buttons to notifications:

```javascript
const notificationOptions = {
  actions: [
    {
      action: 'open_app',
      title: 'Open App',
      icon: '/icon-open.png'
    },
    {
      action: 'dismiss',
      title: 'Dismiss',
      icon: '/icon-close.png'
    }
  ]
};
```

## Support

For issues, check:
1. Firebase Console → Cloud Messaging → View analytics
2. Backend logs: Look for FCM send errors
3. Browser console: DevTools → Console tab
4. Service worker logs: DevTools → Application → Service Workers
5. Database: Check `device_tokens` and `vaccination_reminders` tables

## References

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Web SDK](https://firebase.google.com/docs/reference/js/messaging)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
