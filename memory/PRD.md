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
2. **Doctor auth** — register/login with phone + password. Self-registration, no approval. Name input has a locked "Dr." prefix.
3. **Parent dashboard** — Add Child + child cards (photo placeholder, name, age, gender, DOB, progress %). Header shows Settings, Notifications, Logout.
4. **Parent Settings** — edit full name + phone, view masked Aadhaar (read-only), delete account with double confirmation (warning + typed phrase "DELETE MY ACCOUNT").
5. **Edit Child** — edit name, DOB, gender; delete child with double confirmation (warning + typed long-form phrase).
6. **Child Profile** — Full UIP schedule with auto-computed color-coded status; Edit Child button in header.
7. **Doctor Aadhaar search** — Detects parent vs child, returns linked family, opens child record.
8. **Doctor Child Record** — Three tabs: Due & Overdue / History (completed) / All. History tab shows past vaccinations with doctor + clinic name.
9. **Doctor records vaccination** — Multi-select due vaccines, sticky action bar, animated success dialog with checkmark.
10. **Cascade behavior** — Deleting a parent unlinks that parent from children; child remains accessible from the other parent if any Aadhaar is set, otherwise deleted with all vaccinations.
11. **Back buttons** — Header back button on Settings, Edit Child, Add Child, Child Profile, Notifications, Doctor Child Record. Auth pages have "Back to role selection" / "Back to login" links.
12. **Auto-link** — Same child auto-visible to BOTH parents via mother/father Aadhaar match.
13. **Notifications** — Both parents receive an in-app notification each time doctor records a vaccine.
14. **Access control** — Parents can only access their own children; routes guarded by role.

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
