"""VaxLedger backend - lifelong vaccination record management."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'vaxledger-dev-secret-change-me')
JWT_ALGO = 'HS256'
JWT_TTL_HOURS = 24 * 30  # 30 days

app = FastAPI(title="VaxLedger API")
api = APIRouter(prefix="/api")

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

async def get_current(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.lower().startswith('bearer '):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(' ', 1)[1].strip()
    data = decode_token(token)
    return {'user_id': data['sub'], 'role': data['role']}

async def require_parent(cur=Depends(get_current)) -> dict:
    if cur['role'] != 'parent':
        raise HTTPException(status_code=403, detail="Parent access only")
    return cur

async def require_doctor(cur=Depends(get_current)) -> dict:
    if cur['role'] != 'doctor':
        raise HTTPException(status_code=403, detail="Doctor access only")
    return cur

# ------------- Models -------------

class ParentRegisterIn(BaseModel):
    full_name: str
    aadhaar: str  # 12 digits, username
    phone: str
    password: str

class ParentLoginIn(BaseModel):
    aadhaar: str
    password: str

class DoctorRegisterIn(BaseModel):
    doctor_name: str
    phone: str  # login id
    password: str
    clinic_name: str
    clinic_address: str
    profile_photo_url: Optional[str] = None

class DoctorLoginIn(BaseModel):
    phone: str
    password: str

class ChildCreateIn(BaseModel):
    name: str
    dob: str  # ISO date YYYY-MM-DD
    gender: str
    mother_aadhaar: Optional[str] = None
    father_aadhaar: Optional[str] = None
    child_aadhaar: Optional[str] = None

class VaccinationRecordIn(BaseModel):
    child_id: str
    entries: List[dict]  # [{vaccine_code, vaccine_name, dose, remarks}]

# ------------- Validation -------------

def valid_aadhaar(a: str) -> bool:
    return isinstance(a, str) and a.isdigit() and len(a) == 12

def valid_phone(p: str) -> bool:
    return isinstance(p, str) and p.isdigit() and 7 <= len(p) <= 15

# ------------- Auth: Parent -------------

@api.post('/parent/register')
async def parent_register(body: ParentRegisterIn):
    if not valid_aadhaar(body.aadhaar):
        raise HTTPException(400, "Aadhaar must be 12 digits")
    if not valid_phone(body.phone):
        raise HTTPException(400, "Invalid phone number")
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    if await db.parents.find_one({'aadhaar': body.aadhaar}):
        raise HTTPException(409, "Aadhaar already registered")
    if await db.parents.find_one({'phone': body.phone}):
        raise HTTPException(409, "Phone already registered")
    doc = {
        'id': str(uuid.uuid4()),
        'full_name': body.full_name.strip(),
        'aadhaar': body.aadhaar,
        'phone': body.phone,
        'password_hash': hash_password(body.password),
        'created_at': now_iso(),
    }
    await db.parents.insert_one(doc)
    token = make_token(doc['id'], 'parent')
    return {'token': token, 'parent': {'id': doc['id'], 'full_name': doc['full_name'], 'aadhaar': doc['aadhaar'], 'phone': doc['phone']}}

@api.post('/parent/login')
async def parent_login(body: ParentLoginIn):
    p = await db.parents.find_one({'aadhaar': body.aadhaar})
    if not p or not verify_password(body.password, p['password_hash']):
        raise HTTPException(401, "Invalid Aadhaar or password")
    token = make_token(p['id'], 'parent')
    return {'token': token, 'parent': {'id': p['id'], 'full_name': p['full_name'], 'aadhaar': p['aadhaar'], 'phone': p['phone']}}

@api.get('/parent/me')
async def parent_me(cur=Depends(require_parent)):
    p = await db.parents.find_one({'id': cur['user_id']}, {'_id': 0, 'password_hash': 0})
    if not p:
        raise HTTPException(404, "Parent not found")
    return p

# ------------- Auth: Doctor -------------

@api.post('/doctor/register')
async def doctor_register(body: DoctorRegisterIn):
    if not valid_phone(body.phone):
        raise HTTPException(400, "Invalid phone number")
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    if await db.doctors.find_one({'phone': body.phone}):
        raise HTTPException(409, "Phone already registered")
    doc = {
        'id': str(uuid.uuid4()),
        'doctor_name': body.doctor_name.strip(),
        'phone': body.phone,
        'password_hash': hash_password(body.password),
        'clinic_name': body.clinic_name.strip(),
        'clinic_address': body.clinic_address.strip(),
        'profile_photo_url': body.profile_photo_url,
        'created_at': now_iso(),
    }
    await db.doctors.insert_one(doc)
    token = make_token(doc['id'], 'doctor')
    return {'token': token, 'doctor': {k: doc[k] for k in ('id', 'doctor_name', 'phone', 'clinic_name', 'clinic_address', 'profile_photo_url')}}

@api.post('/doctor/login')
async def doctor_login(body: DoctorLoginIn):
    d = await db.doctors.find_one({'phone': body.phone})
    if not d or not verify_password(body.password, d['password_hash']):
        raise HTTPException(401, "Invalid phone or password")
    token = make_token(d['id'], 'doctor')
    return {'token': token, 'doctor': {k: d[k] for k in ('id', 'doctor_name', 'phone', 'clinic_name', 'clinic_address', 'profile_photo_url')}}

@api.get('/doctor/me')
async def doctor_me(cur=Depends(require_doctor)):
    d = await db.doctors.find_one({'id': cur['user_id']}, {'_id': 0, 'password_hash': 0})
    if not d:
        raise HTTPException(404, "Doctor not found")
    return d

# ------------- Children -------------

async def _child_public(child_doc: dict) -> dict:
    vaccinations = await db.vaccinations.find({'child_id': child_doc['id']}, {'_id': 0}).to_list(1000)
    return {**{k: v for k, v in child_doc.items() if k != '_id'}, 'vaccinations': vaccinations}

@api.post('/parent/children')
async def add_child(body: ChildCreateIn, cur=Depends(require_parent)):
    parent = await db.parents.find_one({'id': cur['user_id']})
    if not parent:
        raise HTTPException(404, "Parent not found")
    for a in (body.mother_aadhaar, body.father_aadhaar, body.child_aadhaar):
        if a and not valid_aadhaar(a):
            raise HTTPException(400, "Aadhaar numbers must be 12 digits")
    if not (body.mother_aadhaar or body.father_aadhaar):
        raise HTTPException(400, "Provide at least mother or father Aadhaar")
    # Auto-link: parent's aadhaar must match one of the given fields
    if parent['aadhaar'] not in (body.mother_aadhaar, body.father_aadhaar):
        raise HTTPException(400, "Your Aadhaar must be entered as mother's or father's Aadhaar")
    doc = {
        'id': str(uuid.uuid4()),
        'name': body.name.strip(),
        'dob': body.dob,
        'gender': body.gender,
        'mother_aadhaar': body.mother_aadhaar,
        'father_aadhaar': body.father_aadhaar,
        'child_aadhaar': body.child_aadhaar,
        'created_by': parent['id'],
        'created_at': now_iso(),
    }
    await db.children.insert_one(doc)
    return await _child_public(doc)

@api.get('/parent/children')
async def list_children(cur=Depends(require_parent)):
    parent = await db.parents.find_one({'id': cur['user_id']})
    aadhaar = parent['aadhaar']
    kids = await db.children.find(
        {'$or': [{'mother_aadhaar': aadhaar}, {'father_aadhaar': aadhaar}]},
        {'_id': 0}
    ).to_list(1000)
    result = []
    for k in kids:
        result.append(await _child_public(k))
    return result

@api.get('/children/{child_id}')
async def get_child(child_id: str, cur=Depends(get_current)):
    child = await db.children.find_one({'id': child_id}, {'_id': 0})
    if not child:
        raise HTTPException(404, "Child not found")
    if cur['role'] == 'parent':
        parent = await db.parents.find_one({'id': cur['user_id']})
        if parent['aadhaar'] not in (child.get('mother_aadhaar'), child.get('father_aadhaar')):
            raise HTTPException(403, "Not your child")
    return await _child_public(child)

# ------------- Doctor Search -------------

@api.get('/doctor/search')
async def doctor_search(aadhaar: str, cur=Depends(require_doctor)):
    if not valid_aadhaar(aadhaar):
        raise HTTPException(400, "Aadhaar must be 12 digits")
    # Check if it's a parent
    parent = await db.parents.find_one({'aadhaar': aadhaar}, {'_id': 0, 'password_hash': 0})
    if parent:
        kids = await db.children.find(
            {'$or': [{'mother_aadhaar': aadhaar}, {'father_aadhaar': aadhaar}]},
            {'_id': 0}
        ).to_list(1000)
        return {'match_type': 'parent', 'parent': parent, 'children': kids}
    # Check if it's a child
    child = await db.children.find_one({'child_aadhaar': aadhaar}, {'_id': 0})
    if child:
        return {'match_type': 'child', 'children': [child]}
    raise HTTPException(404, "No records found for this Aadhaar")

# ------------- Vaccinations -------------

@api.post('/doctor/vaccinations')
async def record_vaccinations(body: VaccinationRecordIn, cur=Depends(require_doctor)):
    doctor = await db.doctors.find_one({'id': cur['user_id']})
    child = await db.children.find_one({'id': body.child_id}, {'_id': 0})
    if not child:
        raise HTTPException(404, "Child not found")
    if not body.entries:
        raise HTTPException(400, "No vaccines selected")

    created = []
    for e in body.entries:
        if not e.get('vaccine_code') or not e.get('vaccine_name') or not e.get('dose'):
            raise HTTPException(400, "Vaccine entry missing fields")
        vdoc = {
            'id': str(uuid.uuid4()),
            'child_id': body.child_id,
            'vaccine_code': e['vaccine_code'],
            'vaccine_name': e['vaccine_name'],
            'dose': e['dose'],
            'date_given': e.get('date_given') or now_iso(),
            'doctor_id': doctor['id'],
            'doctor_name': doctor['doctor_name'],
            'doctor_phone': doctor['phone'],
            'clinic_name': doctor['clinic_name'],
            'clinic_address': doctor['clinic_address'],
            'remarks': e.get('remarks', ''),
            'is_historical': False,
            'created_at': now_iso(),
        }
        await db.vaccinations.insert_one(vdoc)
        created.append({k: v for k, v in vdoc.items() if k != '_id'})

    # Create notifications for both parents linked to this child
    parent_aadhaars = [a for a in (child.get('mother_aadhaar'), child.get('father_aadhaar')) if a]
    for aad in parent_aadhaars:
        parent = await db.parents.find_one({'aadhaar': aad})
        if parent:
            for v in created:
                notif = {
                    'id': str(uuid.uuid4()),
                    'parent_id': parent['id'],
                    'title': f"{v['vaccine_name']} recorded",
                    'body': f"Dr. {v['doctor_name']} recorded {v['vaccine_name']} ({v['dose']}) for {child['name']} at {v['clinic_name']}",
                    'child_id': child['id'],
                    'vaccination_id': v['id'],
                    'read': False,
                    'created_at': now_iso(),
                }
                await db.notifications.insert_one(notif)

    return {'created': created}

# ------------- Notifications -------------

@api.get('/parent/notifications')
async def get_notifications(cur=Depends(require_parent)):
    items = await db.notifications.find(
        {'parent_id': cur['user_id']},
        {'_id': 0}
    ).sort('created_at', -1).to_list(200)
    return items

@api.post('/parent/notifications/{nid}/read')
async def mark_read(nid: str, cur=Depends(require_parent)):
    await db.notifications.update_one(
        {'id': nid, 'parent_id': cur['user_id']},
        {'$set': {'read': True}}
    )
    return {'ok': True}

@api.get('/')
async def root():
    return {'app': 'VaxLedger', 'status': 'ok'}

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
