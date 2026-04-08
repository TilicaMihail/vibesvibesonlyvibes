# EduPlatform — Project Documentation

## What is this?

An AI-powered e-learning platform for schools and organizations. Administrators create the organization and manage its users and classes. Teachers build courses using a structured content editor and generate quizzes via AI. Students study course content and take tests — either pre-made tests attached to a course, or on-demand tests generated from the topics they choose.

## Roles

| Role | Owns | Primary entry point |
|---|---|---|
| **Admin** | Organization setup, user accounts, class roster management | `/dashboard` |
| **Teacher** | Courses, content, tests, class assignments | `/courses` |
| **Student** | Studying, test-taking, progress tracking | `/courses` |

Registration creates an **organization + admin account together** (1:1). Teachers and students do not self-register — the admin creates their accounts and they receive credentials by email.

## Docs index

| File | Contents |
|---|---|
| [architecture.md](./architecture.md) | Tech stack, folder structure, SSR/hydration pattern, auth flow, Tailwind tokens, data layer |
| [data-models.md](./data-models.md) | All TypeScript interfaces with field descriptions, relationships, and entity graph |
| [api-services.md](./api-services.md) | All RTK Query endpoints — method, URL, payload, response, cache tags |
| [pages-public.md](./pages-public.md) | Landing page, Login, Register |
| [pages-admin.md](./pages-admin.md) | Dashboard, User Management, Classes, Class Detail |
| [pages-teacher.md](./pages-teacher.md) | Courses (teacher view), Course Detail, Course Editor, Test Editor |
| [pages-student.md](./pages-student.md) | Courses (student view), Course Study, Test flow, Progress |

## Quick reference — route map

| Route | Role | Page |
|---|---|---|
| `/` | public | Landing |
| `/login` | public | Login |
| `/register` | public | Register (creates org + admin) |
| `/dashboard` | admin | Admin Dashboard |
| `/users` | admin | User Management |
| `/classes` | admin | Classes list |
| `/classes/[classId]` | admin | Class Detail |
| `/courses` | teacher / student | Courses list (role-aware) |
| `/courses/[courseId]` | teacher | Course Detail / Management |
| `/courses/[courseId]/editor` | teacher | Content Editor (full-screen) |
| `/courses/[courseId]/test-editor` | teacher | Test Editor / AI Generate |
| `/courses/[courseId]/study` | student | Course Study (full-screen) |
| `/courses/[courseId]/test` | student | Test Launcher |
| `/courses/[courseId]/test/[sessionId]` | student | Test Runner |
| `/courses/[courseId]/test/[sessionId]/results` | student | Test Results |
| `/courses/[courseId]/test/history` | student | Test History |
| `/courses/[courseId]/progress` | student | Course Progress |
| `/progress` | student | My Progress (overview) |
| `/profile` | all | Profile |
