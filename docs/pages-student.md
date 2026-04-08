# Pages — Student

Student pages live under `src/app/(app)/` and use the app layout (StudentSidebar + TopBar).

---

## Courses (Student View)

**Route:** `/courses`
**File:** `src/app/(app)/courses/page.tsx` — student branch
**Access:** student

### Purpose
Primary landing page for the student after login. Shows courses the student has access to and lets them browse public courses.

### What it shows
- **Tab — My Courses:** courses assigned to the student via class or direct enrollment. Shows progress bar per course.
- **Tab — Browse:** public courses available in the organization. Shows Enroll button.

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCoursesQuery` | `GET /courses?tab=assigned&studentId=...` | My Courses tab |
| `useGetCoursesQuery` | `GET /courses?tab=public` | Browse tab |
| `useGetUserProgressQuery` | `GET /progress/{userId}` | Progress bars on cards |
| `useEnrollStudentMutation` | `POST /courses/{courseId}/enrollments` | Enroll button |

### Navigation out
- `/courses/[courseId]/study` — clicking a course card
- `/progress` — sidebar

### Design decisions
- No separate Student Dashboard — this page is the student's home
- Enrollment via Browse tab adds the student to `Course.enrolledStudentIds` directly

---

## Course Study

**Route:** `/courses/[courseId]/study`
**File:** `src/app/(app)/courses/[courseId]/study/page.tsx`
**Access:** student (enrolled in course)

### Purpose
The primary learning interface. Students consume course content and access tests.

### Layout
**Full-screen split-pane** (`absolute inset-0 flex`):
- Left sidebar (w-72, `bg-surface-raised border-x border-surface-border`):
  - Course title + progress bar
  - Scrollable content tree (`StudyContentTree`) with completion checkmarks
- Right panel (flex-1, `bg-surface`):
  - Selected resource rendered inline

### Content rendering by type
| Type | How rendered |
|---|---|
| `text` | `<MarkdownContent>` in a card |
| `video` | `<iframe>` with `aspect-video` |
| `file` | Download card with file name and link |
| `chapter` | Placeholder: "Select a resource from this chapter" |
| `test` | Navigates to `/courses/[courseId]/test?testId=...` |

### Key components
| Component | File | Purpose |
|---|---|---|
| `StudyContentTree` | `src/components/study/StudyContentTree.tsx` | Tree with expand/collapse, progress tracking, completion checkmarks |
| `MarkdownContent` | `src/components/ui/MarkdownContent.tsx` | Rendered markdown |

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseQuery` | `GET /courses/{courseId}` | Page load |
| `useGetCourseContentQuery` | `GET /courses/{courseId}/content` | Page load |
| `useGetCourseProgressQuery` | `GET /progress/{userId}?courseId=` | Page load |
| `useMarkResourceCompleteMutation` | `POST /progress/{userId}/resource` | Auto-called on resource select |

### Auto-complete behavior
When a student selects a non-chapter, non-test resource, `markResourceComplete` is called automatically. No explicit "mark as done" button needed.

### Navigation out
- `/courses` — breadcrumb
- `/courses/[courseId]/test?testId=...` — selecting a test node

### Design decisions
- The first selectable resource is auto-selected on page load
- The left sidebar uses `border-x` (left AND right border) to visually separate it from the app sidebar in dark mode (they share the same background color)
- Test nodes navigate away — they do not render inline

---

## Test Launcher

**Route:** `/courses/[courseId]/test`
**File:** `src/app/(app)/courses/[courseId]/test/page.tsx`
**Access:** student

### Purpose
Starting point for a test session. In two modes:

**Mode A — specific test** (`?testId=...`): Shows the named test's start card. Student configures timer and starts.

**Mode B — test picker** (no param): Lists all tests for this course. Student picks one and starts.

### Timer configuration
- Optional — student chooses whether to enable a timer
- If enabled: 5–60 minutes (slider or input)
- Timer setting applies to both pre-made and AI-generated tests

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseTestsQuery` | `GET /courses/{courseId}/tests` | Page load (Mode B list, or Mode A title) |
| `useGetTestQuery` | `GET /courses/{courseId}/tests/{testId}` | Mode A: load specific test |
| `useCreateTestSessionMutation` | `POST /test-sessions` | Start Test button |

On session creation, navigates to `/courses/[courseId]/test/[sessionId]`.

### Navigation out
- `/courses/[courseId]/study` — back link
- `/courses/[courseId]/test/[sessionId]` — after session created

---

## Test Runner

**Route:** `/courses/[courseId]/test/[sessionId]`
**File:** `src/app/(app)/courses/[courseId]/test/[sessionId]/page.tsx`
**Access:** student (session owner)

### Purpose
The actual test-taking interface. One question at a time.

### Layout
Centered single-column (`max-w-2xl`):
- Progress bar (question X of N)
- Timer (if enabled) — auto-submits on expiry
- Question text
- Answer options (radio for single, checkboxes for multiple)
- Navigation: Previous / Next
- Submit button on last question (with confirmation)

### State management
All in-flight state lives in the `testRunner` Redux slice (not component state):
- `questions` — loaded from session
- `currentIndex` — current question
- `answers` — `Record<questionId, selectedOptionIds[]>`
- `flagged` — question IDs flagged for review
- `timeRemainingSeconds` — countdown
- `status` — `'idle' | 'running' | 'submitting' | 'done'`

The page dispatches `startSession` on load, `answerQuestion` on selection, `navigateTo` on prev/next, `tick` every second via `setInterval`.

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetTestSessionQuery` | `GET /test-sessions/{sessionId}` | Page load |
| `useSubmitTestSessionMutation` | `POST /test-sessions/{sessionId}/submit` | Submit button or timer expiry |

On submit success → navigates to `/courses/[courseId]/test/[sessionId]/results`.

### Design decisions
- Questions displayed **one at a time** (not scrollable list)
- Answers stored in Redux, **submitted all at once** at the end — no per-question autosave in MVP
- Timer expiry calls submit automatically with whatever answers have been given

---

## Test Results

**Route:** `/courses/[courseId]/test/[sessionId]/results`
**File:** `src/app/(app)/courses/[courseId]/test/[sessionId]/results/page.tsx`
**Access:** student

### Purpose
Shows the outcome of a completed test session — score, per-question breakdown, and ability to report bad questions.

### What it shows
- **Score summary:** percentage (color-coded: green ≥70, yellow 50–69, red <50), correct/incorrect/total counts
- **Question review:** each question with the student's answer highlighted, correct answer shown, explanation (if any)
- **Report button** (per question, for AI-generated tests) — opens report modal

### Report modal
- Reason enum: `'wrong_answer' | 'unclear_question' | 'outdated_content' | 'other'`
- Optional note field
- Submits to backend for review

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetTestSessionQuery` | `GET /test-sessions/{sessionId}` | Page load |

### Navigation out
- Try Again → `/courses/[courseId]/test?testId=...`
- All Results → `/courses/[courseId]/test/history`
- Back to Course → `/courses/[courseId]/study`

### Design decisions
- Report flow is for **AI-generated tests only** (human-made tests are assumed correct)
- Reason is an enum, not free text, to keep reports actionable in MVP
- Future: LLM-based explanation of the reported question could be surfaced to the student

---

## Test History

**Route:** `/courses/[courseId]/test/history`
**File:** `src/app/(app)/courses/[courseId]/test/history/page.tsx`
**Access:** student

### Purpose
Lists all past test sessions for this student in this course.

### What it shows
- Table of attempts: test name, score (color-coded), correct count, date/time
- Link to results page for each attempt
- Empty state with CTA to take first test

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetTestSessionsQuery` | `GET /test-sessions?studentId=...&courseId=...` | Page load |

### Navigation out
- `/courses/[courseId]/test/[sessionId]/results` — per-row link
- `/courses/[courseId]/study` — back to course

---

## My Progress

**Route:** `/progress`
**File:** `src/app/(app)/progress/page.tsx`
**Access:** student

### Purpose
Light overview of the student's learning activity across all courses.

### What it shows
- **Stats grid:** active courses, completed courses, total tests taken, total enrolled
- **Course progress list:** each enrolled course with completion %, link to detailed progress
- **Recent activity feed:** timeline of resource views, test submissions, and enrollments (with timestamps and result links)

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetUserProgressQuery` | `GET /progress/{userId}` | Page load |
| `useGetUserActivityQuery` | `GET /progress/{userId}/activity` | Page load |
| `useGetCoursesQuery` | `GET /courses?tab=assigned` | Page load (course titles) |

### Navigation out
- `/courses/[courseId]/progress` — per-course detail link
- `/courses` — sidebar

### Design decisions
- This is a **summary page** — light on detail, high on overview
- Detailed per-course progress lives on the Course Progress page
- Average score is shown for all tests taken (across courses); meaningful comparisons happen at the course level

---

## Course Progress

**Route:** `/courses/[courseId]/progress`
**File:** `src/app/(app)/courses/[courseId]/progress/page.tsx`
**Access:** student (their own progress)

### Purpose
Detailed progress view for one student in one course. Shows content completion, test history, and per-resource tracking.

### What it shows
- **Course header:** course name, teacher
- **Summary stats:** completion %, resources done / total, tests taken, last accessed date
- **Completion progress bar**
- **Per-resource list:** each content node with completion status (done / not started) and completion date

### Data flow
| Hook | Endpoint | Trigger |
|---|---|---|
| `useGetCourseQuery` | `GET /courses/{courseId}` | Page load |
| `useGetCourseContentQuery` | `GET /courses/{courseId}/content` | Page load (for resource list) |
| `useGetCourseProgressQuery` | `GET /progress/{userId}?courseId=` | Page load |

### Navigation out
- `/courses/[courseId]/study` — "Continue studying" link
- `/progress` — breadcrumb back to overview
- `/courses/[courseId]/test/history` — test history for this course

### Design decisions
- `completionPercent` is calculated server-side based on `ResourceProgress` records
- Progress is scoped to non-chapter nodes only (chapters are containers, not completable resources)
- This page is currently student-only — teacher/admin views of a specific student's progress are planned for a later iteration
