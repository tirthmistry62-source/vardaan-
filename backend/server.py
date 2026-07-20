"""Vardaan+ backend - Supabase Postgres via REST API (PostgREST)."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid
import bcrypt
import jwt
import httpx
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL'].rstrip('/')
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']
REST_BASE = f"{SUPABASE_URL}/rest/v1"

JWT_SECRET = os.environ.get('JWT_SECRET', 'vardaan-dev-secret-change-me')
JWT_ALGO = 'HS256'
JWT_TTL_HOURS = 24 * 30

_headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}
http = httpx.AsyncClient(timeout=30, headers=_headers, base_url=REST_BASE)

app = FastAPI(title="Vardaan+ API")
api = APIRouter(prefix="/api")

# ------------- Supabase helpers -------------

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

def strip_secret(row: dict) -> dict:
    return {k: v for k, v in row.items() if k != 'password_hash'}

# ------------- Models -------------

class ParentRegisterIn(BaseModel):
    full_name: str
    aadhaar: str
    phone: str
    password: str

class ParentLoginIn(BaseModel):
    aadhaar: str
    password: str

class DoctorRegisterIn(BaseModel):
    doctor_name: str
    phone: str
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

class ParentUpdateIn(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class DoctorUpdateIn(BaseModel):
    doctor_name: Optional[str] = None
    phone: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    profile_photo_url: Optional[str] = None

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
    if await sb_find_one('parents', eq('aadhaar', body.aadhaar)):
        raise HTTPException(409, "Aadhaar already registered")
    if await sb_find_one('parents', eq('phone', body.phone)):
        raise HTTPException(409, "Phone already registered")
    doc = {
        'id': str(uuid.uuid4()),
        'full_name': body.full_name.strip(),
        'aadhaar': body.aadhaar,
        'phone': body.phone,
        'password_hash': hash_password(body.password),
        'created_at': now_iso(),
    }
    p = await sb_insert('parents', doc)
    token = make_token(p['id'], 'parent')
    return {'token': token, 'parent': strip_secret(p)}

@api.post('/parent/login')
async def parent_login(body: ParentLoginIn):
    p = await sb_find_one('parents', eq('aadhaar', body.aadhaar))
    if not p or not verify_password(body.password, p['password_hash']):
        raise HTTPException(401, "Invalid Aadhaar or password")
    token = make_token(p['id'], 'parent')
    return {'token': token, 'parent': strip_secret(p)}

@api.get('/parent/me')
async def parent_me(cur=Depends(require_parent)):
    p = await sb_find_one('parents', eq('id', cur['user_id']))
    if not p:
        raise HTTPException(404, "Parent not found")
    return strip_secret(p)

# ------------- Auth: Doctor -------------

@api.post('/doctor/register')
async def doctor_register(body: DoctorRegisterIn):
    if not valid_phone(body.phone):
        raise HTTPException(400, "Invalid phone number")
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")
    if await sb_find_one('doctors', eq('phone', body.phone)):
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
    d = await sb_insert('doctors', doc)
    token = make_token(d['id'], 'doctor')
    return {'token': token, 'doctor': strip_secret(d)}

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

CONFIRM_DELETE_CHILD_TEMPLATE = 'Yes, I want to delete {name}\'s account, and I approve that the vaccination details and history will be permanently deleted and cannot be recovered.'

@api.post('/parent/children/{child_id}/delete')
async def child_delete(child_id: str, body: ConfirmDeleteIn, cur=Depends(require_parent)):
    _, child = await _assert_parent_owns_child(cur['user_id'], child_id)
    expected = CONFIRM_DELETE_CHILD_TEMPLATE.format(name=child['name'])
    if body.confirm_phrase.strip() != expected:
        raise HTTPException(400, f'You must type exactly: "{expected}"')
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
        kids = await sb_select('children', f"select=*&or=(mother_aadhaar.eq.{aadhaar},father_aadhaar.eq.{aadhaar})")
        return {'match_type': 'parent', 'parent': strip_secret(parent), 'children': kids}
    child = await sb_find_one('children', eq('child_aadhaar', aadhaar))
    if child:
        return {'match_type': 'child', 'children': [child]}
    raise HTTPException(404, "No records found for this Aadhaar")

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
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_client():
    await http.aclose()
