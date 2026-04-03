'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { UserPublic, UserRole } from '@/types'

interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  assignmentScope: 'organization' | 'class'
}

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: UserFormValues) => Promise<void>
  initialValues?: Partial<UserPublic>
  mode: 'create' | 'edit'
  isLoading?: boolean
}

const defaultValues: UserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'student',
  assignmentScope: 'organization',
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormValues, string>>>({})

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialValues) {
        setValues({
          firstName: initialValues.firstName ?? '',
          lastName: initialValues.lastName ?? '',
          email: initialValues.email ?? '',
          password: '',
          role: initialValues.role ?? 'student',
          assignmentScope: initialValues.assignmentScope ?? 'organization',
        })
      } else {
        setValues(defaultValues)
      }
      setErrors({})
    }
  }, [isOpen, mode, initialValues])

  function validate(): boolean {
    const next: Partial<Record<keyof UserFormValues, string>> = {}
    if (!values.firstName.trim()) next.firstName = 'First name is required.'
    if (!values.lastName.trim()) next.lastName = 'Last name is required.'
    if (!values.email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = 'Enter a valid email address.'
    if (mode === 'create' && !values.password)
      next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(values)
  }

  function set<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create User' : 'Edit User'}
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={values.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            error={errors.firstName}
            placeholder="Jane"
            disabled={isLoading}
          />
          <Input
            label="Last Name"
            value={values.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            error={errors.lastName}
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
          placeholder="jane@example.com"
          disabled={isLoading}
        />

        {mode === 'create' && (
          <Input
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            disabled={isLoading}
          />
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
          <select
            value={values.role}
            onChange={(e) => set('role', e.target.value as UserRole)}
            disabled={isLoading}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {values.role === 'teacher' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Assignment Scope
            </label>
            <select
              value={values.assignmentScope}
              onChange={(e) =>
                set('assignmentScope', e.target.value as 'organization' | 'class')
              }
              disabled={isLoading}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="organization">Organization-wide</option>
              <option value="class">Class-specific</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Organization-wide teachers can access all classes. Class-specific teachers are
              assigned to individual classes.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
