'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useGetClassStudentsQuery, useUpdateClassStudentsMutation } from '@/services/classesApi'
import { useGetUsersQuery } from '@/services/usersApi'
import type { UserPublic } from '@/types'

interface StudentEnrollmentPanelProps {
  classId: string
  currentStudentIds: string[]
}

export default function StudentEnrollmentPanel({
  classId,
  currentStudentIds,
}: StudentEnrollmentPanelProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<UserPublic | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [studentSearch, setStudentSearch] = useState('')

  const { data: students = [], isLoading: studentsLoading } = useGetClassStudentsQuery(classId)
  const { data: allStudentsData, isLoading: allLoading } = useGetUsersQuery(
    { role: 'student' },
    { skip: !addModalOpen },
  )
  const [updateStudents, { isLoading: updating }] = useUpdateClassStudentsMutation()

  const allStudents = allStudentsData?.users ?? []
  const enrolledIds = new Set(students.map((s) => s.id))
  const unenrolled = allStudents.filter((s) => !enrolledIds.has(s.id))

  const filteredUnenrolled = unenrolled.filter((s) => {
    const q = studentSearch.toLowerCase()
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    )
  })

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  async function handleAdd() {
    const next = [...Array.from(enrolledIds), ...selectedIds]
    await updateStudents({ classId, studentIds: next })
    setSelectedIds([])
    setStudentSearch('')
    setAddModalOpen(false)
  }

  async function handleRemove() {
    if (!removeTarget) return
    const next = students.filter((s) => s.id !== removeTarget.id).map((s) => s.id)
    await updateStudents({ classId, studentIds: next })
    setRemoveTarget(null)
  }

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (_: unknown, row: UserPublic) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${row.firstName} ${row.lastName}`}
            avatarUrl={row.avatarUrl}
            size="sm"
          />
          <span className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (_: unknown, row: UserPublic) => (
        <span className="text-gray-600">{row.email}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (_: unknown, row: UserPublic) => (
        <span className="text-gray-500">
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (_: unknown, row: UserPublic) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRemoveTarget(row)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Remove
        </Button>
      ),
    },
  ]

  return (
    <div>
      {/* KPI + action row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-600">{students.length}</span>
          <span className="text-sm text-gray-500">
            {students.length === 1 ? 'student' : 'students'} enrolled
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)}>
          Add Student
        </Button>
      </div>

      <Table
        columns={columns as Parameters<typeof Table>[0]['columns']}
        data={students as unknown as Record<string, unknown>[]}
        isLoading={studentsLoading}
        emptyMessage="No students enrolled in this class yet."
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setSelectedIds([])
          setStudentSearch('')
        }}
        title="Add Students"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder="Search students…"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
            {allLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading…</div>
            ) : filteredUnenrolled.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                {unenrolled.length === 0
                  ? 'All students are already enrolled.'
                  : 'No students match your search.'}
              </div>
            ) : (
              filteredUnenrolled.map((student) => {
                const checked = selectedIds.includes(student.id)
                return (
                  <label
                    key={student.id}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(student.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Avatar
                      name={`${student.firstName} ${student.lastName}`}
                      avatarUrl={student.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{student.email}</p>
                    </div>
                  </label>
                )
              })
            )}
          </div>

          {selectedIds.length > 0 && (
            <p className="text-xs text-indigo-600">
              {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setAddModalOpen(false)
                setSelectedIds([])
                setStudentSearch('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={selectedIds.length === 0}
              isLoading={updating}
              onClick={handleAdd}
            >
              Enroll {selectedIds.length > 0 ? selectedIds.length : ''}{' '}
              {selectedIds.length === 1 ? 'Student' : 'Students'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove Student"
        message={
          removeTarget
            ? `Remove ${removeTarget.firstName} ${removeTarget.lastName} from this class?`
            : ''
        }
        confirmLabel="Remove"
        confirmVariant="danger"
      />
    </div>
  )
}
