'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import EmptyState from '@/components/ui/EmptyState'
import CardBanner from '@/components/ui/CardBanner'
import ClassFormModal from '@/components/classes/ClassFormModal'
import { useGetClassroomsQuery, useCreateClassroomMutation } from '@/services/classesApi'
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
          <p className="mt-1.5 text-sm line-clamp-2 text-on-surface-muted" >{cls.description}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-muted" >
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4 text-on-surface-faint"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(cls.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
          </span>
        </div>

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

  const { data: classes, isLoading: classesLoading } = useGetClassroomsQuery(
    search ? { search } : undefined,
  )
  const [createClassroom, { isLoading: creating }] = useCreateClassroomMutation()

  async function handleCreate(values: { name: string; description: string }) {
    await createClassroom({
      name: values.name,
      description: values.description || undefined,
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
            <p className="mt-1 text-sm text-on-surface-muted" >
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
        mode="create"
        isLoading={creating}
      />
    </div>
  )
}
