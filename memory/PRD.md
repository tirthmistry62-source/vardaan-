# VaxLedger — Product Requirements Document

## Problem Statement (Original)
Build a modern PWA for lifelong vaccination record management. Two roles: Parent (manages children, views records) and Doctor (records vaccinations). Aadhaar acts as a 12-digit username. Uses India's Universal Immunization Programme (UIP) schedule. User's Phase-1 constraint: **no SMS/OTP** — password-only auth.

## Personas
- **Parent** — Registers with Aadhaar + password, adds children, views vaccination timeline + notifications when doctor updates records.
- **Doctor** — Registers with phone + password, searches any child/parent by Aadhaar, records vaccines from a due-list, sends instant notifications to both parents.

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`) + MongoDB (motor). JWT auth (PyJWT), bcrypt password hashing. Collections: `parents`, `doctors`, `children`, `vaccinations`, `notifications`.
- **Frontend**: React 19 + React Router + Tailwind + shadcn/ui + sonner (toasts). Manrope (headings) + DM Sans (body). Aurora background, teal (#0F766E) + sky palette.
- **State**: Local JWT session in localStorage (`vax_token`, `vax_role`, `vax_user`).

## Phase 1 — Delivered (Jul 2026)
1. **Parent auth** — register/login with Aadhaar (12-digit username) + password. Duplicate Aadhaar/phone rejected.
2. **Doctor auth** — register/login with phone + password. Self-registration, no approval.
3. **Parent dashboard** — Add Child + child cards (photo placeholder, name, age, gender, DOB, progress %).
4. **Child Profile** — Full UIP schedule (28 vaccines, milestones from Birth → 16y) with auto-computed color-coded status: green completed, amber due, red overdue, sky upcoming. Grouped by milestone with timeline rail.
5. **Doctor Aadhaar search** — Detects parent vs child, returns linked family, opens child record.
6. **Doctor records vaccination** — Multi-select due vaccines, sticky action bar, animated success dialog with checkmark.
7. **Auto-link** — Same child auto-visible to BOTH parents via mother/father Aadhaar match.
8. **Notifications** — Both parents receive an in-app notification each time doctor records a vaccine; bell shows unread badge.
9. **Access control** — Parents can only access their own children (403 otherwise); routes guarded by role.

## Phase 2 — Backlog (Deferred)
### P0
- Documents tab (upload previous vaccination cards, PDF/image viewer, rename/delete)
- Activity timeline tab (audit log per child)
- PDF Export (professional report with logo, vaccine table, doctor details)
- Edit / Delete child with double-confirmation typed-phrase safeguard
- 15-minute doctor edit window UX + notification to parents on edit
- Forgot password flow (currently blocked without OTP — needs alternative recovery method)

### P1
- OTP / SMS integration (Twilio) — currently OMITTED per user direction
- Biometric / device PIN unlock (WebAuthn)
- Historical Record import (doctor imports old records from parent-uploaded docs, marked "Historical")
- Push notifications (service worker + Web Push)
- Full PWA manifest.json + installable service worker
- Doctor profile edit (name, clinic, address, photo)
- Parent profile settings (edit name/phone/password, biometric toggle)
- Doctor Details page (clickable from vaccine card)

### P2
- Reminders for upcoming vaccines (email / push)
- Multi-language (Hindi, regional Indian languages)
- Aadhaar-linked child transitioning to parent account (lifelong continuity)

## Test Credentials
See `/app/memory/test_credentials.md`.
