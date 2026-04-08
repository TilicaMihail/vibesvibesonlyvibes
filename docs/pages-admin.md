# Pages — Admin

Admin pages live under `src/app/(app)/` and use the app layout (AdminSidebar + TopBar).

---

## Admin Dashboard

**Route:** `/dashboard`
**File:** `src/app/(app)/dashboard/page.tsx`
**Access:** admin only

### Purpose
Post-login home for the admin. Provides a quick overview of the organization's state and links to management pages.

### What it shows
- **KPI cards:** total students, total teachers, total classes, active courses
- **Getting started checklist:** step-by-step onboarding guide (create users → create classes → teachers build courses)
- **Organization info card:** org name, slug, description — editable inline
- **Quick links:** Manage Users, Manage Classes

### Data flow
| Hook | Endpoint |
|---|---|
| `useGetUsersQuery` | `GET /users` |
| `useGetClassesQuery` | `GET /classes` |
| `useGetOrganizationQuery` | `GET /organizations` |
| `useUpdateOrganizationMutation` | `PUT /organizations` |

### Navigation out
- `/users` — Manage Users
- `/classes` — Manage Classes

### Design decisions
- No separate Organization Settings page — basic org info is edited directly from the dashboard card
- The getting-started checklist guides new admins through the initial setup flow
- Dashboard is overview only — full management happens in dedicated pages

---

## User Management

**Route:** `/users`
**File:** `src/app/(app)/users/page.tsx`
**Access:** admin only

### Purpose
Central page for creating and managing all user accounts in the organization. The admin creates teacher and student accounts here — users do not self-register.

### What it shows
- Full user table: name, email, role, status (active/inactive), join date
- Role filter tabs: All / Admin / Teacher / Student
- Search by name or email
- Per-row actions: Edit, Activate/Deactivate

### Key components
| Component | File | Purpose |
|---|---|---|
| `UserFormModal` | `src/components/users/UserFormModal.tsx` | Create and edit individual users |
| `CSVImportModal` | `src/components/users/CSVImportModal.tsx` | Bulk import via CSV file |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetUsersQuery` | `GET /users` | Page load, after mutations |
| `useGetOrganizationQuery` | `GET /organizations` | Page load (for orgId) |
| `useCreateUserMutation` | `POST /users` | Create user form submit |
| `useUpdateUserMutation` | `PUT /users/{id}` | Edit user form submit |
| `useToggleUserActiveMutation` | `PATCH /users/{userId}` | Activate/Deactivate button |

### CSV import
Uses `src/lib/csvParser.ts`. Expected columns: `firstName`, `lastName`, `email`, `role`. Backend creates accounts and sends temporary passwords by email.

### Assignment scope (teachers only)
When creating or editing a teacher, the admin can set:
- `organization` — teacher can assign their courses to any class
- `class` — teacher can only assign to specific classes (selected in this same form)

This is the **only place** where teacher assignment scope is configured — there is no separate settings page for it.

### Navigation out
- `/dashboard` — breadcrumb / sidebar
- Individual user profile — from row actions (if implemented)

### Design decisions
- Teachers and students cannot self-register — account creation is admin-only
- On creation, backend sends temporary credentials to the user's email
- Role filter is tab-based (not dropdown) for quick switching between user types
- Bulk import is CSV format (structured data, not plain text)

---

## Classes

**Route:** `/classes`
**File:** `src/app/(app)/classes/page.tsx`
**Access:** admin only

### Purpose
Overview of all classes in the organization. Entry point to manage individual classes.

### What it shows
- Grid of class cards: class name, description, teacher count, student count, creation date
- Search/filter bar
- Create Class button

### Key components
| Component | File | Purpose |
|---|---|---|
| `ClassFormModal` | `src/components/classes/ClassFormModal.tsx` | Create class (name, description, optional teachers) |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetClassesQuery` | `GET /classes` | Page load |
| `useGetUsersQuery` | `GET /users?role=teacher` | For teacher dropdown in create modal |
| `useGetOrganizationQuery` | `GET /organizations` | For orgId in create payload |
| `useCreateClassMutation` | `POST /classes` | Create form submit |

### Navigation out
- `/classes/[classId]` — clicking a class card
- `/dashboard` — sidebar

### Design decisions
- Students are **not added** during class creation — they are managed in the class detail page after creation
- Teachers can optionally be linked at creation to avoid a second step
- Display is card grid (not table), matching the visual style of the courses list

---

## Class Detail

**Route:** `/classes/[classId]`
**File:** `src/app/(app)/classes/[classId]/page.tsx`
**Access:** admin only

### Purpose
Manage a specific class: edit its metadata and control its student roster.

### What it shows
- Class header: name, description, list of teachers linked to this class
- Edit Class button (opens modal to update name / description / teachers)
- Student management panel: current students list + add/remove controls

### Key components
| Component | File | Purpose |
|---|---|---|
| `ClassFormModal` | `src/components/classes/ClassFormModal.tsx` | Edit class metadata and teacher links |
| `StudentEnrollmentPanel` | `src/components/classes/StudentEnrollmentPanel.tsx` | Add/remove students from class roster |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetClassQuery` | `GET /classes/{classId}` | Page load |
| `useGetUsersQuery` | `GET /users` | For student and teacher picker |
| `useUpdateClassMutation` | `PUT /classes/{id}` | Edit form submit |
| `useUpdateClassStudentsMutation` | `PUT /classes/{classId}/students` | Add/remove students |

### Navigation out
- `/classes` — breadcrumb back to class list
- Student profile page — from student row (if available)

### Design decisions
- **A student belongs to one class** — assigning a student to this class may remove them from another class (backend enforces this)
- Teachers are linked to classes for `assignmentScope` purposes — this is informational, not a permissions boundary
- Course assignments to classes are **not managed here** — that happens in Course Detail (teacher flow)
- The student panel sends the full updated student list on every change (replace semantics, not add/remove delta)
