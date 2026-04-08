# Pages — Public

These pages live in `src/app/(public)/` and use a minimal layout with no sidebar or topbar.

---

## Landing Page

**Route:** `/`
**File:** `src/app/(public)/page.tsx`
**Access:** Public (unauthenticated)

### Purpose
Marketing page that introduces the platform, explains the value proposition, and drives visitors toward registration or login.

### Sections (top to bottom)
| Component | Description |
|---|---|
| `Navbar` | Logo + Login / Get Started links |
| `Hero` | Headline, subheadline, primary CTA (Get Started), secondary CTA (Login) |
| `HowItWorks` | Step-by-step flow: Register org → Create users → Build courses → Students study |
| `BenefitsByRole` | Feature highlights split by admin / teacher / student perspective |
| `CoreFeatures` | Key platform features (AI tests, content editor, progress tracking, etc.) |
| `ProductPreview` | Screenshots or mockups of the UI |
| `FAQ` | Common questions and answers |
| `FinalCTA` | Repeat call-to-action section |
| `Footer` | Links, copyright |

All components live in `src/components/landing/`.

### Data flow
No backend calls. Fully static.

### Navigation out
- `/login` — from Navbar "Login" and secondary CTA
- `/register` — from Navbar "Get Started" and primary CTA

### Design decisions
- Page is static in MVP — no personalization or dynamic content
- The landing page exists to serve visitors who discover the platform; it is not the entry point for returning users (they bookmark `/login`)

---

## Login

**Route:** `/login`
**File:** `src/app/(public)/login/page.tsx`
**Access:** Public (unauthenticated)

### Purpose
Authentication entry point. Accepts email + password and redirects to the correct dashboard based on role.

### Layout
Animated split-screen: branding/visual on the left, form on the right. Demo credentials are displayed on the page for development/demo use.

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useLoginMutation` | `POST /auth/login` | Form submit |

On success:
1. `authSlice.setCredentials({ token, user })` stores the session
2. Redirect based on `user.role`:
   - `admin` → `/dashboard`
   - `teacher` → `/courses`
   - `student` → `/courses`

On error: inline error message below the form.

### State
- Email input, password input (local state)
- Loading during submit
- Error string on failure

### Navigation out
- `/register` — "Create organization" link
- `/dashboard` or `/courses` — after successful login (role-dependent)

### Design decisions
- Forgot password is **not in MVP**
- Login response must include the full `user` object (not just the token) so the frontend can immediately set role-based state without a second `/users/me` call
- After login, redirect is determined by the `role` field in the response — not stored separately

---

## Register

**Route:** `/register`
**File:** `src/app/(public)/register/page.tsx`
**Access:** Public (unauthenticated)

### Purpose
Creates a new organization and its initial admin account in a single step. This is **not** individual user registration — it is organization onboarding.

### What gets created
- A new `Organization` record
- A new `User` record with `role = 'admin'` linked to that organization
- These are created together atomically — there is no separate "create org" and "create admin" flow

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useRegisterMutation` | `POST /auth/register` | Form submit |

On success:
1. Credentials stored (same as login)
2. Redirect to `/dashboard` (admin entry point)

### Form fields
| Field | Required | Notes |
|---|---|---|
| Organization name | Yes | Display name of the school/company |
| Organization slug | Yes | URL-safe identifier (auto-derived from name) |
| Admin first name | Yes | |
| Admin last name | Yes | |
| Admin email | Yes | Login credential |
| Admin password | Yes | With strength meter |

### State
- All input fields (local state)
- Client-side validation (password strength, required fields)
- Loading during submit
- Error string on failure (e.g. email already in use)

### Navigation out
- `/login` — "Already have an account?" link
- `/dashboard` — after successful registration

### Design decisions
- Registration creates **org + admin 1:1** — one admin per org in MVP (additional admins can be added via User Management later)
- Teachers and students **never self-register** — admin creates their accounts and they receive temporary credentials by email
- Country, city, org type, phone number (from the original spec) were simplified into org name + slug for MVP
