"""
Vaccination Reminder Cron Job Script

This script should be run daily (e.g., via cron at midnight) to check for upcoming vaccinations
and create reminder notifications for parents.

Usage (Linux/Mac cron):
    0 0 * * * cd /path/to/vardaan-/backend && python vaccination_reminder_cron.py

Usage (Windows Task Scheduler):
    Create a task to run: python vaccination_reminder_cron.py
"""
import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
ENV_PATH = ROOT_DIR / '.env'
if ENV_PATH.is_file():
    load_dotenv(ENV_PATH)

# Import server functions
sys.path.insert(0, str(ROOT_DIR))
from server import check_and_create_vaccination_reminders, http

async def main():
    """Run the vaccination reminder check"""
    print("Starting vaccination reminder check...")
    try:
        result = await check_and_create_vaccination_reminders()
        print(f"✓ Vaccination reminder check complete: {result}")
    except Exception as e:
        print(f"✗ Error during vaccination reminder check: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await http.aclose()
        print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
