'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import ClassFormModal from '@/components/classes/ClassFormModal'
import StudentEnrollmentPanel from '@/components/classes/StudentEnrollmentPanel'
import { useGetClassQuery, useUpdateClassMutation } from '@/services/classesApi'
import { useGetUsersQuery } from '@/services/usersApi'

export default function ClassManagementPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = use(params)
  const [editOpen, setEditOpen] = useState(false)

  const { data: cls, isLoading: classLoading } = useGetClassQuery(classId)
  const { data: teachersData, isLoading: teachersLoading } = useGetUsersQuery(
    { role: 'teacher' },
    { skip: !editOpen },
  )
  const [updateClass, { isLoading: updating }] = useUpdateClassMutation()

  const teachers = teachersData?.users ?? []
  const classTeachers = cls?.teachers ?? []

  async function handleEdit(values: { name: string; description: string; teacherIds: string[] }) {
    await updateClass({
      id: classId,
      name: values.name,
      description: values.description || undefined,
      teacherIds: values.teacherIds,
    })
    setEditOpen(false)
  }

  if (classLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 rounded bg-surface-border" />
          <div className="h-8 w-64 rounded bg-surface-border" />
        </div>
        <div className="rounded-2xl border p-6 space-y-4 bg-surface-raised border-surface-border" >
          <div className="h-6 w-48 rounded bg-surface-border" />
          <div className="h-4 w-full rounded bg-surface" />
          <div className="h-4 w-3/4 rounded bg-surface" />
        </div>
        <div className="h-48 rounded-2xl border bg-surface-raised border-surface-border"  />
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-on-surface-muted">Class not found.</p>
        <Link href="/classes" className="mt-4 inline-block text-sm hover:opacity-70 transition-opacity text-brand" >
          &larr; Back to Classes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1 text-sm transition-opacity hover:opacity-70 text-brand"
          
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Classes
        </Link>
        <span className="text-on-surface-faint">/</span>
        <h1 className="text-2xl font-bold text-on-surface" >{cls.name}</h1>
        {cls.isArchived && <Badge variant="warning">Archived</Badge>}
      </div>

      {/* Class info card */}
      <div className="rounded-2xl border bg-surface-raised p-6 border-surface-border" >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-on-surface" >{cls.name}</h2>
            {cls.description && (
              <p className="mt-1 text-sm text-on-surface-muted" >{cls.description}</p>
            )}

            {/* Teachers */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide mb-2 text-on-surface-faint" >Teachers</p>
              {classTeachers.length === 0 ? (
                <p className="text-sm italic text-on-surface-faint" >No teachers assigned.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {classTeachers.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3 py-1"
                    >
                      <Avatar name={`${t.firstName} ${t.lastName}`} avatarUrl={t.avatarUrl} size="sm" />
                      <span className="text-sm text-on-surface-muted" >{t.firstName} {t.lastName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-on-surface-faint" >
              Created{' '}
              {new Date(cls.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)} className="shrink-0">
            Edit Class
          </Button>
        </div>
      </div>

      {/* Students section */}
      <div className="rounded-2xl border bg-surface-raised p-6 border-surface-border" >
        <h2 className="text-base font-semibold mb-4 text-on-surface" >Students</h2>
        <StudentEnrollmentPanel classId={classId} currentStudentIds={cls.studentIds} />
      </div>

      {/* Edit Modal */}
      <ClassFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        initialValues={{
          name: cls.name,
          description: cls.description ?? '',
          teacherIds: cls.teacherIds,
        }}
        teachers={teachers}
        mode="edit"
        isLoading={updating || teachersLoading}
      />
    </div>
  )
}
