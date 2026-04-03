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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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

  async function handleEdit(values: {
    name: string
    description: string
    teacherIds: string[]
  }) {
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
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-200" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
        <div className="h-48 rounded-xl border border-gray-200 bg-white" />
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-gray-500">Class not found.</p>
        <Link
          href="/admin/classes"
          className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-800"
        >
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
          href="/admin/classes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Classes
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">{cls.name}</h1>
        {cls.isArchived && (
          <Badge variant="warning">Archived</Badge>
        )}
      </div>

      {/* Class info card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900">{cls.name}</h2>
            {cls.description && (
              <p className="mt-1 text-sm text-gray-500">{cls.description}</p>
            )}

            {/* Teachers */}
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                Teachers
              </p>
              {classTeachers.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No teachers assigned.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {classTeachers.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1"
                    >
                      <Avatar
                        name={`${t.firstName} ${t.lastName}`}
                        avatarUrl={t.avatarUrl}
                        size="sm"
                      />
                      <span className="text-sm text-gray-700">
                        {t.firstName} {t.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meta */}
            <p className="mt-3 text-xs text-gray-400">
              Created{' '}
              {new Date(cls.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="shrink-0"
          >
            Edit Class
          </Button>
        </div>
      </div>

      {/* Students section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Students</h2>
        <StudentEnrollmentPanel
          classId={classId}
          currentStudentIds={cls.studentIds}
        />
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
