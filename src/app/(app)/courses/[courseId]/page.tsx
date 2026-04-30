'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Tabs from '@/components/ui/Tabs'
import Spinner from '@/components/ui/Spinner'
import ContentTreeReadOnly from '@/components/courses/ContentTreeReadOnly'
import CourseFormModal from '@/components/courses/CourseFormModal'
import MarkdownContent from '@/components/ui/MarkdownContent'
import { useAppSelector } from '@/store/hooks'
import { useGetCourseQuery, useUpdateCourseMutation } from '@/services/coursesApi'
import type { ChapterWithLessons, CourseVisibility, Lesson } from '@/types'

const TABS = [{ id: 'content', label: 'Content' }, { id: 'info', label: 'Info' }]
const VIS: Record<string, 'neutral' | 'info' | 'success'> = { PRIVATE: 'neutral', PUBLIC: 'success' }

function TeacherCourseDetail({ courseId }: { courseId: string }) {
  const [tab, setTab] = useState('content')
  const [editOpen, setEditOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const { data: course, isLoading } = useGetCourseQuery(courseId)
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation()
  const chapters: ChapterWithLessons[] = course?.chapters ?? []

  async function handleSave(data: { title: string; description: string; visibility: CourseVisibility }) {
    await updateCourse({ id: courseId, ...data }).unwrap()
    setEditOpen(false)
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!course) return <div className="text-center py-20 text-on-surface-faint">Course not found</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm text-on-surface-muted">
        <Link href="/courses" className="hover:opacity-70 transition-opacity text-brand">My Courses</Link>
        <span className="text-on-surface-faint">/</span>
        <span className="font-medium text-on-surface">{course.title}</span>
      </div>

      <div className="bg-surface-raised rounded-2xl border p-6 mb-6 border-surface-border">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-on-surface">{course.title}</h1>
              <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
              <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'neutral'}>{course.status}</Badge>
            </div>
            <p className="text-on-surface-muted">{course.description}</p>
            <p className="text-xs mt-2 text-on-surface-faint">
              Updated {new Date(course.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
            <Link href={`/courses/${courseId}/editor`}>
              <Button variant="secondary">Content Editor</Button>
            </Link>
            <Link href={`/courses/${courseId}/test-editor`}>
              <Button variant="primary">Test Editor</Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === 'content' && (
          <div className="border border-surface-border rounded-2xl overflow-hidden flex h-[65vh] min-h-96">
            {/* Left: content tree */}
            <div className="w-72 shrink-0 bg-surface-raised border-r border-surface-border flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                <ContentTreeReadOnly
                  chapters={chapters}
                  selectedId={selectedLesson?.id ?? null}
                  onSelect={l => setSelectedLesson(l)}
                />
              </div>
            </div>
            {/* Right: lesson preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-surface">
              {!selectedLesson ? (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-faint gap-2">
                  <div className="text-4xl">👆</div>
                  <p className="text-sm">Select a lesson to preview</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-on-surface mb-4">{selectedLesson.title}</h2>
                  <div className="bg-surface-raised border border-surface-border rounded-xl p-6 mb-4">
                    <MarkdownContent>{selectedLesson.contentMarkdown ?? ''}</MarkdownContent>
                  </div>
                  {selectedLesson.lessonResources.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {selectedLesson.lessonResources.map(r => (
                        <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand hover:underline">
                          <span>📎</span><span>{r.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'info' && (
          <div className="bg-surface-raised rounded-2xl border p-6 border-surface-border space-y-3">
            <div>
              <p className="text-xs uppercase font-medium text-on-surface-faint">Category</p>
              <p className="text-sm text-on-surface mt-0.5">{course.category ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-on-surface-faint">Status</p>
              <p className="text-sm text-on-surface mt-0.5">{course.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-on-surface-faint">Visibility</p>
              <p className="text-sm text-on-surface mt-0.5">{course.visibility}</p>
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-on-surface-faint">Chapters</p>
              <p className="text-sm text-on-surface mt-0.5">{chapters.length}</p>
            </div>
          </div>
        )}
      </div>

      <CourseFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initialData={course}
        mode="edit"
        isLoading={updating}
      />
    </div>
  )
}

function StudentCourseEntry({ courseId }: { courseId: string }) {
  redirect(`/courses/${courseId}/study`)
  return null
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const role = useAppSelector(s => s.auth.user?.role)

  if (role === 'teacher') return <TeacherCourseDetail courseId={courseId} />
  if (role === 'student') return <StudentCourseEntry courseId={courseId} />
  return null
}
