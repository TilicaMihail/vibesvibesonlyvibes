'use client'
import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import Tabs from '@/components/ui/Tabs'
import EmptyState from '@/components/ui/EmptyState'
import CardBanner from '@/components/ui/CardBanner'
import ProgressBar from '@/components/ui/ProgressBar'
import CourseFormModal from '@/components/courses/CourseFormModal'
import { useAppSelector } from '@/store/hooks'
import { useGetCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation, useEnrollStudentMutation } from '@/services/coursesApi'
import { useGetUserProgressQuery } from '@/services/progressApi'
import type { Course, CourseVisibility } from '@/types'

const VIS: Record<string, 'neutral' | 'info' | 'success'> = { private: 'neutral', class: 'info', public: 'success' }

// ─── Teacher view ────────────────────────────────────────────────────────────

const TEACHER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
]

function TeacherCourseCard({ course, onEdit }: { course: Course; onEdit: (c: Course) => void }) {
  return (
    <div className="relative rounded-2xl border bg-surface-raised overflow-hidden transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 flex flex-col border-surface-border">
      <button
        onClick={(e) => { e.preventDefault(); onEdit(course) }}
        className="cursor-pointer absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-black/20 hover:bg-black/40 text-white"
        title="Edit course"
        aria-label="Edit course"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2l2 2-7 7H3v-2l7-7z" />
        </svg>
      </button>
      <Link href={`/courses/${course.id}`} className="flex flex-col flex-1">
        <CardBanner id={course.id} title={course.title} />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold leading-tight text-on-surface">{course.title}</h3>
            <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
          </div>
          <p className="text-sm line-clamp-2 mb-4 text-on-surface-muted">{course.description}</p>
          <div className="flex items-center justify-between text-xs text-on-surface-faint">
            <span>{course.enrolledStudentIds.length} students</span>
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

function TeacherView() {
  const user = useAppSelector(s => s.auth.user)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)

  const { data: courses = [], isLoading } = useGetCoursesQuery({
    teacherId: user?.id ?? '',
    tab: tab === 'all' ? undefined : tab,
    search: search || undefined,
  }, { skip: !user?.id })

  const [createCourse, { isLoading: creating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation()

  async function handleSave(data: { title: string; description: string; visibility: CourseVisibility }) {
    if (editCourse) {
      await updateCourse({ id: editCourse.id, ...data }).unwrap()
    } else {
      await createCourse({ ...data, organizationId: user!.organizationId, teacherId: user!.id }).unwrap()
    }
    setModalOpen(false)
    setEditCourse(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">My Courses</h1>
          <p className="text-sm mt-1 text-on-surface-muted">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" onClick={() => { setEditCourse(null); setModalOpen(true) }}>+ New Course</Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Tabs tabs={TEACHER_TABS} activeTab={tab} onChange={setTab} />
        <div className="sm:ml-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border overflow-hidden border-surface-border">
              <div className="h-32 bg-surface-border" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-surface-border" />
                <div className="h-4 w-full rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description={search ? 'Try a different search term' : 'Create your first course to get started'}
          action={{ label: 'Create Course', onClick: () => setModalOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <TeacherCourseCard key={course.id} course={course} onEdit={(c) => { setEditCourse(c); setModalOpen(true) }} />
          ))}
        </div>
      )}

      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditCourse(null) }}
        onSave={handleSave}
        initialData={editCourse ?? undefined}
        mode={editCourse ? 'edit' : 'create'}
        isLoading={creating || updating}
      />
    </div>
  )
}

// ─── Student view ─────────────────────────────────────────────────────────────

const STUDENT_TABS = [
  { id: 'assigned', label: 'My Courses' },
  { id: 'public', label: 'Browse' },
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function StudentView() {
  const user = useAppSelector(s => s.auth.user)
  const [tab, setTab] = useState('assigned')
  const [search, setSearch] = useState('')

  const { data: courses = [], isLoading } = useGetCoursesQuery(
    tab === 'assigned' ? { tab: 'assigned', studentId: user?.id ?? '' } : { tab: 'public', search: search || undefined },
    { skip: !user?.id }
  )
  const { data: progressList = [] } = useGetUserProgressQuery(user?.id ?? '', { skip: !user?.id })
  const [enroll] = useEnrollStudentMutation()

  const filtered = tab === 'assigned' && search
    ? courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses

  function getProgress(courseId: string) {
    return progressList.find(p => p.courseId === courseId)?.completionPercent ?? 0
  }

  function isEnrolled(course: Course) {
    return course.enrolledStudentIds.includes(user?.id ?? '')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">
          {getGreeting()}, {user?.firstName ?? 'there'}!
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          {tab === 'assigned'
            ? `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} assigned.`
            : 'Explore public courses available in your organisation.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <Tabs tabs={STUDENT_TABS} activeTab={tab} onChange={setTab} />
        <div className="sm:ml-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse rounded-2xl border overflow-hidden border-surface-border">
              <div className="h-32 bg-surface-border" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-surface-border" />
                <div className="h-4 w-full rounded bg-surface" />
                <div className="h-2 w-full rounded-full bg-surface" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={tab === 'assigned' ? 'No courses assigned' : 'No public courses'}
          description={tab === 'assigned' ? 'Your teacher will assign courses to you.' : 'Check back later for public courses.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => {
            const pct = getProgress(course.id)
            const enrolled = isEnrolled(course)
            return (
              <div key={course.id} className="rounded-2xl border bg-surface-raised overflow-hidden flex flex-col transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 border-surface-border">
                {enrolled ? (
                  <Link href={`/courses/${course.id}/study`} className="flex flex-col flex-1">
                    <CardBanner id={course.id} title={course.title} />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold leading-tight text-on-surface">{course.title}</h3>
                        <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
                      </div>
                      <p className="text-sm line-clamp-2 mb-4 text-on-surface-muted">{course.description}</p>
                      <div className="mb-1 flex justify-between text-xs text-on-surface-faint">
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <ProgressBar value={pct} size="sm" color={pct >= 80 ? 'green' : 'brand'} />
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col flex-1">
                    <CardBanner id={course.id} title={course.title} />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold leading-tight text-on-surface">{course.title}</h3>
                        <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
                      </div>
                      <p className="text-sm line-clamp-2 mb-4 text-on-surface-muted">{course.description}</p>
                      <Button variant="secondary" fullWidth onClick={() => enroll({ courseId: course.id, studentId: user!.id })}>
                        Enroll
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Role-aware page ──────────────────────────────────────────────────────────

export default function CoursesPage() {
  const role = useAppSelector(s => s.auth.user?.role)
  if (role === 'teacher') return <TeacherView />
  if (role === 'student') return <StudentView />
  return null
}
