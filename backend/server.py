"""Vardaan+ backend - Supabase Postgres via REST API (PostgREST)."""
import re

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles
import os
import logging
import uuid
import random
import bcrypt
import jwt
from workers import env
import httpx
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, timezone, timedelta, date
from dateutil.relativedelta import relativedelta
import json
try:
    import firebase_admin
    from firebase_admin import credentials, messaging
except ImportError:
    firebase_admin = None
    credentials = None
    messaging = None

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

ROOT_DIR = Path(__file__).parent
ENV_PATH = ROOT_DIR / '.env'
if ENV_PATH.is_file():
    load_dotenv(ENV_PATH)
else:
    load_dotenv(ENV_PATH / 'backend' / '.env')

SUPABASE_URL = env.SUPABASE_URL.rstrip('/')
SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
REST_BASE = f"{SUPABASE_URL}/rest/v1"

JWT_SECRET = env.JWT_SECRET
JWT_ALGO = 'HS256'
JWT_TTL_HOURS = 24 * 30

# Firebase Cloud Messaging (FCM) Configuration
FCM_SERVICE_ACCOUNT_FILE = ROOT_DIR / "firebase-service-account.json"

if firebase_admin is not None and not firebase_admin._apps and FCM_SERVICE_ACCOUNT_FILE.exists():
    cred = credentials.Certificate(str(FCM_SERVICE_ACCOUNT_FILE))
    firebase_admin.initialize_app(cred)

FCM_PROJECT_ID = env.FIREBASE_PROJECT_ID


_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}
http = httpx.AsyncClient(timeout=30, headers=_headers, base_url=REST_BASE)

app = FastAPI(title="Vardaan+ API")
api = APIRouter(prefix="/api")

# ------------- Supabase helpers ------------

async def sb_select(table: str, query: str = "select=*") -> List[dict]:
    r = await http.get(f"/{table}?{query}")
    if r.status_code >= 400:
        raise HTTPException(500, f"DB error: {r.text}")
    return r.json()

async def sb_find_one(table: str, filters: str) -> Optional[dict]:
    rows = await sb_select(table, f"select=*&{filters}&limit=1")
    return rows[0] if rows else None

async def sb_insert(table: str, row: dict) -> dict:
    r = await http.post(f"/{table}", json=row)
    if r.status_code >= 400:
        raise HTTPException(500, f"DB error: {r.text}")
    return r.json()[0]

async def sb_update(table: str, filters: str, updates: dict) -> List[dict]:
    r = await http.patch(f"/{table}?{filters}", json=updates)
    if r.status_code >= 400:
        raise HTTPException(500, f"DB error: {r.text}")
    return r.json()

async def sb_delete(table: str, filters: str) -> None:
    r = await http.delete(f"/{table}?{filters}")
    if r.status_code >= 400:
        raise HTTPException(500, f"DB error: {r.text}")

def eq(field: str, value: Any) -> str:
    return f"{field}=eq.{value}"

# ------------- Utilities -------------

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def make_token(user_id: str, role: str) -> str:
    payload = {
        'sub': user_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_TTL_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


security = HTTPBearer(auto_error=False)

async def get_current(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Missing bearer token"
        )

    token = credentials.credentials
    data = decode_token(token)

    return {
        'user_id': data['sub'],
        'role': data['role']
    }


async def require_parent(cur=Depends(get_current)) -> dict:
    if cur['role'] != 'parent':
        raise HTTPException(status_code=403, detail="Parent access only")
    return cur

async def require_doctor(cur=Depends(get_current)) -> dict:
    if cur['role'] != 'doctor':
        raise HTTPException(status_code=403, detail="Doctor access only")
    return cur

def strip_secret(row: dict) -> dict:
    return {k: v for k, v in row.items() if k != 'password_hash'}

# ------------- Models -------------

class ParentRegisterIn(BaseModel):
    full_name: str
    aadhaar: str
    phone: str
    email: str 
    password: str

class ParentLoginIn(BaseModel):
    aadhaar: str
    password: str

class DoctorRegisterIn(BaseModel):
    doctor_name: str
    phone: str
    email: str 
    password: str
    clinic_name: str
    clinic_address: str
    profile_photo_url: Optional[str] = None

class DoctorLoginIn(BaseModel):
    phone: str
    password: str

class ChildCreateIn(BaseModel):
    name: str
    dob: str
    gender: str
    weight_kg: float
    mother_aadhaar: Optional[str] = None
    father_aadhaar: Optional[str] = None
    child_aadhaar: Optional[str] = None

class VaccinationRecordIn(BaseModel):
    child_id: str
    weight_kg: float
    entries: List[dict]
    access_code: Optional[str] = None

class ParentVaccinationRecordIn(BaseModel):
    child_id: str
    vaccine_code: str
    vaccine_name: str
    dose: str
    date_given: str
    weight_kg: Optional[float] = None
    doctor_name: Optional[str] = None
    remarks: Optional[str] = None

class DoctorAccessCodeIn(BaseModel):
    access_code: str

class ParentUpdateIn(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None

class DoctorUpdateIn(BaseModel):
    doctor_name: Optional[str] = None
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    profile_photo_url: Optional[str] = None
    language: Optional[str] = None

class ChildUpdateIn(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    mother_aadhaar: Optional[str] = None
    father_aadhaar: Optional[str] = None
    child_aadhaar: Optional[str] = None

class ConfirmDeleteIn(BaseModel):
    confirm_phrase: str

class DeviceTokenIn(BaseModel):
    fcm_token: str
    device_name: Optional[str] = None
    device_type: Optional[str] = None  # 'ios' or 'android'

class VaccinationDocumentUploadIn(BaseModel):
    vaccination_id: str
    document_type: Optional[str] = None  # 'certificate', 'receipt', 'photo', 'other'

async def send_push_notification(
    parent_id: str,
    title: str,
    body: str,
    data: Optional[dict] = None
) -> bool:
    """
    Send a push notification to all registered devices for a parent.
    Uses Firebase Admin SDK.
    """
    try:
        device_tokens = await sb_select(
            'device_tokens',
            f"select=fcm_token&{eq('parent_id', parent_id)}&is_active=eq.true"
        )

        if not device_tokens:
            logger.info(f"No active device tokens found for parent {parent_id}")
            return False

        success_count = 0

        for device in device_tokens:
            token = device["fcm_token"]

            try:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=title,
                        body=body,
                    ),
                    data={
                        str(k): str(v)
                        for k, v in (data or {}).items()
                    },
                    android=messaging.AndroidConfig(
                        priority="high",
                        notification=messaging.AndroidNotification(
                            sound="default",
                            channel_id="vaccination_reminders",
                        ),
                    ),
                    apns=messaging.APNSConfig(
                        payload=messaging.APNSPayload(
                            aps=messaging.Aps(
                                alert=messaging.ApsAlert(
                                    title=title,
                                    body=body,
                                ),
                                sound="default",
                                badge=1,
                            )
                        )
                    ),
                    token=token,
                )

                messaging.send(message)
                success_count += 1

            except Exception as e:
                logger.error(
                    f"FCM send failed for token {token[:20]}...: {e}"
                )

        logger.info(
            f"Sent push notification to "
            f"{success_count}/{len(device_tokens)} devices "
            f"for parent {parent_id}"
        )

        return success_count > 0

    except Exception as e:
        logger.error(f"Error in send_push_notification: {e}")
        return False

# ------------- UIP Vaccination Schedule (India) -------------
# Schedule defines vaccines and their due dates (months after birth)
UIP_SCHEDULE = {
    "BCG": [0],  # At birth
    "OPV": [0, 6, 10, 14, 18, 24, 36],  # Multiple doses
    "PCV": [6, 10, 16],  # Pneumococcal conjugate vaccine
    "Rotavirus": [0, 4, 8],  # Rotavirus vaccine
    "IPV": [14, 18, 24],  # Inactivated polio vaccine
    "Pentavalent": [6, 10, 14, 18],  # Diphtheria, tetanus, pertussis, hepatitis B, Hib
    "Hepatitis B": [0, 6],  # Hepatitis B vaccine
    "Typhoid": [9],  # Typhoid vaccine
    "Measles": [9, 18],  # Measles vaccine
    "DPT": [18, 24, 36],  # Diphtheria, pertussis, tetanus booster
    "Varicella": [12],  # Chickenpox vaccine
    "JE": [9, 16],  # Japanese Encephalitis
    "MMR": [18],  # Measles, Mumps, Rubella
}

PARENT_VACCINE_SCHEDULE = {
    "BCG": {
        "name": "BCG",
        "dose": "Single",
    },
    "OPV-0": {
        "name": "OPV",
        "dose": "Dose 0",
    },
    "HepB-Birth": {
        "name": "Hepatitis B",
        "dose": "Birth",
    },
    "OPV-1": {
        "name": "OPV",
        "dose": "Dose 1",
    },
    "Penta-1": {
        "name": "Pentavalent",
        "dose": "Dose 1",
    },
    "Rota-1": {
        "name": "Rotavirus",
        "dose": "Dose 1",
    },
    "IPV-1": {
        "name": "IPV",
        "dose": "Dose 1",
    },
    "PCV-1": {
        "name": "PCV",
        "dose": "Dose 1",
    },
    "OPV-2": {
        "name": "OPV",
        "dose": "Dose 2",
    },
    "Penta-2": {
        "name": "Pentavalent",
        "dose": "Dose 2",
    },
    "Rota-2": {
        "name": "Rotavirus",
        "dose": "Dose 2",
    },
    "OPV-3": {
        "name": "OPV",
        "dose": "Dose 3",
    },
    "Penta-3": {
        "name": "Pentavalent",
        "dose": "Dose 3",
    },
    "Rota-3": {
        "name": "Rotavirus",
        "dose": "Dose 3",
    },
    "IPV-2": {
        "name": "IPV",
        "dose": "Dose 2",
    },
    "PCV-2": {
        "name": "PCV",
        "dose": "Dose 2",
    },
    "MR-1": {
        "name": "Measles-Rubella",
        "dose": "Dose 1",
    },
    "PCV-B": {
        "name": "PCV",
        "dose": "Booster",
    },
    "VitA-1": {
        "name": "Vitamin A",
        "dose": "Dose 1",
    },
    "JE-1": {
        "name": "JE",
        "dose": "Dose 1",
    },
    "DPT-B1": {
        "name": "DPT",
        "dose": "Booster 1",
    },
    "OPV-B": {
        "name": "OPV",
        "dose": "Booster",
    },
    "MR-2": {
        "name": "Measles-Rubella",
        "dose": "Dose 2",
    },
    "VitA-2": {
        "name": "Vitamin A",
        "dose": "Dose 2",
    },
    "JE-2": {
        "name": "JE",
        "dose": "Dose 2",
    },
    "DPT-B2": {
        "name": "DPT",
        "dose": "Booster 2",
    },
    "Td-10": {
        "name": "Td",
        "dose": "10 years",
    },
    "Td-16": {
        "name": "Td",
        "dose": "16 years",
    },
}

def get_vaccine_due_dates(child_dob: str) -> List[dict]:
    """
    Calculate vaccine due dates based on child's date of birth.
    Returns list of due vaccines with their expected dates.
    """
    try:
        dob = datetime.strptime(child_dob, "%Y-%m-%d").date()
    except:
        return []
    
    due_vaccines = []
    today = date.today()
    
    for vaccine_name, months_list in UIP_SCHEDULE.items():
        for i, months in enumerate(months_list):
            dose_num = i + 1
            # Calculate due date (add months to DOB)
            try:
                due_date = dob + relativedelta(months=months)
                dose_label = f"Dose {dose_num}" if len(months_list) > 1 else "Single dose"
                
                due_vaccines.append({
                    'vaccine_name': vaccine_name,
                    'vaccine_code': vaccine_name.lower().replace(' ', '_'),
                    'dose': dose_label,
                    'due_date': due_date,
                    'months_after_birth': months,
                    'is_overdue': due_date < today,
                })
            except:
                pass
    
    return due_vaccines

async def check_and_create_vaccination_reminders():
    """
    Background job to check for upcoming vaccines and create reminder notifications.
    Should be called periodically (e.g., daily via cron or APScheduler).
    """
    today = date.today()
    tomorrow = today + timedelta(days=1)
    
    # Get all children
    all_children = await sb_select('children', 'select=id,dob,mother_aadhaar,father_aadhaar')
    
    reminder_count = 0
    
    for child in all_children:
        child_id = child['id']
        dob = child.get('dob')
        if not dob:
            continue
        
        # Get expected vaccines for this child
        expected_vaccines = get_vaccine_due_dates(dob)
        
        # Get already recorded vaccinations
        recorded_vacs = await sb_select('vaccinations', f"select=vaccine_code,dose,date_given&{eq('child_id', child_id)}")
        recorded_set = set((v['vaccine_code'], v['dose']) for v in recorded_vacs)
        
        # Get already sent reminders for this child
        existing_reminders = await sb_select('vaccination_reminders', f"select=vaccine_code,dose,reminder_days_before&{eq('child_id', child_id)}")
        reminder_set = set((r['vaccine_code'], r['dose'], r['reminder_days_before']) for r in existing_reminders)
        
        for vaccine in expected_vaccines:
            vac_code = vaccine['vaccine_code']
            dose = vaccine['dose']
            due_date = vaccine['due_date']
            
            # Skip if already recorded
            if (vac_code, dose) in recorded_set:
                continue
            
            # Check if reminder should be created (15 days or 7 days before due date)
            for days_before in [30, 15, 7]:
                reminder_date = due_date - timedelta(days=days_before)
                
                # Check if today is the reminder day
                if today <= reminder_date <= tomorrow:
                    # Skip if reminder already exists
                    if (vac_code, dose, days_before) in reminder_set:
                        continue
                    
                    # Get parent aadhaars
                    parent_aadhaars = [a for a in (child.get('mother_aadhaar'), child.get('father_aadhaar')) if a]
                    
                    for aad in parent_aadhaars:
                        parent = await sb_find_one('parents', eq('aadhaar', aad))
                        if not parent:
                            continue
                        
                        # Create notification
                        if days_before == 15:
                            title = f"{vaccine['vaccine_name']} due soon"
                            body = f"{vaccine['vaccine_name']} ({dose}) is due for {child['name']} in {days_before} days (on {due_date.strftime('%B %d, %Y')}). Schedule an appointment with your doctor."
                        else:  # 7 days
                            title = f"{vaccine['vaccine_name']} due very soon!"
                            body = f"{vaccine['vaccine_name']} ({dose}) is due for {child['name']} in {days_before} days (on {due_date.strftime('%B %d, %Y')}). Please schedule an appointment immediately."
                        
                        notification_data = {
                            'id': str(uuid.uuid4()),
                            'parent_id': parent['id'],
                            'title': title,
                            'body': body,
                            'child_id': child_id,
                            'vaccination_id': None,
                            'read': False,
                            'created_at': now_iso(),
                        }
                        
                        notif = await sb_insert('notifications', notification_data)
                        
                        # Send push notification to device
                        await send_push_notification(
                            parent['id'],
                            title=title,
                            body=body,
                            data={
                                'type': 'vaccination_reminder',
                                'child_id': child_id,
                                'vaccine_name': vaccine['vaccine_name'],
                                'days_until_due': str(days_before),
                            }
                        )
                        
                        # Track this reminder
                        reminder_data = {
                            'id': str(uuid.uuid4()),
                            'child_id': child_id,
                            'vaccine_code': vac_code,
                            'vaccine_name': vaccine['vaccine_name'],
                            'dose': dose,
                            'due_date': str(due_date),
                            'reminder_days_before': days_before,
                            'notification_id': notif['id'],
                            'created_at': now_iso(),
                        }
                        
                        await sb_insert('vaccination_reminders', reminder_data)
                        reminder_count += 1
    
    return {'reminders_created': reminder_count}

def valid_aadhaar(a: str) -> bool:
    return isinstance(a, str) and a.isdigit() and len(a) == 12

def valid_phone(p: str) -> bool:
    return isinstance(p, str) and p.isdigit() and 7 <= len(p) <= 15

def generate_access_code() -> str:
    return f"{random.randint(100000, 999999):06d}"

def is_valid_access_code(code: str) -> bool:
    return isinstance(code, str) and code.isdigit() and len(code) == 6

def verify_access_code(child: dict, access_code: str) -> bool:
    if not is_valid_access_code(access_code):
        return False
    return bool(child.get('mother_access_code') == access_code or child.get('father_access_code') == access_code)

async def generate_unique_access_code() -> str:
    for _ in range(20):
        code = generate_access_code()
        if not await sb_find_one('parents', eq('access_code', code)):
            return code
    raise HTTPException(500, "Unable to generate a unique access code")

async def ensure_parent_access_code(parent: dict) -> dict:
    if parent.get('access_code') and is_valid_access_code(parent['access_code']):
        return parent
    code = await generate_unique_access_code()
    await sb_update('parents', eq('id', parent['id']), {'access_code': code})
    parent['access_code'] = code
    return parent

async def send_password_reset_otp(email: str, otp: str):
    service_id = env.EMAILJS_SERVICE_ID
    template_id = env.EMAILJS_TEMPLATE_ID
    public_key = env.EMAILJS_PUBLIC_KEY
    private_key = env.EMAILJS_PRIVATE_KEY 

    if not service_id or not template_id or not public_key:
        raise HTTPException(
            500,
            "Email service is not configured"
        )

    if not private_key:
        raise HTTPException(
            500,
            "Email service private key is not configured"
        )

    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": public_key,
        "accessToken": private_key,
        "template_params": {
            "email": email,
            "passcode": otp,
            "time": "5 minutes",
        },
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            "https://api.emailjs.com/api/v1.0/email/send",
            json=payload,
        )

    if response.status_code != 200:
        raise HTTPException(
            502,
            f"EmailJS error {response.status_code}: {response.text}"
        )

class PasswordResetRequestIn(BaseModel):
    role: str
    aadhaar: str 
    email: str

class PasswordResetAadhaarCheckIn(BaseModel):
    aadhaar: str


@api.post("/auth/check-parent-aadhaar")
async def check_parent_aadhaar(body: PasswordResetAadhaarCheckIn):
    aadhaar = body.aadhaar.strip()

    if not re.fullmatch(r"\d{12}", aadhaar):
        raise HTTPException(
            400,
            "Enter a valid 12-digit Aadhaar number"
        )

    parent = await sb_find_one(
        "parents",
        eq("aadhaar", aadhaar),
    )

    if not parent:
        raise HTTPException(
            404,
            "No parent account found with this Aadhaar number"
        )

    return {
        "exists": True
    }


@api.post("/auth/forgot-password")
async def request_password_reset(body: PasswordResetRequestIn):
    role = body.role.strip().lower()

    if role not in ("parent", "doctor"):
        raise HTTPException(400, "Invalid account type")

    email = body.email.strip().lower()

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a valid email address")

    table = "parents" if role == "parent" else "doctors"

    if role == "parent":
        user = await sb_find_one(
            "parents",
            eq("aadhaar", body.aadhaar.strip()),
    )
    else:
        user = await sb_find_one(
        "doctors",
        eq("email", email),
    )

    if not user:
        raise HTTPException(
        404,
        "Account not found"
    )

    if role == "parent":
        stored_email = (user.get("email") or "").strip().lower()

        if stored_email != email:
            raise HTTPException(
                400,
                "Email does not match the email linked to this Aadhaar number"
            )

    otp = f"{secrets.randbelow(1_000_000):06d}"
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()

    expires_at = (
        datetime.now(timezone.utc) + timedelta(minutes=15)
    ).isoformat()

    await sb_insert(
        "password_reset_tokens",
        {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "role": role,
            "email": email,
            "otp_hash": otp_hash,
            "expires_at": expires_at,
            "attempts": 0,
            "used": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    )

    await send_password_reset_otp(email, otp)

    return {
        "message": "Password reset OTP sent",
    }

class PasswordResetVerifyIn(BaseModel):
    role: str
    email: str
    otp: str


@api.post("/auth/verify-password-reset")
async def verify_password_reset(body: PasswordResetVerifyIn):
    role = body.role.strip().lower()
    email = body.email.strip().lower()
    otp = body.otp.strip()

    if role not in ("parent", "doctor"):
        raise HTTPException(400, "Invalid account type")

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a valid email address")

    if not re.fullmatch(r"\d{6}", otp):
        raise HTTPException(400, "OTP must be 6 digits")

    token = await sb_find_one(
        "password_reset_tokens",
        f"{eq('email', email)}&role=eq.{role}&used=eq.false&order=created_at.desc",
    )

    if not token:
        raise HTTPException(400, "Invalid or expired OTP")

    if token.get("attempts", 0) >= 5:
        raise HTTPException(
            429,
            "Too many incorrect OTP attempts",
        )

    expires_at = datetime.fromisoformat(
        token["expires_at"].replace("Z", "+00:00")
    )

    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(400, "OTP has expired")

    otp_hash = hashlib.sha256(otp.encode()).hexdigest()

    if otp_hash != token["otp_hash"]:
        await sb_update(
            "password_reset_tokens",
            eq("id", token["id"]),
            {"attempts": token.get("attempts", 0) + 1},
        )

        raise HTTPException(400, "Invalid OTP")

    return {
        "message": "OTP verified",
        "reset_token": token["id"],
    }    

class PasswordResetCompleteIn(BaseModel):
    role: str
    email: str
    reset_token: str
    new_password: str


@api.post("/auth/reset-password")
async def reset_password(body: PasswordResetCompleteIn):
    role = body.role.strip().lower()
    email = body.email.strip().lower()
    reset_token = body.reset_token.strip()

    if role not in ("parent", "doctor"):
        raise HTTPException(400, "Invalid account type")

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a valid email address")

    if len(body.new_password) < 6:
        raise HTTPException(
            400,
            "Password must be at least 6 characters"
        )

    token = await sb_find_one(
        "password_reset_tokens",
        f"{eq('id', reset_token)}&email=eq.{email}&role=eq.{role}&used=eq.false",
    )

    if not token:
        raise HTTPException(
            400,
            "Invalid or expired password reset request"
        )

    expires_at = datetime.fromisoformat(
        token["expires_at"].replace("Z", "+00:00")
    )

    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(
            400,
            "Password reset request has expired"
        )

    table = "parents" if role == "parent" else "doctors"

    user = await sb_find_one(
        table,
        eq("id", token["user_id"]),
    )

    if not user:
        raise HTTPException(
            404,
            "Account not found"
        )

    await sb_update(
        table,
        eq("id", user["id"]),
        {
            "password_hash": hash_password(
                body.new_password
            )
        },
    )

    await sb_update(
        "password_reset_tokens",
        eq("id", token["id"]),
        {
            "used": True
        },
    )

    return {
        "message": "Password reset successful"
    }

# ------------- Auth: Parent -------------

@api.post('/parent/register')
async def parent_register(body: ParentRegisterIn):
    if not valid_aadhaar(body.aadhaar):
        raise HTTPException(400, "Aadhaar must be 12 digits")

    if not valid_phone(body.phone):
        raise HTTPException(400, "Invalid phone number")

    email = body.email.strip().lower()

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a valid email address")

    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    if await sb_find_one('parents', eq('aadhaar', body.aadhaar)):
        raise HTTPException(409, "Aadhaar already registered")

    if await sb_find_one('parents', eq('phone', body.phone)):
        raise HTTPException(409, "Phone already registered")

    if await sb_find_one('parents', eq('email', email)):
        raise HTTPException(409, "Email already registered")

    access_code = await generate_unique_access_code()

    doc = {
        'id': str(uuid.uuid4()),
        'full_name': body.full_name.strip(),
        'aadhaar': body.aadhaar,
        'phone': body.phone,
        'email': email,
        'password_hash': hash_password(body.password),
        'access_code': access_code,
        'created_at': now_iso(),
    }

    p = await sb_insert('parents', doc)

    token = make_token(p['id'], 'parent')

    return {
        'token': token,
        'parent': strip_secret(p),
    }

@api.post('/parent/login')
async def parent_login(body: ParentLoginIn):
    p = await sb_find_one('parents', eq('aadhaar', body.aadhaar))
    if not p or not verify_password(body.password, p['password_hash']):
        raise HTTPException(401, "Invalid Aadhaar or password")
    p = await ensure_parent_access_code(p)
    token = make_token(p['id'], 'parent')
    return {'token': token, 'parent': strip_secret(p)}

@api.get('/parent/me')
async def parent_me(cur=Depends(require_parent)):
    p = await sb_find_one('parents', eq('id', cur['user_id']))
    if not p:
        raise HTTPException(404, "Parent not found")
    p = await ensure_parent_access_code(p)
    return strip_secret(p)

# ------------- Auth: Doctor -------------

@api.post('/doctor/register')
async def doctor_register(body: DoctorRegisterIn):
    if not valid_phone(body.phone):
        raise HTTPException(400, "Invalid phone number")

    email = body.email.strip().lower()

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(400, "Enter a valid email address")

    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    if await sb_find_one('doctors', eq('phone', body.phone)):
        raise HTTPException(409, "Phone already registered")

    if await sb_find_one('doctors', eq('email', email)):
        raise HTTPException(409, "Email already registered")

    doc = {
        'id': str(uuid.uuid4()),
        'doctor_name': body.doctor_name.strip(),
        'phone': body.phone,
        'email': email,
        'password_hash': hash_password(body.password),
        'clinic_name': body.clinic_name.strip(),
        'clinic_address': body.clinic_address.strip(),
        'profile_photo_url': body.profile_photo_url,
        'created_at': now_iso(),
    }

    d = await sb_insert('doctors', doc)

    token = make_token(d['id'], 'doctor')

    return {
        'token': token,
        'doctor': strip_secret(d),
    }

@api.post('/doctor/login')
async def doctor_login(body: DoctorLoginIn):
    d = await sb_find_one('doctors', eq('phone', body.phone))
    if not d or not verify_password(body.password, d['password_hash']):
        raise HTTPException(401, "Invalid phone or password")
    token = make_token(d['id'], 'doctor')
    return {'token': token, 'doctor': strip_secret(d)}

@api.get('/doctor/me')
async def doctor_me(cur=Depends(require_doctor)):
    d = await sb_find_one('doctors', eq('id', cur['user_id']))
    if not d:
        raise HTTPException(404, "Doctor not found")
    return strip_secret(d)

@api.patch('/doctor/me')
async def doctor_update(body: DoctorUpdateIn, cur=Depends(require_doctor)):
    updates = {}
    if body.doctor_name is not None:
        if not body.doctor_name.strip():
            raise HTTPException(400, "Name cannot be empty")
        updates['doctor_name'] = body.doctor_name.strip()
    if body.phone is not None:
        if not valid_phone(body.phone):
            raise HTTPException(400, "Invalid phone number")
        other = await sb_find_one('doctors', f"{eq('phone', body.phone)}&id=neq.{cur['user_id']}")
        if other:
            raise HTTPException(409, "Phone already registered")
        updates['phone'] = body.phone
    if body.clinic_name is not None:
        if not body.clinic_name.strip():
            raise HTTPException(400, "Clinic name cannot be empty")
        updates['clinic_name'] = body.clinic_name.strip()
    if body.clinic_address is not None:
        if not body.clinic_address.strip():
            raise HTTPException(400, "Clinic address cannot be empty")
        updates['clinic_address'] = body.clinic_address.strip()
    if body.profile_photo_url is not None:
        updates['profile_photo_url'] = body.profile_photo_url or None
    if body.language is not None:
        if body.language not in ("en", "hi", "mr", "gu"):
            raise HTTPException(400, "Unsupported language")
        updates['language'] = body.language
    if not updates:
        raise HTTPException(400, "Nothing to update")
    await sb_update('doctors', eq('id', cur['user_id']), updates)
    d = await sb_find_one('doctors', eq('id', cur['user_id']))
    return strip_secret(d)

CONFIRM_DELETE_PARENT = "DELETE MY ACCOUNT"

@api.post('/doctor/me/delete')
async def doctor_delete(body: ConfirmDeleteIn, cur=Depends(require_doctor)):
    if body.confirm_phrase.strip() != CONFIRM_DELETE_PARENT:
        raise HTTPException(400, f'You must type exactly: "{CONFIRM_DELETE_PARENT}"')
    await sb_delete('doctors', eq('id', cur['user_id']))
    return {'ok': True}

# ------------- Parent profile update / delete -------------

@api.patch('/parent/me')
async def parent_update(body: ParentUpdateIn, cur=Depends(require_parent)):
    updates = {}
    if body.full_name is not None:
        if not body.full_name.strip():
            raise HTTPException(400, "Name cannot be empty")
        updates['full_name'] = body.full_name.strip()
    if body.phone is not None:
        if not valid_phone(body.phone):
            raise HTTPException(400, "Invalid phone number")
        other = await sb_find_one('parents', f"{eq('phone', body.phone)}&id=neq.{cur['user_id']}")
        if other:
            raise HTTPException(409, "Phone already registered")
        updates['phone'] = body.phone

    if body.language is not None:
        if body.language not in ("en", "hi", "mr", "gu"):
            raise HTTPException(400, "Unsupported language")
        updates['language'] = body.language

    if not updates:
        raise HTTPException(400, "Nothing to update")
    await sb_update('parents', eq('id', cur['user_id']), updates)
    p = await sb_find_one('parents', eq('id', cur['user_id']))
    return strip_secret(p)

@api.post('/parent/me/delete')
async def parent_delete(body: ConfirmDeleteIn, cur=Depends(require_parent)):
    if body.confirm_phrase.strip() != CONFIRM_DELETE_PARENT:
        raise HTTPException(400, f'You must type exactly: "{CONFIRM_DELETE_PARENT}"')
    parent = await sb_find_one('parents', eq('id', cur['user_id']))
    if not parent:
        raise HTTPException(404, "Parent not found")
    my_aadhaar = parent['aadhaar']
    # Cascade: for each linked child, unlink me; delete only if no other parent Aadhaar remains
    kids = await sb_select('children', f"select=*&or=(mother_aadhaar.eq.{my_aadhaar},father_aadhaar.eq.{my_aadhaar})")
    for k in kids:
        mother = k.get('mother_aadhaar') if k.get('mother_aadhaar') != my_aadhaar else None
        father = k.get('father_aadhaar') if k.get('father_aadhaar') != my_aadhaar else None
        if mother or father:
            await sb_update('children', eq('id', k['id']), {'mother_aadhaar': mother, 'father_aadhaar': father})
        else:
            await sb_delete('children', eq('id', k['id']))  # ON DELETE CASCADE removes vaccinations
    await sb_delete('notifications', eq('parent_id', cur['user_id']))
    await sb_delete('parents', eq('id', cur['user_id']))
    return {'ok': True}

# ------------- Children -------------

async def _child_public(child: dict) -> dict:
    vacs = await sb_select('vaccinations', f"select=*&{eq('child_id', child['id'])}")
    
    # Get documents for each vaccination
    for vac in vacs:
        docs = await sb_select('vaccination_documents', f"select=id,document_url,document_type,file_name,uploaded_at&{eq('vaccination_id', vac['id'])}")
        vac['documents'] = docs
    
    return {**child, 'vaccinations': vacs}

@api.post('/parent/children')
async def add_child(body: ChildCreateIn, cur=Depends(require_parent)):
    parent = await sb_find_one('parents', eq('id', cur['user_id']))
    if not parent:
        raise HTTPException(404, "Parent not found")
    for a in (body.mother_aadhaar, body.father_aadhaar, body.child_aadhaar):
        if a and not valid_aadhaar(a):
            raise HTTPException(400, "Aadhaar numbers must be 12 digits")
    if not (body.mother_aadhaar or body.father_aadhaar):
        raise HTTPException(400, "Provide at least mother or father Aadhaar")
    if body.weight_kg is None or body.weight_kg <= 0 or body.weight_kg > 200:
        raise HTTPException(400, "Enter a valid weight in kg")
    if parent['aadhaar'] not in (body.mother_aadhaar, body.father_aadhaar):
        raise HTTPException(400, "Your Aadhaar must be entered as mother's or father's Aadhaar")
    doc = {
        'id': str(uuid.uuid4()),
        'name': body.name.strip(),
        'dob': body.dob,
        'gender': body.gender,
        'weight_kg': round(float(body.weight_kg), 2),
        'mother_aadhaar': body.mother_aadhaar,
        'father_aadhaar': body.father_aadhaar,
        'child_aadhaar': body.child_aadhaar,
        'created_by': parent['id'],
        'created_at': now_iso(),
    }
    child = await sb_insert('children', doc)
    return await _child_public(child)

@api.get('/parent/co-parent')
async def get_co_parent(aadhaar: str, cur=Depends(require_parent)):
    """
    Look up a co-parent by Aadhaar — used for PDF export to show both parents.
    Returns only safe public fields (name, phone). No sensitive data.
    """
    if not valid_aadhaar(aadhaar):
        raise HTTPException(400, "Invalid Aadhaar")
    p = await sb_find_one('parents', eq('aadhaar', aadhaar))
    if not p:
        raise HTTPException(404, "Parent not found")
    return { 'full_name': p['full_name'], 'phone': p['phone'] }

@api.get('/parent/children')
async def list_children(cur=Depends(require_parent)):
    parent = await sb_find_one('parents', eq('id', cur['user_id']))
    aadhaar = parent['aadhaar']
    kids = await sb_select('children', f"select=*&or=(mother_aadhaar.eq.{aadhaar},father_aadhaar.eq.{aadhaar})")
    return [await _child_public(k) for k in kids]

@api.get('/children/{child_id}')
async def get_child(child_id: str, cur=Depends(get_current)):
    child = await sb_find_one('children', eq('id', child_id))
    if not child:
        raise HTTPException(404, "Child not found")
    if cur['role'] == 'parent':
        parent = await sb_find_one('parents', eq('id', cur['user_id']))
        if parent['aadhaar'] not in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
            raise HTTPException(403, "Not your child")
    return await _child_public(child)

async def _assert_parent_owns_child(parent_id: str, child_id: str):
    parent = await sb_find_one('parents', eq('id', parent_id))
    child = await sb_find_one('children', eq('id', child_id))
    if not child:
        raise HTTPException(404, "Child not found")
    if parent['aadhaar'] not in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
        raise HTTPException(403, "Not your child")
    return parent, child

@api.patch('/parent/children/{child_id}')
async def child_update(child_id: str, body: ChildUpdateIn, cur=Depends(require_parent)):
    parent, child = await _assert_parent_owns_child(cur['user_id'], child_id)
    updates = {}
    if body.name is not None:
        if not body.name.strip():
            raise HTTPException(400, "Name cannot be empty")
        updates['name'] = body.name.strip()
    if body.dob is not None:
        updates['dob'] = body.dob
    if body.gender is not None:
        if body.gender not in ("Male", "Female", "Other"):
            raise HTTPException(400, "Invalid gender")
        updates['gender'] = body.gender
    if body.weight_kg is not None:
        if body.weight_kg <= 0 or body.weight_kg > 200:
            raise HTTPException(400, "Enter a valid weight in kg")
        updates['weight_kg'] = round(float(body.weight_kg), 2)
    for fld in ('mother_aadhaar', 'father_aadhaar', 'child_aadhaar'):
        val = getattr(body, fld)
        if val is not None:
            if val == "":
                updates[fld] = None
            elif not valid_aadhaar(val):
                raise HTTPException(400, "Aadhaar must be 12 digits")
            else:
                updates[fld] = val
    new_mother = updates.get('mother_aadhaar', child.get('mother_aadhaar'))
    new_father = updates.get('father_aadhaar', child.get('father_aadhaar'))
    if parent['aadhaar'] not in (new_mother, new_father):
        raise HTTPException(400, "Your Aadhaar must remain as mother's or father's Aadhaar")
    if not updates:
        raise HTTPException(400, "Nothing to update")
    await sb_update('children', eq('id', child_id), updates)
    fresh = await sb_find_one('children', eq('id', child_id))
    return await _child_public(fresh)

@api.post('/parent/children/{child_id}/delete')
async def child_delete(child_id: str, body: Optional[dict] = None, cur=Depends(require_parent)):
    _, child = await _assert_parent_owns_child(cur['user_id'], child_id)
    await sb_delete('notifications', eq('child_id', child_id))
    await sb_delete('children', eq('id', child_id))  # vaccinations cascade
    return {'ok': True}

# ------------- Doctor search -------------

@api.get('/doctor/search')
async def doctor_search(aadhaar: str, cur=Depends(require_doctor)):
    if not valid_aadhaar(aadhaar):
        raise HTTPException(400, "Aadhaar must be 12 digits")
    parent = await sb_find_one('parents', eq('aadhaar', aadhaar))
    if parent:
        p = await ensure_parent_access_code(parent)
        kids = await sb_select('children', f"select=*&or=(mother_aadhaar.eq.{aadhaar},father_aadhaar.eq.{aadhaar})")
        return {'match_type': 'parent', 'parent': strip_secret(p), 'children': kids}
    child = await sb_find_one('children', eq('child_aadhaar', aadhaar))
    if child:
        return {'match_type': 'child', 'children': [child]}
    raise HTTPException(404, "No records found for this Aadhaar")

@api.post('/doctor/children/{child_id}/verify-access-code')
async def verify_child_access_code(child_id: str, body: DoctorAccessCodeIn, cur=Depends(require_doctor)):
    child = await sb_find_one('children', eq('id', child_id))
    if not child:
        raise HTTPException(404, "Child not found")

    verification_child = {'mother_access_code': None, 'father_access_code': None}
    for aadhaar in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
        if not aadhaar:
            continue
        parent = await sb_find_one('parents', eq('aadhaar', aadhaar))
        if not parent:
            continue
        p = await ensure_parent_access_code(parent)
        if aadhaar == child.get('mother_aadhaar'):
            verification_child['mother_access_code'] = p.get('access_code')
        if aadhaar == child.get('father_aadhaar'):
            verification_child['father_access_code'] = p.get('access_code')

    if verify_access_code(verification_child, body.access_code):
        return {'ok': True}
    raise HTTPException(403, "Invalid access code for this child")

# ------------- Vaccinations -------------

@api.post('/doctor/vaccinations')
async def record_vaccinations(body: VaccinationRecordIn, cur=Depends(require_doctor)):
    doctor = await sb_find_one('doctors', eq('id', cur['user_id']))
    child = await sb_find_one('children', eq('id', body.child_id))
    if not child:
        raise HTTPException(404, "Child not found")
    if not body.entries:
        raise HTTPException(400, "No vaccines selected")
    if body.weight_kg is None or body.weight_kg <= 0 or body.weight_kg > 200:
        raise HTTPException(400, "Enter the child's current weight in kg")

    verification_child = {'mother_access_code': None, 'father_access_code': None}
    for aadhaar in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
        if not aadhaar:
            continue
        parent = await sb_find_one('parents', eq('aadhaar', aadhaar))
        if not parent:
            continue
        p = await ensure_parent_access_code(parent)
        if aadhaar == child.get('mother_aadhaar'):
            verification_child['mother_access_code'] = p.get('access_code')
        if aadhaar == child.get('father_aadhaar'):
            verification_child['father_access_code'] = p.get('access_code')
    if not body.access_code or not verify_access_code(verification_child, body.access_code):
        raise HTTPException(403, "A valid parent access code is required to record vaccinations")

    weight = round(float(body.weight_kg), 2)

    created = []
    for e in body.entries:
        if not e.get('vaccine_code') or not e.get('vaccine_name') or not e.get('dose'):
            raise HTTPException(400, "Vaccine entry missing fields")
        vrow = {
            'id': str(uuid.uuid4()),
            'child_id': body.child_id,
            'vaccine_code': e['vaccine_code'],
            'vaccine_name': e['vaccine_name'],
            'dose': e['dose'],
            'date_given': e.get('date_given') or now_iso(),
            'weight_kg': weight,
            'doctor_id': doctor['id'],
            'doctor_name': doctor['doctor_name'],
            'doctor_phone': doctor['phone'],
            'clinic_name': doctor['clinic_name'],
            'clinic_address': doctor['clinic_address'],
            'remarks': e.get('remarks', ''),
            'is_historical': False,
            'created_at': now_iso(),
        }
        inserted = await sb_insert('vaccinations', vrow)
        created.append(inserted)

    parent_aadhaars = [a for a in (child.get('mother_aadhaar'), child.get('father_aadhaar')) if a]
    for aad in parent_aadhaars:
        parent = await sb_find_one('parents', eq('aadhaar', aad))
        if parent:
            for v in created:
                await sb_insert('notifications', {
                    'id': str(uuid.uuid4()),
                    'parent_id': parent['id'],
                    'title': f"{v['vaccine_name']} recorded",
                    'body': f"Dr. {v['doctor_name']} recorded {v['vaccine_name']} ({v['dose']}) for {child['name']} at {v['clinic_name']}",
                    'child_id': child['id'],
                    'vaccination_id': v['id'],
                    'read': False,
                    'created_at': now_iso(),
                })

    return {'created': created}

@api.post('/parent/vaccinations')
async def parent_record_vaccination(
    body: ParentVaccinationRecordIn,
    cur=Depends(require_parent)
):
    # Verify that this parent actually owns the child.
    parent, child = await _assert_parent_owns_child(
        cur['user_id'],
        body.child_id
    )

    # Verify that the vaccine code exists in the exact
    # schedule used by the frontend.
    expected = PARENT_VACCINE_SCHEDULE.get(body.vaccine_code)

    if not expected:
        raise HTTPException(
            400,
            "Invalid vaccine code"
        )

    # Prevent the client from changing the vaccine name/dose
    # while keeping a valid vaccine code.
    if body.vaccine_name != expected["name"]:
        raise HTTPException(
            400,
            "Vaccine name does not match vaccine code"
        )

    if body.dose != expected["dose"]:
        raise HTTPException(
            400,
            "Vaccine dose does not match vaccine code"
        )

    # Validate the vaccination date.
    try:
        date_given = datetime.strptime(
            body.date_given,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        raise HTTPException(
            400,
            "Invalid vaccination date"
        )

    if date_given > date.today():
        raise HTTPException(
            400,
            "Vaccination date cannot be in the future"
        )

    # Validate weight when supplied.
    weight = None

    if body.weight_kg is not None:
        if (
            body.weight_kg <= 0
            or body.weight_kg > 200
        ):
            raise HTTPException(
                400,
                "Enter a valid weight in kg"
            )

        weight = round(
            float(body.weight_kg),
            2
        )

    # Prevent duplicate vaccination records
    # for the same child + vaccine code + dose.
    existing = await sb_find_one(
        'vaccinations',
        f"{eq('child_id', body.child_id)}&"
        f"{eq('vaccine_code', body.vaccine_code)}&"
        f"{eq('dose', body.dose)}"
    )

    if existing:
        raise HTTPException(
            409,
            "This vaccination dose has already been recorded"
        )

    vaccination = {
        'id': str(uuid.uuid4()),
        'child_id': body.child_id,
        'vaccine_code': body.vaccine_code,
        'vaccine_name': body.vaccine_name,
        'dose': body.dose,
        'date_given': body.date_given,
        'weight_kg': weight,
        'doctor_id': None,
        'doctor_name': (
            body.doctor_name.strip()
            if body.doctor_name
            and body.doctor_name.strip()
            else None
        ),
        'doctor_phone': None,
        'clinic_name': None,
        'clinic_address': None,
        'remarks': (
            body.remarks.strip()
            if body.remarks
            and body.remarks.strip()
            else None
        ),
        'is_historical': True,
        'created_at': now_iso(),
    }

    created = await sb_insert(
        'vaccinations',
        vaccination
    )

    return {
        'created': created
    }
@api.post('/admin/check-vaccination-reminders')
async def trigger_vaccination_reminders():
    """
    Trigger vaccination reminder check. 
    In production, this should be called by a scheduled cron job daily.
    """
    result = await check_and_create_vaccination_reminders()
    return result

@api.post('/parent/test-push')
async def test_push_notification(
    authorization: str = Header(...),
    cur=Depends(require_parent)
):


    parent_id = cur['user_id']

    sent = await send_push_notification(
        parent_id,
        title="Vardaan+ Test",
        body="Push notifications are working correctly.",
        data={
            "type": "test_push"
        }
    )

    if not sent:
        raise HTTPException(500, "Failed to send test push notification")

    return {
        "ok": True,
        "message": "Test push notification sent"
    }


# ------------- Vaccination Documents (Image Upload) -------------

@api.post('/parent/vaccinations/{vaccination_id}/upload-document')
async def upload_vaccination_document(
    vaccination_id: str,
    document_type: Optional[str] = "photo",
    file: UploadFile = File(...),
    cur=Depends(require_parent)
):
    """
    Upload a vaccination document/proof image.
    Only parent who owns the child can upload.
    """
    # Validate vaccination exists and parent owns it
    vac = await sb_find_one('vaccinations', eq('id', vaccination_id))
    if not vac:
        raise HTTPException(404, "Vaccination not found")
    
    child = await sb_find_one('children', eq('id', vac['child_id']))
    if not child:
        raise HTTPException(404, "Child not found")
    
    parent = await sb_find_one('parents', eq('id', cur['user_id']))
    if parent['aadhaar'] not in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
        raise HTTPException(403, "Not your child")
    
    # Validate file
    if not file:
        raise HTTPException(400, "No file provided")
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(400, "File must be an image (JPEG, PNG, WebP, etc)")
    
    # Validate file size (max 5MB)
    contents = await file.read()
    file_size = len(contents)
    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(400, "File size must be less than 5MB")
    
    # Create a unique filename
    import base64
    file_extension = file.filename.split('.')[-1].lower() if file.filename else 'jpg'
    safe_extension = file_extension if file_extension in ['jpg', 'jpeg', 'png', 'webp', 'gif'] else 'jpg'
    
    doc_id = str(uuid.uuid4())
    filename = f"vaccination_{vaccination_id}_{doc_id}.{safe_extension}"
    
    # In production, upload to Supabase Storage or S3
    # For now, we'll store as base64 in database or use Supabase Storage
    # Using Supabase Storage bucket approach:
    
    try:
        # Upload to Supabase Storage
        bucket_url = f"{SUPABASE_URL}/storage/v1/object/public/vaccination-documents/{filename}"
        
        upload_headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": file.content_type,
        }
        
        r = await http.post(
            f"{SUPABASE_URL}/storage/v1/object/vaccination-documents/{filename}",
            content=contents,
            headers=upload_headers,
        )
        
        if r.status_code >= 400:
            logger.error(f"Storage upload failed: {r.status_code} - {r.text}")
            raise HTTPException(500, "Failed to upload file")
        
        document_url = bucket_url
        
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(500, "Failed to upload file")
    
    # Save document record to database
    doc_record = {
        'id': doc_id,
        'vaccination_id': vaccination_id,
        'child_id': vac['child_id'],
        'uploaded_by_parent_id': cur['user_id'],
        'document_url': document_url,
        'document_type': document_type or 'photo',
        'file_name': file.filename,
        'file_size_bytes': file_size,
        'mime_type': file.content_type,
        'uploaded_at': now_iso(),
    }
    
    await sb_insert('vaccination_documents', doc_record)
    
    return {
        'id': doc_id,
        'document_url': document_url,
        'message': 'Document uploaded successfully',
    }

@api.get('/vaccinations/{vaccination_id}/documents')
async def get_vaccination_documents(vaccination_id: str, cur=Depends(get_current)):
    """
    Get all documents for a vaccination.
    Accessible by parent (who owns child) or doctor.
    """
    vac = await sb_find_one('vaccinations', eq('id', vaccination_id))
    if not vac:
        raise HTTPException(404, "Vaccination not found")
    
    child = await sb_find_one('children', eq('id', vac['child_id']))
    if not child:
        raise HTTPException(404, "Child not found")
    
    # Check access rights
    if cur['role'] == 'parent':
        parent = await sb_find_one('parents', eq('id', cur['user_id']))
        if parent['aadhaar'] not in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
            raise HTTPException(403, "Not your child")
    
    # Doctor can view any vaccination document
    documents = await sb_select('vaccination_documents', f"select=*&{eq('vaccination_id', vaccination_id)}&order=uploaded_at.desc")
    
    return documents

@api.delete('/vaccination-documents/{doc_id}')
async def delete_vaccination_document(doc_id: str, cur=Depends(require_parent)):
    """
    Delete a vaccination document.
    Only the parent who uploaded it can delete.
    """
    doc = await sb_find_one('vaccination_documents', eq('id', doc_id))
    if not doc:
        raise HTTPException(404, "Document not found")
    
    # Check if parent is the one who uploaded
    if doc['uploaded_by_parent_id'] != cur['user_id']:
        raise HTTPException(403, "You can only delete your own documents")
    
    try:
        # Delete from Supabase Storage
        # Extract filename from URL
        filename = doc['document_url'].split('/')[-1]
        
        delete_headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        
        await http.delete(
            f"{SUPABASE_URL}/storage/v1/object/vaccination-documents/{filename}",
            headers=delete_headers,
        )
    except Exception as e:
        logger.warning(f"Could not delete file from storage: {e}")
    
    # Delete from database
    await sb_delete('vaccination_documents', eq('id', doc_id))
    
    return {'ok': True}

# ------------- Device Tokens (Push Notifications) -------------

@api.post('/parent/device-token')
async def register_device_token(body: DeviceTokenIn, cur=Depends(require_parent)):
    """
    Register a device token for push notifications.
    Called by mobile app on startup.
    """
    parent = await sb_find_one('parents', eq('id', cur['user_id']))
    if not parent:
        raise HTTPException(404, "Parent not found")
    
    if not body.fcm_token or len(body.fcm_token) < 10:
        raise HTTPException(400, "Invalid FCM token")
    
    # Check if token already exists
    existing = await sb_find_one('device_tokens', eq('fcm_token', body.fcm_token))
    if existing:
        # Update last_used timestamp
        await sb_update('device_tokens', eq('fcm_token', body.fcm_token), {
            'parent_id': cur['user_id'],
            'last_used': now_iso(),
            'is_active': True,
            
        })
        return {'status': 'updated', 'message': 'Device token updated'}
    
    # Create new device token entry
    doc = {
        'id': str(uuid.uuid4()),
        'parent_id': cur['user_id'],
        'fcm_token': body.fcm_token,
        'device_name': body.device_name or 'Unknown Device',
        'device_type': body.device_type or 'android',
        'is_active': True,
        'last_used': now_iso(),
        'created_at': now_iso(),
    }
    await sb_insert('device_tokens', doc)
    return {'status': 'registered', 'message': 'Device token registered successfully'}

@api.post('/parent/device-token/unregister')
async def unregister_device_token(body: DeviceTokenIn, cur=Depends(require_parent)):
    """
    Unregister a device token (e.g., on logout).
    """
    if not body.fcm_token:
        raise HTTPException(400, "FCM token required")
    
    # Mark as inactive instead of deleting
    await sb_update('device_tokens', f"{eq('fcm_token', body.fcm_token)}&{eq('parent_id', cur['user_id'])}", {
        'is_active': False,
    })
    return {'status': 'unregistered', 'message': 'Device token unregistered'}

@api.get('/parent/device-tokens')
async def list_device_tokens(cur=Depends(require_parent)):
    """
    List all registered device tokens for the parent.
    """
    tokens = await sb_select('device_tokens', f"select=id,device_name,device_type,is_active,last_used,created_at&{eq('parent_id', cur['user_id'])}&order=last_used.desc")
    return tokens

# ------------- Notifications -------------

@api.get('/parent/notifications')
async def get_notifications(cur=Depends(require_parent)):
    return await sb_select('notifications', f"select=*&{eq('parent_id', cur['user_id'])}&order=created_at.desc&limit=200")

@api.post('/parent/notifications/{nid}/read')
async def mark_read(nid: str, cur=Depends(require_parent)):
    await sb_update('notifications', f"{eq('id', nid)}&{eq('parent_id', cur['user_id'])}", {'read': True})
    return {'ok': True}

@api.get('/')
async def root():
    return {'app': 'Vardaan+', 'db': 'supabase-postgres', 'status': 'ok'}

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=env.CORS_ORIGINS.split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_client():
    await http.aclose()

FRONTEND_BUILD_DIR = ROOT_DIR.parent / "frontend" / "build"
if FRONTEND_BUILD_DIR.exists():
    app.mount(
        "/static",
        StaticFiles(directory=FRONTEND_BUILD_DIR / "static"),
        name="static",
    )

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str):
        requested = FRONTEND_BUILD_DIR / full_path
        if full_path and requested.is_file():
            return FileResponse(requested)
        return FileResponse(FRONTEND_BUILD_DIR / "index.html")
