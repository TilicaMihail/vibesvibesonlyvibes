# Data Models

All types live in `src/types/`. The barrel export is `src/types/index.ts`.

---

## Auth (`src/types/auth.ts`)

### `LoginRequest`
```ts
interface LoginRequest {
  email: string
  password: string
}
```

### `LoginResponse`
```ts
interface LoginResponse {
  token: string       // JWT-like token (base64 encoded)
  user: UserPublic    // Full user object (no password)
}
```

### `RegisterRequest`
```ts
interface RegisterRequest {
  organizationName: string
  organizationSlug: string   // URL-safe identifier for the org
  adminEmail: string
  adminPassword: string
  adminFirstName: string
  adminLastName: string
}
```
Register creates an **organization and admin account simultaneously** (1:1). Teachers and students are created by the admin after setup.

### `RegisterResponse`
```ts
interface RegisterResponse {
  token: string
  user: UserPublic
  organizationId: string
}
```

### `TokenPayload`
```ts
interface TokenPayload {
  userId: string
  role: string
  orgId: string
  exp: number        // Unix timestamp — expiry
}
```
Decoded from the JWT by `src/lib/jwt.ts`. Used to rehydrate auth state on page load.

### `AuthState` (Redux slice shape)
```ts
interface AuthState {
  user: UserPublic | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

---

## Organization (`src/types/organization.ts`)

### `Organization`
```ts
interface Organization {
  id: string
  name: string
  slug: string          // URL-safe unique identifier
  logoUrl?: string      // Optional logo URL
  description?: string  // Optional description
  createdAt: string     // ISO date string
}
```
Each organization is created via `/register` and has exactly one admin account. All users, classes, and courses belong to an organization via `organizationId`.

---

## User (`src/types/user.ts`)

### `UserRole`
```ts
type UserRole = 'admin' | 'teacher' | 'student'
```

### `User` (full record — never sent to frontend)
```ts
interface User {
  id: string
  organizationId: string
  email: string
  password: string         // Hashed — never exposed to client
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  avatarUrl?: string
  assignmentScope?: 'organization' | 'class'  // Teachers only
  createdAt: string
  lastLoginAt?: string
}
```

### `UserPublic` (= `Omit<User, 'password'>`)
The version of user data sent to and used by the frontend. All auth responses and API endpoints return `UserPublic`, never `User`.

### `assignmentScope` (teachers only)
Controls which classes a teacher can assign their courses to:
- `'organization'` — teacher can assign to any class in the org
- `'class'` — teacher can only assign to specific permitted classes

Configured by the admin in User Management.

### `UserCreatePayload`
```ts
interface UserCreatePayload {
  organizationId: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  assignmentScope?: 'organization' | 'class'
}
```

### `UserUpdatePayload`
```ts
interface UserUpdatePayload {
  firstName?: string
  lastName?: string
  email?: string
  role?: UserRole
  assignmentScope?: 'organization' | 'class'
}
```

---

## Class (`src/types/class.ts`)

### `Class`
```ts
interface Class {
  id: string
  organizationId: string
  name: string
  description?: string
  teacherIds: string[]    // Users with role=teacher linked to this class
  studentIds: string[]    // Users with role=student enrolled in this class
  isArchived: boolean
  createdAt: string
}
```
A student belongs to **one class**. The `teacherIds` relationship is informational and controls which teachers see the class in their assignment scope when `assignmentScope = 'class'`.

### `ClassCreatePayload`
```ts
interface ClassCreatePayload {
  organizationId: string
  name: string
  description?: string
  teacherIds?: string[]   // Can optionally assign teachers at creation
}
```

### `ClassUpdatePayload`
```ts
interface ClassUpdatePayload {
  name?: string
  description?: string
  teacherIds?: string[]
}
```

---

## Course (`src/types/course.ts`)

### `CourseVisibility`
```ts
type CourseVisibility = 'private' | 'class' | 'public'
```
- `private` — only the teacher who created it can see it
- `class` — visible to students in classes the course is assigned to
- `public` — visible to all students in the organization (browse tab)

### `Course`
```ts
interface Course {
  id: string
  organizationId: string
  teacherId: string              // Creator and owner
  title: string
  description: string
  coverImageUrl?: string
  visibility: CourseVisibility
  classIds: string[]             // Classes this course is assigned to
  enrolledStudentIds: string[]   // Students with direct access
  isArchived: boolean
  createdAt: string
  updatedAt: string
}
```

### `CourseCreatePayload`
```ts
interface CourseCreatePayload {
  organizationId: string
  teacherId: string
  title: string
  description: string
  visibility: CourseVisibility
}
```

### `CourseUpdatePayload`
```ts
interface CourseUpdatePayload {
  title?: string
  description?: string
  visibility?: CourseVisibility
  classIds?: string[]
}
```

---

## Content (`src/types/content.ts`)

### `ResourceType`
```ts
type ResourceType = 'chapter' | 'text' | 'file' | 'video' | 'test'
```
- `chapter` — container node (has children, no content of its own)
- `text` — markdown text content (`textContent` field)
- `file` — downloadable file (`fileUrl`, `fileName`)
- `video` — embedded video (`videoUrl`, optional `duration`)
- `test` — links to a `Test` entity (`testId`)

### `ContentNode` (flat representation — what the API returns)
```ts
interface ContentNode {
  id: string
  courseId: string
  parentId: string | null   // null = root chapter
  type: ResourceType
  title: string
  order: number             // Sort order among siblings
  textContent?: string      // Markdown string (type=text)
  fileUrl?: string          // (type=file)
  fileName?: string         // (type=file)
  videoUrl?: string         // Embed URL (type=video)
  duration?: number         // Seconds (type=video)
  testId?: string           // (type=test)
}
```

### `ContentTreeNode` (hierarchical representation — built client-side)
```ts
interface ContentTreeNode extends ContentNode {
  children: ContentTreeNode[]
}
```
Built by `src/lib/contentTree.ts → buildTree(nodes)` from the flat API response. Flattened back with `flattenTree(tree)` before sending to the API.

**Tree structure example:**
```
Chapter 1 (parentId: null)
├── Lesson 1 - text (parentId: chapter1.id)
├── Lesson 2 - video (parentId: chapter1.id)
└── Chapter 1 Quiz - test (parentId: chapter1.id)
Chapter 2 (parentId: null)
└── ...
```

---

## Test (`src/types/test.ts`)

### `QuestionType`
```ts
type QuestionType = 'single' | 'multiple' | 'true_false'
```
- `single` — one correct answer
- `multiple` — one or more correct answers
- `true_false` — boolean options

### `AnswerOption`
```ts
interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
}
```

### `Question`
```ts
interface Question {
  id: string
  testId: string
  text: string
  type: QuestionType
  options: AnswerOption[]
  explanation?: string   // Shown in results page
  topicTag?: string      // Used for AI generation targeting
}
```

### `Test`
```ts
interface Test {
  id: string
  courseId: string
  contentNodeId?: string    // Set when test is attached to a ContentNode (type=test)
  title: string
  questions: Question[]
  isAIGenerated: boolean
  createdAt: string
}
```
Tests can be **pre-made** (created in the Test Editor and linked to a course via `ContentNode`) or **AI-generated on demand** (generated per session from selected topics). Both go through `TestSession` for tracking.

### `TestSessionStatus`
```ts
type TestSessionStatus = 'in_progress' | 'submitted' | 'timed_out'
```

### `SessionAnswer`
```ts
interface SessionAnswer {
  questionId: string
  selectedOptionIds: string[]   // Supports multiple-choice
  isCorrect?: boolean           // Set after submission
  isFlagged?: boolean           // Flagged by student during test
}
```

### `TestSession`
```ts
interface TestSession {
  id: string
  studentId: string
  courseId: string
  testId: string
  startedAt: string
  submittedAt?: string
  timeLimitSeconds?: number       // null = no timer
  selectedTopics: string[]        // ContentNode IDs used for AI generation
  questionCount: number
  questions: Question[]           // Embedded snapshot of questions at session start
  answers: SessionAnswer[]
  score?: number                  // 0-100, set after submission
  status: TestSessionStatus
}
```
Questions are **embedded** in the session (snapshot), not referenced by ID. This ensures the session record is immutable after creation — editing a test later doesn't affect past sessions.

### `QuestionReport`
```ts
interface QuestionReport {
  questionId: string
  testSessionId: string
  reason: 'wrong_answer' | 'unclear_question' | 'outdated_content' | 'other'
  note?: string
}
```
Students can report AI-generated questions they believe are incorrect. Reason is an enum (not free text) in MVP.

---

## Progress (`src/types/progress.ts`)

### `ResourceProgress`
```ts
interface ResourceProgress {
  contentNodeId: string
  completed: boolean
  completedAt?: string       // ISO date
  timeSpentSeconds: number
}
```

### `CourseProgress`
```ts
interface CourseProgress {
  id: string
  studentId: string
  courseId: string
  resourceProgress: ResourceProgress[]
  completionPercent: number         // 0-100, calculated server-side
  lastAccessedAt: string
  testSessionIds: string[]          // All sessions for this student+course
}
```

### `ActivityType`
```ts
type ActivityType = 'resource_viewed' | 'test_submitted' | 'course_enrolled'
```

### `ActivityEntry`
```ts
interface ActivityEntry {
  id: string
  studentId: string
  type: ActivityType
  courseId?: string
  resourceId?: string
  testSessionId?: string
  timestamp: string
  meta?: Record<string, string | number>
}
```

### `ProgressSummary`
```ts
interface ProgressSummary {
  activeCourses: number
  completedCourses: number
  totalTestsTaken: number
  averageScore: number
  totalTimeSpentSeconds: number
}
```

---

## Entity Relationship Map

```
Organization
├── has many Users (admin, teacher, student)
├── has many Classes
└── has many Courses (via teacher's organizationId)

User (role=admin)
└── manages the Organization

User (role=teacher)
├── creates Courses (teacherId)
└── assignmentScope controls which Classes they can assign courses to

User (role=student)
├── belongs to one Class (via Class.studentIds)
├── enrolled in Courses (via Course.enrolledStudentIds or class-based access)
├── has CourseProgress per Course
└── has TestSessions per Test

Class
├── belongs to Organization
├── has many Students (studentIds)
└── has many Teachers (teacherIds) — informational, controls assignment scope

Course
├── belongs to Organization + Teacher
├── assigned to Classes (classIds)
├── has enrolled Students (enrolledStudentIds)
└── has ContentNode tree

ContentNode (flat list, hierarchical via parentId)
├── type=chapter → container (has children)
├── type=text → textContent (markdown)
├── type=video → videoUrl
├── type=file → fileUrl + fileName
└── type=test → testId → Test

Test
├── belongs to Course
├── optionally linked to a ContentNode (contentNodeId)
└── has Questions → AnswerOptions

TestSession
├── belongs to Student + Course + Test
├── embeds Questions snapshot
├── has SessionAnswers
└── score set on submission

CourseProgress
├── belongs to Student + Course
├── has ResourceProgress[] (per ContentNode)
└── references TestSession IDs
```
