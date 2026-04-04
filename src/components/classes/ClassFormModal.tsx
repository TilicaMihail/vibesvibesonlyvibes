'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import type { UserPublic } from '@/types'

interface ClassFormValues {
  name: string
  description: string
  teacherIds: string[]
}

interface ClassFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: ClassFormValues) => Promise<void>
  initialValues?: Partial<ClassFormValues>
  teachers: UserPublic[]
  mode: 'create' | 'edit'
  isLoading?: boolean
}

const defaultValues: ClassFormValues = {
  name: '',
  description: '',
  teacherIds: [],
}

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  teachers,
  mode,
  isLoading = false,
}: ClassFormModalProps) {
  const [values, setValues] = useState<ClassFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ClassFormValues, string>>>({})
  const [teacherSearch, setTeacherSearch] = useState('')

  useEffect(() => {
    if (isOpen) {
      setValues(
        initialValues
          ? {
              name: initialValues.name ?? '',
              description: initialValues.description ?? '',
              teacherIds: initialValues.teacherIds ?? [],
            }
          : defaultValues,
      )
      setErrors({})
      setTeacherSearch('')
    }
  }, [isOpen, initialValues])

  function validate(): boolean {
    const next: Partial<Record<keyof ClassFormValues, string>> = {}
    if (!values.name.trim()) next.name = 'Class name is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSubmit(values)
  }

  function toggleTeacher(id: string) {
    setValues((prev) => ({
      ...prev,
      teacherIds: prev.teacherIds.includes(id)
        ? prev.teacherIds.filter((t) => t !== id)
        : [...prev.teacherIds, id],
    }))
  }

  const filteredTeachers = teachers.filter((t) => {
    const q = teacherSearch.toLowerCase()
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    )
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create Class' : 'Edit Class'}
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Class Name"
          value={values.name}
          onChange={(e) => {
            setValues((p) => ({ ...p, name: e.target.value }))
            setErrors((p) => ({ ...p, name: undefined }))
          }}
          error={errors.name}
          placeholder="e.g. Mathematics 101"
          disabled={isLoading}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface-mid" >
            Description{' '}
            <span className="font-normal text-brand-light" >(optional)</span>
          </label>
          <textarea
            value={values.description}
            onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Brief description of this class…"
            disabled={isLoading}
            className="block w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-on-surface placeholder-brand-light focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-surface disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-on-surface-mid" >
            Assign Teachers{' '}
            <span className="font-normal text-brand-light" >(optional)</span>
          </label>

          {teachers.length === 0 ? (
            <p className="text-sm italic text-brand-light" >No teachers available.</p>
          ) : (
            <>
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Search teachers…"
                className="mb-2 block w-full rounded-lg border border-surface-border px-3 py-2 text-sm text-on-surface placeholder-brand-light focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              <div className="max-h-44 overflow-y-auto rounded-lg border border-surface-border divide-y divide-surface">
                {filteredTeachers.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-center text-brand-light" >
                    No teachers match your search.
                  </p>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const checked = values.teacherIds.includes(teacher.id)
                    return (
                      <label
                        key={teacher.id}
                        className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-surface transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTeacher(teacher.id)}
                          className="h-4 w-4 rounded border-surface-border accent-brand focus:ring-brand"
                          disabled={isLoading}
                        />
                        <Avatar
                          name={`${teacher.firstName} ${teacher.lastName}`}
                          avatarUrl={teacher.avatarUrl}
                          size="sm"
                        />
                        <span className="text-sm text-on-surface" >
                          {teacher.firstName} {teacher.lastName}
                          <span className="ml-1 text-xs text-brand-light" >{teacher.email}</span>
                        </span>
                      </label>
                    )
                  })
                )}
              </div>
              {values.teacherIds.length > 0 && (
                <p className="mt-1 text-xs text-brand" >
                  {values.teacherIds.length} teacher{values.teacherIds.length > 1 ? 's' : ''} selected
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {mode === 'create' ? 'Create Class' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
