'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import EmptyState from '@/components/ui/EmptyState'
import CardBanner from '@/components/ui/CardBanner'
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
    <Link
      href={`/classes/${cls.id}`}
      className="flex flex-col rounded-2xl border bg-surface-raised overflow-hidden transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 border-surface-border"
      
    >
      <CardBanner id={cls.id} title={cls.name} />

      <div className="flex-1 p-5">
        <h3 className="text-base font-semibold leading-snug text-on-surface" >{cls.name}</h3>
        {cls.description && (
          <p className="mt-1.5 text-sm line-clamp-2 text-on-surface-light" >{cls.description}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-light" >
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-on-surface-faint"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {cls.teacherIds.length} teacher{cls.teacherIds.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-on-surface-faint"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {cls.studentIds.length} student{cls.studentIds.length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="mt-2 text-xs text-on-surface-faint" >
          Created{' '}
          {new Date(cls.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Skeleton card
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border overflow-hidden border-surface-border" >
      <div className="h-32 bg-surface-border" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded bg-surface-border" />
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-2/3 rounded bg-surface" />
        <div className="mt-4 flex gap-4">
          <div className="h-3 w-20 rounded bg-surface" />
          <div className="h-3 w-20 rounded bg-surface" />
        </div>
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
          <h1 className="text-2xl font-bold text-on-surface" >Classes</h1>
          {!classesLoading && (
            <p className="mt-1 text-sm text-on-surface-light" >
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
