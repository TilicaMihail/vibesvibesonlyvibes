'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import Tabs from '@/components/ui/Tabs'
import SearchInput from '@/components/ui/SearchInput'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import UserFormModal from '@/components/users/UserFormModal'
import CSVImportModal from '@/components/users/CSVImportModal'
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
} from '@/services/usersApi'
import { useGetOrganizationQuery } from '@/services/organizationsApi'
import type { UserPublic, UserRole } from '@/types'

const ROLE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'admin', label: 'Admin' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
]

function roleBadgeVariant(role: UserRole): 'primary' | 'info' | 'neutral' {
  if (role === 'admin') return 'primary'
  if (role === 'teacher') return 'info'
  return 'neutral'
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UserPublic | null>(null)
  const [toggleTarget, setToggleTarget] = useState<UserPublic | null>(null)
  const [csvOpen, setCsvOpen] = useState(false)

  const queryParams = {
    ...(roleFilter !== 'all' ? { role: roleFilter as UserRole } : {}),
    ...(search ? { search } : {}),
  }

  const { data, isLoading } = useGetUsersQuery(queryParams)
  const { data: org } = useGetOrganizationQuery()
  const [createUser, { isLoading: creating }] = useCreateUserMutation()
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation()
  const [updateUserStatus, { isLoading: toggling }] = useUpdateUserStatusMutation()

  const users = data?.users ?? []
  const total = data?.total ?? 0

  const { data: allData } = useGetUsersQuery({})
  const { data: adminData } = useGetUsersQuery({ role: 'admin' })
  const { data: teacherData } = useGetUsersQuery({ role: 'teacher' })
  const { data: studentData } = useGetUsersQuery({ role: 'student' })

  const tabs = [
    { id: 'all', label: 'All', count: allData?.total },
    { id: 'admin', label: 'Admin', count: adminData?.total },
    { id: 'teacher', label: 'Teacher', count: teacherData?.total },
    { id: 'student', label: 'Student', count: studentData?.total },
  ]

  async function handleCreate(values: {
    firstName: string
    lastName: string
    email: string
    roleName?: 'TEACHER' | 'STUDENT'
  }) {
    if (!org || !values.roleName) return
    await createUser({
      organizationId: org.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleName: values.roleName,
    })
    setCreateOpen(false)
  }

  async function handleEdit(values: {
    firstName: string
    lastName: string
    email: string
  }) {
    if (!editTarget) return
    await updateUser({
      id: editTarget.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    })
    setEditTarget(null)
  }

  async function handleToggle() {
    if (!toggleTarget) return
    const newStatus = toggleTarget.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await updateUserStatus({ userId: toggleTarget.id, status: newStatus })
    setToggleTarget(null)
  }

  async function handleCSVImport(usersPayload: Parameters<typeof createUser>[0][]) {
    await Promise.all(usersPayload.map((u) => createUser(u)))
    setCsvOpen(false)
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (_: unknown, row: UserPublic) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="md" />
          <span className="font-medium text-on-surface">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (_: unknown, row: UserPublic) => (
        <span className="text-on-surface-muted">{row.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (_: unknown, row: UserPublic) => (
        <Badge variant={roleBadgeVariant(row.role)} className="capitalize">
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_: unknown, row: UserPublic) =>
        row.status === 'ACTIVE' ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="neutral">{row.status.charAt(0) + row.status.slice(1).toLowerCase()}</Badge>
        ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (_: unknown, row: UserPublic) => (
        <span className="text-on-surface-faint text-sm">
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditTarget(row)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setToggleTarget(row)}
            className={
              row.status === 'ACTIVE'
                ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
            }
          >
            {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
          <p className="mt-1 text-sm text-on-surface-faint">
            {total} user{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={() => setCsvOpen(true)}>
            Import CSV
          </Button>
          <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={tabs}
          activeTab={roleFilter}
          onChange={(id) => setRoleFilter(id as typeof roleFilter)}
        />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
          className="w-full sm:w-72"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns as unknown as Parameters<typeof Table>[0]['columns']}
        data={users as unknown as Record<string, unknown>[]}
        isLoading={isLoading}
        emptyMessage={
          search
            ? `No users found matching "${search}".`
            : 'No users yet. Click "Add User" to get started.'
        }
      />

      {/* Create Modal */}
      <UserFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        mode="create"
        isLoading={creating}
      />

      {/* Edit Modal */}
      <UserFormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initialValues={editTarget ?? undefined}
        mode="edit"
        isLoading={updating}
      />

      {/* Toggle Active Confirm */}
      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggle}
        title={toggleTarget?.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
        message={
          toggleTarget?.status === 'ACTIVE'
            ? `Deactivate ${toggleTarget.firstName} ${toggleTarget.lastName}? They will no longer be able to log in.`
            : `Reactivate ${toggleTarget?.firstName} ${toggleTarget?.lastName}? They will regain access.`
        }
        confirmLabel={toggleTarget?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmVariant={toggleTarget?.status === 'ACTIVE' ? 'danger' : 'primary'}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={csvOpen}
        onClose={() => setCsvOpen(false)}
        onImport={handleCSVImport}
        organizationId={org?.id ?? ''}
        isLoading={creating}
      />
    </div>
  )
}
