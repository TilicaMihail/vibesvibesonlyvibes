'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import EmptyState from '@/components/ui/EmptyState'
import ClassFormModal from '@/components/classes/ClassFormModal'
import { useGetClassesQuery, useCreateClassMutation } from '@/services/classesApi'
import { useGetUsersQuery } from '@/services/usersApi'
import { useGetOrganizationQuery } from '@/services/organizationsApi'
import type { Class } from '@/types'

// ---------------------------------------------------------------------------
// Class card
// ---------------------------------------------------------------------------
function ClassCard({ cls }: { cls: Class }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden">
      <div className="flex-1 p-5">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{cls.name}</h3>
        {cls.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{cls.description}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {cls.teacherIds.length} teacher{cls.teacherIds.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {cls.studentIds.length} student{cls.studentIds.length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-400">
          Created{' '}
          {new Date(cls.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
        <Link
          href={`/admin/classes/${cls.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Manage &rarr;
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-full rounded bg-gray-100" />
      <div className="h-4 w-2/3 rounded bg-gray-100" />
      <div className="mt-4 flex gap-4">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-3 w-20 rounded bg-gray-100" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ClassesPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const { data: classes, isLoading: classesLoading } = useGetClassesQuery(
    search ? { search } : undefined,
  )
  const { data: teachersData, isLoading: teachersLoading } = useGetUsersQuery(
    { role: 'teacher' },
    { skip: !createOpen },
  )
  const { data: org } = useGetOrganizationQuery()
  const [createClass, { isLoading: creating }] = useCreateClassMutation()

  const teachers = teachersData?.users ?? []

  async function handleCreate(values: {
    name: string
    description: string
    teacherIds: string[]
  }) {
    if (!org) return
    await createClass({
      organizationId: org.id,
      name: values.name,
      description: values.description || undefined,
      teacherIds: values.teacherIds,
    })
    setCreateOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          {!classesLoading && (
            <p className="mt-1 text-sm text-gray-500">
              {classes?.length ?? 0} class{(classes?.length ?? 0) !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
        <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
          Create Class
        </Button>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search classes…"
        className="w-full sm:w-80"
      />

      {/* Grid */}
      {classesLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !classes || classes.length === 0 ? (
        <EmptyState
          title={search ? `No classes matching "${search}"` : 'No classes yet'}
          description={
            search
              ? 'Try a different search term.'
              : 'Create your first class to get students and teachers started.'
          }
          action={
            search
              ? undefined
              : { label: 'Create Class', onClick: () => setCreateOpen(true) }
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <ClassFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        teachers={teachers}
        mode="create"
        isLoading={creating || teachersLoading}
      />
    </div>
  )
}
