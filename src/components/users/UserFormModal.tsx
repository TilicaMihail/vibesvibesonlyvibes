'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { UserPublic } from '@/types'

interface CreateValues {
  firstName: string
  lastName: string
  email: string
  roleName: 'TEACHER' | 'STUDENT'
}

interface EditValues {
  firstName: string
  lastName: string
  email: string
}

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateValues | EditValues) => Promise<void>
  initialValues?: Partial<UserPublic>
  mode: 'create' | 'edit'
  isLoading?: boolean
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: UserFormModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [roleName, setRoleName] = useState<'TEACHER' | 'STUDENT'>('STUDENT')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setFirstName(initialValues?.firstName ?? '')
      setLastName(initialValues?.lastName ?? '')
      setEmail(initialValues?.email ?? '')
      setRoleName('STUDENT')
      setErrors({})
    }
  }, [isOpen, initialValues])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!firstName.trim()) next.firstName = 'First name is required.'
    if (!lastName.trim()) next.lastName = 'Last name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Enter a valid email address.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (mode === 'create') {
      await onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), roleName })
    } else {
      await onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() })
    }
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
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })) }}
            error={errors.firstName}
            placeholder="Jane"
            disabled={isLoading}
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: '' })) }}
            error={errors.lastName}
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
          error={errors.email}
          placeholder="jane@example.com"
          disabled={isLoading}
        />

        {mode === 'create' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface-muted">Role</label>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value as 'TEACHER' | 'STUDENT')}
              disabled={isLoading}
              className="block w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-on-surface bg-surface-raised focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-surface disabled:cursor-not-allowed"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>
        )}

        {mode === 'create' && (
          <p className="text-xs text-on-surface-faint bg-surface-raised border border-surface-border rounded-lg px-3 py-2">
            An activation email with login credentials will be sent to the user.
          </p>
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
