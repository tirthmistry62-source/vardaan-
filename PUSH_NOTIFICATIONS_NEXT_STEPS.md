# Push Notifications - Next Steps to Enable

## What Was Implemented

✅ **Backend Support** (server.py)
- Firebase Cloud Messaging (FCM) integration
- Device token registration/unregistration endpoints
- Push notification sending function
- Vaccination reminder notifications

✅ **Database** (supabase_schema.sql)
- `device_tokens` table for storing FCM tokens
- Tracking device names, types, and activity status

✅ **Frontend Support** (React)
- Firebase initialization
- Device token registration on login/signup
- Service worker for background notifications
- Automatic device registration

✅ **Documentation**
- FIREBASE_SETUP.md - Detailed Firebase configuration
- VACCINATION_REMINDERS.md - Reminder system guide
- PUSH_NOTIFICATIONS_SETUP.md - Complete setup guide

## Getting Started (Follow These Steps)

### Step 1: Create Firebase Project (5 minutes)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Name it: **"Vardaan Plus"**
4. Accept terms and enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Get Credentials (5 minutes)

**Backend Credentials:**
1. Firebase Console → Project Settings (⚙️ icon)
2. Click **"Cloud Messaging"** tab
3. Copy **"Server API Key"** and **"Project ID"**

**Frontend Credentials:**
1. Firebase Console → Project Settings
2. Click **"General"** tab
3. Scroll to **"Your apps"** → Click **"Web"** app (or create one)
4. Copy config values (API Key, Project ID, etc.)
5. Go back to **"Cloud Messaging"** tab
6. Copy **"VAPID Key"** under "Web Push Certificates"

### Step 3: Configure Environment Variables (5 minutes)

**Backend: `backend/.env`**
```env
FIREBASE_API_KEY=<paste_server_api_key_here>
FIREBASE_PROJECT_ID=<paste_project_id_here>
```

**Frontend: `frontend/.env`**
```env
REACT_APP_FIREBASE_API_KEY=<paste_api_key_here>
REACT_APP_FIREBASE_AUTH_DOMAIN=<paste_project_id>.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=<paste_project_id_here>
REACT_APP_FIREBASE_STORAGE_BUCKET=<paste_project_id>.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<paste_sender_id_here>
REACT_APP_FIREBASE_APP_ID=<paste_app_id_here>
REACT_APP_FIREBASE_VAPID_KEY=<paste_vapid_key_here>
```

### Step 4: Install Frontend Dependencies (2 minutes)

```bash
cd frontend
npm install firebase
```

### Step 5: Update Database Schema (3 minutes)

In Supabase Dashboard:
1. Go to **SQL Editor** → **New query**
2. Paste this SQL:

```sql
create table if not exists device_tokens (
    id uuid primary key,
    parent_id uuid not null references parents(id) on delete cascade,
    fcm_token text not null unique,
    device_name text,
    device_type text,
    is_active boolean default true,
    last_used timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_device_tokens_parent on device_tokens(parent_id);
create index if not exists idx_device_tokens_active on device_tokens(is_active);

alter table device_tokens disable row level security;
```

3. Click **"Run"**

### Step 6: Restart Servers (2 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
# Stop if running (Ctrl+C)
# Then restart:
uvicorn server:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
# Stop if running (Ctrl+C)
# Then restart:
npm start
```

## Testing Push Notifications (10 minutes)

### Test 1: Verify Device Registration

1. Open app at `http://localhost:3000`
2. Click **"Create parent account"** or login
3. When prompted, **allow notifications**
4. Check browser console (F12 → Console)
5. Should see: **"Device registered for push notifications"**

### Test 2: Check Database

In Supabase Dashboard:

```sql
SELECT * FROM device_tokens;
```

Should show your registered device with FCM token.

### Test 3: Trigger Reminder Check

```bash
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders
```

Should return:
```json
{"reminders_created": 0}
```

(0 is ok if no children or no due vaccines)

### Test 4: Firebase Console Test Notification

1. Firebase Console → **Cloud Messaging**
2. Click **"New campaign"** → **"Firebase Notification message"**
3. Enter:
   - **Title:** "Test Notification"
   - **Message:** "This is a test"
4. Click **"Send test message"**
5. Select your registered device
6. Click **"Test"**
7. You should see the notification on your device/browser

## What Happens Next

### When User Logs In
- Browser asks for notification permission
- User approves → FCM token generated
- Token stored in `device_tokens` table
- Device is now ready to receive push notifications

### Daily at Midnight
- Cron job runs `check_and_create_vaccination_reminders()`
- For each child:
  - Calculate expected vaccines (UIP schedule)
  - Check if 15 or 7 days before due date
  - Skip if already recorded
  - Create in-app notification AND push notification
  - Send to all parent devices

### When Notification Arrives
- **Foreground** (app open): Toast notification appears in app
- **Background** (app closed): System notification appears
- User can click notification to open app

## Production Deployment

When ready for production:

1. **Update environment variables** on server
2. **Run database migrations** on production database
3. **Enable HTTPS** (required for service workers)
4. **Set up daily cron job** to run reminder check
5. **Test with real mobile devices**
6. **Monitor Firebase quota** (first 500K messages free)

## Troubleshooting

### Notifications not appearing

Check these in order:
1. Browser console (F12) for errors
2. Device tokens table - verify tokens are saved
3. Firebase config in `.env` - verify all values
4. Firebase project - verify Cloud Messaging is enabled
5. Service worker - DevTools → Application → Service Workers

### FCM Send Failed

Check:
- ✓ Backend logs for error messages
- ✓ `FIREBASE_API_KEY` is from "Server API Key" (not Web API Key)
- ✓ Device tokens are valid (should be 100+ characters)
- ✓ Parent has active device tokens

### Device Token Not Registered

Check:
- ✓ Parent is logged in (valid JWT token)
- ✓ Browser allows notifications
- ✓ `device_tokens` table exists in database
- ✓ Firebase is configured in `frontend/.env`

## Files to Review

Read these in order to understand the system:

1. **FIREBASE_SETUP.md** - Detailed Firebase setup with screenshots
2. **VACCINATION_REMINDERS.md** - How reminders are calculated
3. **PUSH_NOTIFICATIONS_SETUP.md** - Complete technical guide
4. **backend/server.py** - Search for `send_push_notification` function
5. **frontend/src/lib/firebase.js** - Frontend Firebase integration

## Key Files Modified

**Backend:**
- `server.py` - Added FCM support and device endpoints
- `supabase_schema.sql` - Added device_tokens table

**Frontend:**
- `src/lib/firebase.js` - Firebase initialization
- `src/pages/ParentLogin.jsx` - Device registration on login
- `src/pages/ParentRegister.jsx` - Device registration on signup
- `src/App.js` - Initialize Firebase
- `public/firebase-messaging-sw.js` - Background notifications

**Config:**
- `.env` (both frontend and backend) - Environment variables
- `.env.example` files - Templates for setup

## Quick Reference

| What | Where | When |
|------|-------|------|
| Device registers | ParentLogin/Register | User logs in/signs up |
| Reminder check runs | Cron job | Daily at midnight |
| Push sent to devices | send_push_notification() | When reminder is due |
| In-app notification | ParentNotifications page | Immediately |
| System notification | Browser/Phone | When app is backgrounded |

## Need Help?

1. Check the **PUSH_NOTIFICATIONS_SETUP.md** troubleshooting section
2. Review **Firebase logs** in Firebase Console
3. Check **backend logs** for FCM errors
4. Verify all **environment variables** are set correctly
5. Ensure **Firebase project has Cloud Messaging enabled**

## Success Checklist

- ✅ Firebase project created
- ✅ Credentials obtained
- ✅ `.env` files updated
- ✅ `firebase` npm package installed
- ✅ Database schema updated
- ✅ Servers restarted
- ✅ App opens without errors
- ✅ Device registers on login
- ✅ Device appears in `device_tokens` table
- ✅ Test notification received
- ✅ Push notifications enabled! 🎉

## Next: Enable Vaccination Reminders

Once push notifications are working:

1. Create test children in the app
2. Set up cron job to run daily
3. Wait for reminder dates or test manually
4. Receive push notifications on due dates!

See **VACCINATION_REMINDERS.md** for scheduling the cron job.
