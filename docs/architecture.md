# Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 (no typography/forms plugins) |
| State | Redux Toolkit + RTK Query |
| Markdown | `react-markdown` v10 (no remark-gfm — CommonMark only) |
| Animation | `framer-motion` |
| Runtime | Node.js, deployed on Vercel |

---

## Route Groups

The app uses two Next.js route groups:

```
src/app/
├── (public)/          ← No sidebar. Pages: /, /login, /register
│   └── layout.tsx     ← Renders children directly (no chrome)
└── (app)/             ← Sidebar + TopBar. Pages: everything authenticated
    └── layout.tsx     ← Role-based sidebar, TopBar, main scroll area
```

There is no explicit auth redirect/middleware. App pages rely on Redux `auth.user` being set. If a user opens an app page without being logged in, they see an empty layout until they log in (MVP — a proper redirect guard can be added later).

---

## SSR / Hydration Pattern

**The problem:** Redux auth state (`user`, `role`) is `null` on the server during SSR. Any component that branches on role to render different JSX will produce a hydration mismatch when the client re-renders with the real role.

**The fix — `mounted` guard in `(app)/layout.tsx`:**

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])

// Before mount: static placeholder (same width/structure as real sidebar)
// After mount: real role-based sidebar + page children
{mounted ? <Sidebar /> : <div className="w-64 shrink-0 bg-dark hidden md:block" />}
<main className="relative flex-1 overflow-y-auto p-4 sm:p-6">
  {mounted ? children : null}
</main>
```

- SSR renders: sidebar placeholder + null children → deterministic, no role needed
- Client initial render (before `useEffect`): identical to SSR → hydration succeeds
- After `useEffect` fires: correct sidebar + page appear → no mismatch possible
- All child pages inherit this fix automatically

Individual components that still need their own guard (e.g. Avatar initials, TopBar display name) use the same `useState(false)` + `useEffect` pattern locally.

---

## Auth Flow

1. User submits login form → `POST /api/auth/login`
2. Response contains `{ token, user }`
3. Token stored in `localStorage` (`authToken`) and a `authToken` cookie (for any SSR reads)
4. `authSlice.setCredentials({ token, user })` updates Redux state
5. All subsequent API calls include `Authorization: Bearer <token>` via `baseApi.ts` `prepareHeaders`
6. On page load, `StoreProvider` reads `localStorage` to rehydrate auth state
7. `authSlice.logout()` clears localStorage, cookie, and Redux state

Token is decoded client-side via `src/lib/jwt.ts` (`decodeToken`) — base64 decode only, no signature verification (mock setup).

---

## State Management

Three Redux slices, all in `src/store/slices/`:

### `authSlice`
```
{ user: UserPublic | null, token: string | null, isAuthenticated: boolean, isLoading: boolean, error: string | null }
```
Actions: `setCredentials`, `logout`, `setLoading`, `setError`. Persists to localStorage on every mutation.

### `uiSlice`
```
{ sidebarOpen: boolean, sidebarCollapsed: boolean, activeModal: string | null, toasts: Toast[], darkMode: boolean }
```
Actions: `toggleSidebar`, `setSidebarOpen`, `openModal`, `closeModal`, `addToast`, `removeToast`, `toggleSidebarCollapsed`, `toggleDarkMode`. `sidebarCollapsed` and `darkMode` persist to localStorage.

### `testRunnerSlice`
```
{ sessionId: string | null, questions: Question[], currentIndex: number, answers: Record<string, string[]>, flagged: string[], timeRemainingSeconds: number, status: 'idle' | 'running' | 'submitting' | 'done' }
```
Actions: `startSession`, `answerQuestion`, `toggleFlag`, `navigateTo`, `tick`, `setSubmitting`, `setDone`, `resetSession`. Owns the entire in-flight test state — the Test Runner page reads from this slice and dispatches to it. `tick` is called every second by a `useEffect` interval in the runner page.

---

## Data Layer (Mock Backend)

The app has a **mock backend** built with Next.js API routes (`src/app/api/`). Data is stored as JSON files.

`src/lib/dataLoader.ts` handles file I/O:
- In development: reads/writes from `src/data/*.json`
- On Vercel (serverless): seeds `/tmp/data/` from bundled JSON on first cold start, then reads/writes from `/tmp/data/`

This means **data resets on every Vercel cold start**. For a real backend, swap `dataLoader.ts` for actual DB calls — all RTK Query service files remain unchanged.

RTK Query is configured in `src/services/baseApi.ts`:
- Base URL: `/api`
- `prepareHeaders`: injects `Authorization: Bearer <token>` from Redux store
- Tag types: `User`, `Class`, `Course`, `Content`, `Test`, `TestSession`, `Progress`, `Organization`

---

## Full-Screen Layout Pattern

Some pages need a split-pane that fills the entire viewport (no scroll on the outer container). The pattern:

```tsx
// In the page component:
<div className="absolute inset-0 flex">
  <div className="w-72 shrink-0 ...">  {/* left panel */} </div>
  <div className="flex-1 overflow-y-auto ...">  {/* right panel */} </div>
</div>
```

This works because `<main>` in `(app)/layout.tsx` has `className="relative ..."` — making it the positioning context for `absolute inset-0`.

**Pages using this pattern:**
- `/courses/[courseId]/study` — study interface
- `/courses/[courseId]/editor` — content editor

Regular pages (scrollable) use standard div wrappers. The negative margin trick (`-m-6`) was replaced with `absolute inset-0` to properly fill the bottom of the viewport.

---

## Tailwind Semantic Color Tokens

Defined in `src/app/globals.css` via `@theme {}`. Dark mode uses `.dark {}` overrides triggered by the `.dark` class on `<html>`.

**Never use raw hex values in components.** Always use these tokens:

| Token | Light | Dark | Use |
|---|---|---|---|
| `surface` | `#f6f3e7` (cream) | `#1a1410` | Page backgrounds |
| `surface-raised` | `#ffffff` | `#29241f` | Cards, panels, sidebars |
| `surface-border` | `#e8e0cc` | `#3d3028` | Dividers, borders |
| `on-surface` | `#29241f` | `#f6f3e7` | Primary text |
| `on-surface-muted` | `#6b5744` | `#c4a882` | Secondary text |
| `on-surface-faint` | `#c4a882` | `#6b5744` | Placeholders, metadata |
| `brand` | `#a27246` | `#a27246` | CTAs, links, accents |
| `brand-light` | `#c4a882` | `#c4a882` | Hover states, muted accents |
| `brand-dark` | `#7a5530` | `#7a5530` | Button hover / pressed |
| `dark` | `#29241f` | `#29241f` | Sidebar background |
| `cream` | `#f6f3e7` | — | Off-white backgrounds |

---

## Folder Structure

```
elearning-platform/
├── src/
│   ├── app/
│   │   ├── (public)/          ← Public pages (no auth required)
│   │   ├── (app)/             ← Protected pages (auth required)
│   │   └── api/               ← Mock backend API routes
│   ├── components/
│   │   ├── auth/              ← Login/Register form components
│   │   ├── classes/           ← ClassFormModal, StudentEnrollmentPanel
│   │   ├── course-editor/     ← ContentTree, NodeEditor (editing)
│   │   ├── courses/           ← ContentTreeReadOnly, CourseFormModal
│   │   ├── dashboard/         ← Admin/teacher/student dashboard views
│   │   ├── landing/           ← Hero, Features, FAQ, etc.
│   │   ├── layout/            ← AdminSidebar, TeacherSidebar, StudentSidebar, TopBar
│   │   ├── profile/           ← ProfilePage component
│   │   ├── progress/          ← Progress charts and summaries
│   │   ├── study/             ← StudyContentTree (interactive study sidebar)
│   │   ├── test-editor/       ← AIGeneratePanel, QuestionForm, QuestionCard
│   │   ├── test-runner/       ← Test-taking interface components
│   │   ├── ui/                ← Reusable primitives: Button, Badge, Avatar, Input, Modal, MarkdownContent, etc.
│   │   └── users/             ← UserFormModal, CSVImportModal
│   ├── lib/
│   │   ├── contentTree.ts     ← buildTree(), flattenTree(), getTypeIcon()
│   │   ├── csvParser.ts       ← parseCSV()
│   │   ├── dataLoader.ts      ← loadData(), saveData() (mock DB)
│   │   └── jwt.ts             ← encodeToken(), decodeToken()
│   ├── services/              ← RTK Query API slices (see api-services.md)
│   ├── store/
│   │   ├── slices/            ← authSlice, uiSlice, testRunnerSlice
│   │   ├── hooks.ts           ← useAppSelector, useAppDispatch
│   │   └── index.ts           ← Redux store config
│   └── types/                 ← Shared TypeScript interfaces (see data-models.md)
├── docs/                      ← This folder
└── public/                    ← Static assets
```
