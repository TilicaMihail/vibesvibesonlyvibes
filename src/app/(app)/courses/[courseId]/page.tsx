'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Tabs from '@/components/ui/Tabs'
import Spinner from '@/components/ui/Spinner'
import Avatar from '@/components/ui/Avatar'
import ContentTreeReadOnly from '@/components/courses/ContentTreeReadOnly'
import CourseFormModal from '@/components/courses/CourseFormModal'
import MarkdownContent from '@/components/ui/MarkdownContent'
import { useAppSelector } from '@/store/hooks'
import { useGetCourseQuery, useGetCourseContentQuery, useGetCourseEnrollmentsQuery, useUpdateCourseMutation } from '@/services/coursesApi'
import type { ContentNode, CourseVisibility } from '@/types'

const TABS = [{ id: 'content', label: 'Content' }, { id: 'students', label: 'Students' }]
const VIS: Record<string, 'neutral' | 'info' | 'success'> = { private: 'neutral', class: 'info', public: 'success' }

function TeacherCourseDetail({ courseId }: { courseId: string }) {
  const [tab, setTab] = useState('content')
  const [editOpen, setEditOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: course, isLoading } = useGetCourseQuery(courseId)
  const { data: nodes = [] } = useGetCourseContentQuery(courseId)
  const { data: students = [] } = useGetCourseEnrollmentsQuery(courseId)
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation()

  async function handleSave(data: { title: string; description: string; visibility: CourseVisibility }) {
    await updateCourse({ id: courseId, ...data }).unwrap()
    setEditOpen(false)
  }

  const selectedNode: ContentNode | null = nodes.find(n => n.id === selectedId) ?? null

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
            </div>
            <p className="text-on-surface-muted">{course.description}</p>
            <p className="text-xs mt-2 text-on-surface-faint">
              {course.enrolledStudentIds.length} enrolled · Updated {new Date(course.updatedAt).toLocaleDateString()}
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
                  nodes={nodes}
                  selectedId={selectedId}
                  onSelect={n => setSelectedId(n.id)}
                />
              </div>
            </div>
            {/* Right: content preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-surface">
              {!selectedNode ? (
                <div className="flex flex-col items-center justify-center h-full text-on-surface-faint gap-2">
                  <div className="text-4xl">👆</div>
                  <p className="text-sm">Select a resource to preview</p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold text-on-surface mb-4">{selectedNode.title}</h2>
                  {selectedNode.type === 'text' && (
                    <div className="bg-surface-raised border border-surface-border rounded-xl p-6">
                      <MarkdownContent>{selectedNode.textContent ?? ''}</MarkdownContent>
                    </div>
                  )}
                  {selectedNode.type === 'video' && selectedNode.videoUrl && (
                    <div className="rounded-xl overflow-hidden border border-surface-border">
                      <iframe
                        src={selectedNode.videoUrl}
                        className="w-full aspect-video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {selectedNode.type === 'video' && !selectedNode.videoUrl && (
                    <div className="bg-surface-raised border border-surface-border rounded-xl p-6 text-on-surface-faint text-sm">No video URL set.</div>
                  )}
                  {selectedNode.type === 'file' && (
                    <div className="bg-surface-raised border border-surface-border rounded-xl p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center text-2xl">📎</div>
                      <div>
                        <p className="font-medium text-on-surface">{selectedNode.fileName ?? 'File'}</p>
                        <a href={selectedNode.fileUrl ?? '#'} className="text-sm text-brand hover:underline">Download</a>
                      </div>
                    </div>
                  )}
                  {selectedNode.type === 'test' && (
                    <div className="bg-surface-raised border border-surface-border rounded-xl p-6">
                      <p className="font-medium text-on-surface">Test</p>
                      <p className="text-sm mt-1 text-on-surface-muted">Tests are managed in the Test Editor.</p>
                      <Link href={`/courses/${courseId}/test-editor`} className="text-sm text-brand hover:underline mt-2 inline-block">Go to Test Editor →</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'students' && (
          <div className="bg-surface-raised rounded-2xl border overflow-hidden border-surface-border">
            {students.length === 0 ? (
              <div className="py-12 text-center text-on-surface-faint">No students enrolled yet</div>
            ) : (
              <table className="w-full">
                <thead className="border-b bg-surface border-surface-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase text-brand">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase text-brand">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase text-brand">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b last:border-0 border-surface">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                        <span className="text-sm font-medium text-on-surface">{s.firstName} {s.lastName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-on-surface-muted">{s.email}</td>
                      <td className="px-4 py-3"><Badge variant={s.isActive ? 'success' : 'danger'}>{s.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
