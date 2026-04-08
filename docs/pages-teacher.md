# Pages — Teacher

Teacher pages live under `src/app/(app)/` and use the app layout (TeacherSidebar + TopBar).

---

## Courses (Teacher View)

**Route:** `/courses`
**File:** `src/app/(app)/courses/page.tsx`
**Access:** teacher (same file handles student view with role check)

### Purpose
Primary landing page for the teacher after login. Shows all courses the teacher has created and lets them create new ones.

### What it shows
- List/grid of courses owned by this teacher: title, visibility badge, last updated, enrolled count
- Search and filter controls
- Create Course button

### Key components
| Component | File | Purpose |
|---|---|---|
| `CourseFormModal` | `src/components/courses/CourseFormModal.tsx` | Create course (title, description, visibility) |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCoursesQuery` | `GET /courses?tab=owned` | Page load |
| `useCreateCourseMutation` | `POST /courses` | Create form submit |

### Navigation out
- `/courses/[courseId]` — clicking a course card
- `/courses/[courseId]/editor` — Content Editor link on a course card

### Design decisions
- This page **is the teacher's dashboard** — there is no separate teacher dashboard page
- Courses are scoped to the authenticated teacher (`teacherId` filter)

---

## Course Detail

**Route:** `/courses/[courseId]`
**File:** `src/app/(app)/courses/[courseId]/page.tsx` — `TeacherCourseDetail` component
**Access:** teacher (students are redirected to `/courses/[courseId]/study`)

### Purpose
Management overview for a specific course. The teacher sees the content structure, enrolled students, and controls for editing, testing, and assigning the course.

### What it shows

**Header card:**
- Course title, description, visibility badge, enrolled count, last updated
- Action buttons: Edit (opens modal), Content Editor, Test Editor

**Tab — Content:**
- Split-pane: left side shows the content tree (read-only with click-to-preview); right side shows the selected resource rendered inline (markdown, video, file, test link)
- Clicking a resource previews it without leaving the page

**Tab — Students:**
- Table of enrolled students: name, email, active status

### Key components
| Component | File | Purpose |
|---|---|---|
| `ContentTreeReadOnly` | `src/components/courses/ContentTreeReadOnly.tsx` | Read-only tree with `onSelect` support for preview |
| `MarkdownContent` | `src/components/ui/MarkdownContent.tsx` | Renders text resource content |
| `CourseFormModal` | `src/components/courses/CourseFormModal.tsx` | Edit course metadata |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseQuery` | `GET /courses/{courseId}` | Page load |
| `useGetCourseContentQuery` | `GET /courses/{courseId}/content` | Page load |
| `useGetCourseEnrollmentsQuery` | `GET /courses/{courseId}/enrollments` | Students tab |
| `useUpdateCourseMutation` | `PUT /courses/{id}` | Edit form submit |

### Navigation out
- `/courses` — breadcrumb
- `/courses/[courseId]/editor` — Content Editor button
- `/courses/[courseId]/test-editor` — Test Editor button

### Design decisions
- Assignment management (assigning course to classes) is intended to live on this page — not yet fully implemented in MVP
- Students are derived from class assignments and direct enrollments
- The content preview pane uses `h-[65vh] min-h-96` to give a large, usable split view without going full-screen

---

## Course Editor

**Route:** `/courses/[courseId]/editor`
**File:** `src/app/(app)/courses/[courseId]/editor/page.tsx`
**Access:** teacher (course owner)

### Purpose
Full-screen interface for building and editing the course content tree. The teacher constructs chapters and resources, edits their content, and saves the full tree.

### Layout
**Full-screen split-pane** (`absolute inset-0 flex flex-col`):
- Top bar: back link, course title, unsaved changes indicator, Save button
- Left sidebar (w-72): interactive content tree with add/delete/reorder controls
- Right panel (flex-1): node editor for the selected content node

### Key components
| Component | File | Purpose |
|---|---|---|
| `ContentTree` | `src/components/course-editor/ContentTree.tsx` | Editable tree — add, delete, move up/down |
| `NodeEditor` | `src/components/course-editor/NodeEditor.tsx` | Edit selected node's title, type, and content |

### Node types in the editor
| Type | Editable fields |
|---|---|
| `chapter` | Title, description |
| `text` | Title, markdown content (textarea) |
| `video` | Title, video URL, duration |
| `file` | Title, file name, file URL |
| `test` | Title, linked test (dropdown of course's saved tests) |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseQuery` | `GET /courses/{courseId}` | Page load |
| `useGetCourseContentQuery` | `GET /courses/{courseId}/content` | Page load (seeds local state) |
| `useGetCourseTestsQuery` | `GET /courses/{courseId}/tests` | For test node dropdown |
| `useUpdateCourseContentMutation` | `PUT /courses/{courseId}/content` | Save button |

### State
- `nodes: ContentNode[]` — local state, seeded from API, mutated in-memory until Save
- `selectedId` — currently selected node for editing
- `dirty` flag — tracks unsaved changes

### Navigation out
- `/courses/[courseId]` — back link in top bar

### Design decisions
- All changes are **local until Save** — no autosave, no per-node save
- `PUT /courses/{courseId}/content` receives the **full flat list** — replace semantics
- The content tree is built from the flat list using `buildTree()` and flattened back with `flattenTree()` on save
- Test nodes reference a saved `Test` entity by `testId` — the test itself is created separately in the Test Editor

---

## Test Editor

**Route:** `/courses/[courseId]/test-editor`
**File:** `src/app/(app)/courses/[courseId]/test-editor/page.tsx`
**Access:** teacher (course owner)

### Purpose
Create tests for the course — either by AI generation (primary flow) or manual question entry.

### Layout
Two-panel (not full-screen):
- Left sidebar (w-64): list of existing saved tests for this course
- Right panel: tabbed interface — AI Generate / Manual

### Tab — AI Generate
1. Teacher selects course topics (ContentNode IDs) to base the test on
2. Sets question count
3. Clicks Generate → `POST /courses/{courseId}/tests/generate`
4. Reviews the generated questions
5. Edits any questions that need fixing
6. Sets test title and saves → `POST /courses/{courseId}/tests`

### Tab — Manual
- Teacher adds questions one by one using `QuestionForm`
- Specifies question text, type (single/multiple/true_false), options, and correct answer(s)
- Optional explanation field per question (shown to students in results)

### Key components
| Component | File | Purpose |
|---|---|---|
| `AIGeneratePanel` | `src/components/test-editor/AIGeneratePanel.tsx` | Topic selector + generate trigger |
| `QuestionForm` | `src/components/test-editor/QuestionForm.tsx` | Individual question editor |
| `QuestionCard` | `src/components/test-editor/QuestionCard.tsx` | Review card for generated/saved questions |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseTestsQuery` | `GET /courses/{courseId}/tests` | Page load (sidebar list) |
| `useGenerateTestMutation` | `POST /courses/{courseId}/tests/generate` | Generate button |
| `useCreateTestMutation` | `POST /courses/{courseId}/tests` | Save test button |

### Navigation out
- `/courses/[courseId]` — back link

### Design decisions
- **Generation is the primary flow** — teachers are not expected to write tests from scratch; they start from AI output and refine
- The generate endpoint returns a **draft** (`Question[]`) — nothing is saved until the teacher explicitly clicks Save
- After saving, the test appears in the left sidebar and can be linked to a `ContentNode` of type `test` in the Course Editor
- `regenerate` (individual question) and `regenerate all` are planned but depend on the AI endpoint supporting partial regeneration
- Test nodes in the content tree reference a saved test by `testId` — the linking is done in the Course Editor, not here
