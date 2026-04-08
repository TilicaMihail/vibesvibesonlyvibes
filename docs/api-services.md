# API Services

## Base Setup

**File:** `src/services/baseApi.ts`

All service files extend `baseApi` using RTK Query's `injectEndpoints`. Configuration:
- Base URL: `/api`
- Auth: `prepareHeaders` injects `Authorization: Bearer <token>` from `store.getState().auth.token`
- Tag types registered: `User`, `Class`, `Course`, `Content`, `Test`, `TestSession`, `Progress`, `Organization`

---

## Auth (`src/services/authApi.ts`)

### `login`
- **POST** `/auth/login`
- **Request:** `{ email: string, password: string }`
- **Response:** `{ token: string, user: UserPublic }`
- **Tags:** none
- **Hook:** `useLoginMutation`

### `register`
- **POST** `/auth/register`
- **Request:** `{ organizationName, organizationSlug, adminEmail, adminPassword, adminFirstName, adminLastName }`
- **Response:** `{ token: string, user: UserPublic, organizationId: string }`
- **Tags:** none
- **Hook:** `useRegisterMutation`

---

## Organizations (`src/services/organizationsApi.ts`)

### `getOrganization`
- **GET** `/organizations`
- **Request:** none (returns the org of the authenticated user)
- **Response:** `Organization`
- **Provides:** `['Organization', 'CURRENT']`
- **Hook:** `useGetOrganizationQuery`

### `updateOrganization`
- **PUT** `/organizations`
- **Request:** `Partial<Organization>` (name, slug, logoUrl, description)
- **Response:** `Organization`
- **Invalidates:** `['Organization', 'CURRENT']`
- **Hook:** `useUpdateOrganizationMutation`

---

## Users (`src/services/usersApi.ts`)

### `getUsers`
- **GET** `/users`
- **Request params:** `{ role?: UserRole, search?: string, page?: number, limit?: number }`
- **Response:** `{ users: UserPublic[], total: number, page: number, limit: number }`
- **Provides:** `['User', 'LIST']` + one tag per user id
- **Hook:** `useGetUsersQuery`

### `getUser`
- **GET** `/users/{userId}`
- **Response:** `UserPublic`
- **Provides:** `['User', userId]`
- **Hook:** `useGetUserQuery`

### `createUser`
- **POST** `/users`
- **Request:** `UserCreatePayload` (organizationId, email, password, firstName, lastName, role, assignmentScope?)
- **Response:** `UserPublic`
- **Invalidates:** `['User', 'LIST']`
- **Hook:** `useCreateUserMutation`
- **Note:** Backend sends a temporary password to the user's email.

### `updateUser`
- **PUT** `/users/{id}`
- **Request:** `{ id: string } & UserUpdatePayload`
- **Response:** `UserPublic`
- **Invalidates:** `['User', id]`, `['User', 'LIST']`
- **Hook:** `useUpdateUserMutation`

### `toggleUserActive`
- **PATCH** `/users/{userId}`
- **Request:** `{ userId: string }` (toggles `isActive`)
- **Response:** `UserPublic`
- **Invalidates:** `['User', userId]`
- **Hook:** `useToggleUserActiveMutation`

---

## Classes (`src/services/classesApi.ts`)

### `getClasses`
- **GET** `/classes`
- **Request params:** `{ search?: string }`
- **Response:** `Class[]`
- **Provides:** `['Class', 'LIST']` + one tag per class id
- **Hook:** `useGetClassesQuery`

### `getClass`
- **GET** `/classes/{classId}`
- **Response:** `Class` (with populated teachers and students — `ClassWithMembers`)
- **Provides:** `['Class', classId]`
- **Hook:** `useGetClassQuery`

### `createClass`
- **POST** `/classes`
- **Request:** `ClassCreatePayload` (organizationId, name, description?, teacherIds?)
- **Response:** `Class`
- **Invalidates:** `['Class', 'LIST']`
- **Hook:** `useCreateClassMutation`

### `updateClass`
- **PUT** `/classes/{id}`
- **Request:** `{ id: string } & ClassUpdatePayload`
- **Response:** `Class`
- **Invalidates:** `['Class', id]`, `['Class', 'LIST']`
- **Hook:** `useUpdateClassMutation`

### `updateClassStudents`
- **PUT** `/classes/{classId}/students`
- **Request:** `{ classId: string, studentIds: string[] }` — replaces the full student list
- **Response:** `Class`
- **Invalidates:** `['Class', classId]`
- **Hook:** `useUpdateClassStudentsMutation`

### `getClassStudents`
- **GET** `/classes/{classId}/students`
- **Response:** `UserPublic[]`
- **Provides:** `['Class', classId]`
- **Hook:** `useGetClassStudentsQuery`

---

## Courses (`src/services/coursesApi.ts`)

### `getCourses`
- **GET** `/courses`
- **Request params:** `{ teacherId?: string, tab?: 'owned' | 'assigned' | 'public', search?: string, studentId?: string }`
- **Response:** `Course[]`
- **Provides:** `['Course', 'LIST']` + one tag per course id
- **Hook:** `useGetCoursesQuery`

### `getCourse`
- **GET** `/courses/{courseId}`
- **Response:** `Course`
- **Provides:** `['Course', courseId]`
- **Hook:** `useGetCourseQuery`

### `createCourse`
- **POST** `/courses`
- **Request:** `CourseCreatePayload`
- **Response:** `Course`
- **Invalidates:** `['Course', 'LIST']`
- **Hook:** `useCreateCourseMutation`

### `updateCourse`
- **PUT** `/courses/{id}`
- **Request:** `{ id: string } & CourseUpdatePayload`
- **Response:** `Course`
- **Invalidates:** `['Course', id]`, `['Course', 'LIST']`
- **Hook:** `useUpdateCourseMutation`

### `getCourseContent`
- **GET** `/courses/{courseId}/content`
- **Response:** `ContentNode[]` (flat list — build tree client-side with `buildTree()`)
- **Provides:** `['Content', courseId]`
- **Hook:** `useGetCourseContentQuery`

### `updateCourseContent`
- **PUT** `/courses/{courseId}/content`
- **Request:** `{ courseId: string, content: ContentNode[] }` (full flat list replacement)
- **Response:** `ContentNode[]`
- **Invalidates:** `['Content', courseId]`
- **Hook:** `useUpdateCourseContentMutation`

### `getCourseEnrollments`
- **GET** `/courses/{courseId}/enrollments`
- **Response:** `UserPublic[]`
- **Provides:** `['Course', courseId]`
- **Hook:** `useGetCourseEnrollmentsQuery`

### `enrollStudent`
- **POST** `/courses/{courseId}/enrollments`
- **Request:** `{ courseId: string, studentId: string }`
- **Response:** `void`
- **Invalidates:** `['Course', courseId]`
- **Hook:** `useEnrollStudentMutation`

### `unenrollStudent`
- **DELETE** `/courses/{courseId}/enrollments`
- **Request:** `{ courseId: string, studentId: string }`
- **Response:** `void`
- **Invalidates:** `['Course', courseId]`
- **Hook:** `useUnenrollStudentMutation`

---

## Tests (`src/services/testsApi.ts`)

### `getCourseTests`
- **GET** `/courses/{courseId}/tests`
- **Response:** `Test[]`
- **Provides:** `['Test', 'LIST']`, `['Test', 'COURSE-{courseId}']`
- **Hook:** `useGetCourseTestsQuery`

### `getTest`
- **GET** `/courses/{courseId}/tests/{testId}`
- **Response:** `Test`
- **Provides:** `['Test', testId]`
- **Hook:** `useGetTestQuery`

### `createTest`
- **POST** `/courses/{courseId}/tests`
- **Request:** `{ courseId: string, body: Partial<Test> }` (title, questions, isAIGenerated, contentNodeId?)
- **Response:** `Test`
- **Invalidates:** `['Test', 'COURSE-{courseId}']`
- **Hook:** `useCreateTestMutation`

### `updateTest`
- **PUT** `/courses/{courseId}/tests/{testId}`
- **Request:** `{ courseId, testId, body: Partial<Test> }`
- **Response:** `Test`
- **Invalidates:** `['Test', testId]`, `['Test', 'COURSE-{courseId}']`
- **Hook:** `useUpdateTestMutation`

### `generateTest`
- **POST** `/courses/{courseId}/tests/generate`
- **Request:** `{ courseId: string, topics: string[], count: number, title?: string }`
- **Response:** `{ questions: Question[] }` — draft only, not saved until `createTest` is called
- **Tags:** none (does not affect cache — result is ephemeral)
- **Hook:** `useGenerateTestMutation`

---

## Test Sessions (`src/services/testSessionsApi.ts`)

### `getTestSessions`
- **GET** `/test-sessions`
- **Request params:** `{ studentId: string, courseId: string }`
- **Response:** `TestSession[]`
- **Provides:** `['TestSession', 'LIST']`
- **Hook:** `useGetTestSessionsQuery`

### `createTestSession`
- **POST** `/test-sessions`
- **Request:**
  ```ts
  {
    studentId: string
    courseId: string
    testId?: string           // Omit for AI-generated sessions
    selectedTopics: string[]  // ContentNode IDs
    questionCount: number
    timeLimitSeconds?: number // Omit for no timer
  }
  ```
- **Response:** `TestSession` (with questions embedded)
- **Invalidates:** `['TestSession', 'LIST']`
- **Hook:** `useCreateTestSessionMutation`

### `getTestSession`
- **GET** `/test-sessions/{sessionId}`
- **Response:** `TestSession`
- **Provides:** `['TestSession', sessionId]`
- **Hook:** `useGetTestSessionQuery`

### `submitTestSession`
- **POST** `/test-sessions/{sessionId}/submit`
- **Request:**
  ```ts
  {
    sessionId: string
    answers: { questionId: string, selectedOptionIds: string[] }[]
  }
  ```
- **Response:** `TestSession` (with score and status=submitted)
- **Invalidates:** `['TestSession', sessionId]`, `['Progress', 'LIST']`
- **Hook:** `useSubmitTestSessionMutation`

---

## Progress (`src/services/progressApi.ts`)

### `getUserProgress`
- **GET** `/progress/{userId}`
- **Response:** `CourseProgress[]` — all courses for this student
- **Provides:** `['Progress', userId]`
- **Hook:** `useGetUserProgressQuery`

### `getCourseProgress`
- **GET** `/progress/{userId}?courseId={courseId}`
- **Response:** `CourseProgress` — single course progress record
- **Provides:** `['Progress', '{userId}-{courseId}']`
- **Hook:** `useGetCourseProgressQuery`

### `markResourceComplete`
- **POST** `/progress/{userId}/resource`
- **Request:** `{ userId: string, courseId: string, contentNodeId: string }`
- **Response:** `void`
- **Invalidates:** `['Progress', userId]`, `['Progress', '{userId}-{courseId}']`
- **Hook:** `useMarkResourceCompleteMutation`
- **Note:** Called automatically when student selects a non-chapter resource in the study page.

### `getUserActivity`
- **GET** `/progress/{userId}/activity`
- **Response:** `ActivityEntry[]`
- **Provides:** `['Progress', 'activity-{userId}']`
- **Hook:** `useGetUserActivityQuery`

---

## Cache Invalidation Map

When a mutation fires, these queries automatically re-fetch:

| Mutation | Re-fetches |
|---|---|
| `createUser` | `getUsers` (LIST) |
| `updateUser` | `getUsers` (LIST), `getUser` (id) |
| `toggleUserActive` | `getUser` (id) |
| `createClass` | `getClasses` (LIST) |
| `updateClass` | `getClasses` (LIST), `getClass` (id) |
| `updateClassStudents` | `getClass` (id) |
| `createCourse` | `getCourses` (LIST) |
| `updateCourse` | `getCourses` (LIST), `getCourse` (id) |
| `updateCourseContent` | `getCourseContent` (courseId) |
| `enrollStudent` / `unenrollStudent` | `getCourse` (id), `getCourseEnrollments` |
| `createTest` | `getCourseTests` (courseId) |
| `updateTest` | `getCourseTests` (courseId), `getTest` (id) |
| `createTestSession` | `getTestSessions` (LIST) |
| `submitTestSession` | `getTestSession` (id), `getUserProgress` (userId) |
| `markResourceComplete` | `getCourseProgress` (userId+courseId), `getUserProgress` (userId) |
| `updateOrganization` | `getOrganization` |
