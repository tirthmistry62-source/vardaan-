# Vaccination Reminder System

The Vardaan+ app now includes an automated vaccination reminder system that sends notifications to parents before vaccinations become due.

## How It Works

### Reminder Schedule
- **15 days before due date**: First reminder notification
- **7 days before due date**: Second reminder notification (urgent)

### UIP Schedule
The system uses the India Universal Immunization Program (UIP) schedule, which includes:
- BCG (at birth)
- Hepatitis B (0, 6 months)
- Rotavirus (0, 4, 8 weeks)
- OPV/IPV (6, 10, 14, 18, 24 weeks and 36 months)
- PCV (6, 10, 16 weeks)
- Pentavalent (6, 10, 14, 18 weeks)
- Typhoid (9 months)
- Measles (9, 18 months)
- DPT Booster (18, 24, 36 months)
- And more...

## Setting Up Automated Reminders

### Option 1: Linux/Mac (Cron)

1. **Install cron job** to run the reminder check daily at midnight:
   ```bash
   crontab -e
   ```

2. **Add this line** to your crontab:
   ```bash
   0 0 * * * cd /path/to/vardaan-/backend && /usr/bin/python3 vaccination_reminder_cron.py >> /var/log/vardaan-reminders.log 2>&1
   ```

3. **Verify the cron job** is set up:
   ```bash
   crontab -l
   ```

### Option 2: Windows (Task Scheduler)

1. **Open Task Scheduler** (search for "Task Scheduler" in Start menu)

2. **Create a new task:**
   - Name: "Vardaan Vaccination Reminders"
   - Trigger: Daily at 00:00 (midnight)
   - Action: Start a program
     - Program: `C:\path\to\python.exe`
     - Arguments: `C:\path\to\vardaan-\backend\vaccination_reminder_cron.py`
     - Start in: `C:\path\to\vardaan-\backend`

3. **Run the task manually to test:**
   - Right-click the task → Run

### Option 3: Manual Trigger (Testing/Development)

Run the reminder check manually by calling the API endpoint:

```bash
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders
```

Or using Python:
```bash
cd backend
python vaccination_reminder_cron.py
```

## Database Schema

### vaccination_reminders Table
Tracks which reminders have been sent to prevent duplicates.

```sql
CREATE TABLE vaccination_reminders (
    id uuid primary key,
    child_id uuid not null,
    vaccine_code text not null,
    vaccine_name text not null,
    dose text not null,
    due_date date not null,
    reminder_days_before integer not null,  -- 15 or 7
    notification_id uuid,
    created_at timestamptz not null
);
```

## API Endpoint

### POST `/api/admin/check-vaccination-reminders`

Manually trigger a vaccination reminder check (useful for testing or immediate execution).

**Request:**
```
POST /api/admin/check-vaccination-reminders
```

**Response:**
```json
{
    "reminders_created": 5
}
```

## Example Notification

### 15-Day Reminder
**Title:** "BCG due soon"
**Body:** "BCG (Single dose) is due for Baby Name in 15 days (on January 15, 2026). Schedule an appointment with your doctor."

### 7-Day Reminder
**Title:** "BCG due very soon!"
**Body:** "BCG (Single dose) is due for Baby Name in 7 days (on January 15, 2026). Please schedule an appointment immediately."

## How Reminders Are Calculated

1. **Get child's DOB** from child profile
2. **Calculate due dates** using UIP schedule (e.g., BCG at birth = today + 0 days, OPV dose 1 at 6 weeks = DOB + 6 weeks)
3. **Check if vaccine already recorded** (skip if it is)
4. **Calculate reminder dates** (due_date - 15 days, due_date - 7 days)
5. **Create notifications** if today matches reminder date
6. **Track in vaccination_reminders** table to prevent duplicate notifications

## Testing the System

### Step 1: Create a test child with today's DOB
```bash
# In parent dashboard, create a child with birth date = today
# This means all vaccines are "due today"
```

### Step 2: Trigger the reminder check
```bash
curl -X POST http://localhost:8001/api/admin/check-vaccination-reminders
```

### Step 3: Check notifications
```bash
# Parent should see notifications in their notification inbox
# 15-day reminders will show immediately (since all vaccines are due today)
```

### Step 4: Verify database
Check the `vaccination_reminders` and `notifications` tables:
```sql
SELECT * FROM vaccination_reminders WHERE child_id = 'test-child-id';
SELECT * FROM notifications WHERE child_id = 'test-child-id';
```

## Troubleshooting

### Reminders not appearing
1. **Check timezone**: Ensure server timezone matches expected reminder time
2. **Check database**: Verify `vaccination_reminders` table exists and has data
3. **Run manually**: Test with `python vaccination_reminder_cron.py`
4. **Check logs**: Look at cron job logs (Linux: `/var/log/vardaan-reminders.log`)

### Duplicate reminders
- The `vaccination_reminders` table prevents duplicates
- If duplicates still appear, check if table got truncated or if a reminder was deleted

### Wrong due dates
- Verify child's date of birth is correct
- Check UIP_SCHEDULE in server.py matches expected schedule
- Test the date calculation with a known DOB

## Production Deployment

For production:

1. **Run on a reliable server** with consistent timezone
2. **Set up backup cron on secondary server** (in case primary fails)
3. **Monitor cron job** with email notifications on failure
4. **Log all executions** to track reminder history
5. **Test monthly** to ensure system is working

Example cron with error notifications:
```bash
0 0 * * * cd /path/to/backend && python vaccination_reminder_cron.py >> /var/log/vardaan-reminders.log 2>&1 || echo "Vardaan reminder check failed" | mail -s "Vardaan Alert" admin@example.com
```

## Files

- `backend/server.py` - Main server with reminder functions
- `backend/vaccination_reminder_cron.py` - Cron script to run the checker
- `backend/supabase_schema.sql` - Database schema including vaccination_reminders table
- This file: `VACCINATION_REMINDERS.md` - Setup guide

## Support

For issues or questions, refer to:
- Logs in `/var/log/vardaan-reminders.log`
- Database queries to check vaccination_reminders table
- API endpoint response
