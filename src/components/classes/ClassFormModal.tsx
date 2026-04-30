'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ClassFormValues {
  name: string
  description: string
}

interface ClassFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: ClassFormValues) => Promise<void>
  initialValues?: Partial<ClassFormValues>
  mode: 'create' | 'edit'
  isLoading?: boolean
}

const defaultValues: ClassFormValues = {
  name: '',
  description: '',
}

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode,
  isLoading = false,
}: ClassFormModalProps) {
  const [values, setValues] = useState<ClassFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ClassFormValues, string>>>({})

  useEffect(() => {
    if (isOpen) {
      setValues(
        initialValues
          ? {
              name: initialValues.name ?? '',
              description: initialValues.description ?? '',
            }
          : defaultValues,
      )
      setErrors({})
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
          <label className="mb-1 block text-sm font-medium text-on-surface-muted">
            Description{' '}
            <span className="font-normal text-brand-light">(optional)</span>
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
