'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { UserCreatePayload } from '@/types'

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (users: UserCreatePayload[]) => Promise<void>
  organizationId: string
  isLoading?: boolean
}

function parseCSV(raw: string, organizationId: string): { rows: UserCreatePayload[]; errors: string[] } {
  const lines = raw.trim().split('\n').filter((l) => l.trim())
  if (lines.length === 0) return { rows: [], errors: ['No data found.'] }

  const firstLine = lines[0].toLowerCase()
  const hasHeader =
    firstLine.includes('email') ||
    firstLine.includes('firstname') ||
    firstLine.includes('first_name') ||
    firstLine.includes('name')
  const dataLines = hasHeader ? lines.slice(1) : lines

  const rows: UserCreatePayload[] = []
  const errors: string[] = []

  dataLines.forEach((line, idx) => {
    const lineNum = hasHeader ? idx + 2 : idx + 1
    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''))

    if (cols.length < 3) {
      errors.push(`Row ${lineNum}: expected at least 3 columns (firstName, lastName, email).`)
      return
    }

    const [firstName, lastName, email, roleRaw] = cols
    const normalizedRole = (roleRaw ?? '').toUpperCase()
    const roleName: 'TEACHER' | 'STUDENT' = normalizedRole === 'TEACHER' ? 'TEACHER' : 'STUDENT'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(`Row ${lineNum}: invalid email "${email}".`)
      return
    }

    rows.push({ organizationId, firstName, lastName, email, roleName })
  })

  return { rows, errors }
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImport,
  organizationId,
  isLoading = false,
}: CSVImportModalProps) {
  const [csvText, setCsvText] = useState('')
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<UserCreatePayload[]>([])
  const [step, setStep] = useState<'input' | 'preview'>('input')

  function handleParse() {
    const { rows, errors } = parseCSV(csvText, organizationId)
    setParseErrors(errors)
    setPreview(rows)
    if (errors.length === 0 && rows.length > 0) {
      setStep('preview')
    }
  }

  async function handleImport() {
    await onImport(preview)
    setCsvText('')
    setPreview([])
    setParseErrors([])
    setStep('input')
  }

  function handleClose() {
    setCsvText('')
    setPreview([])
    setParseErrors([])
    setStep('input')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Users via CSV" size="lg">
      {step === 'input' ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-surface-border bg-surface px-4 py-3 text-xs text-on-surface-muted">
            <p className="font-semibold text-on-surface mb-1">Expected column order:</p>
            <code className="block font-mono">firstName, lastName, email, role</code>
            <p className="mt-1 text-on-surface-muted">
              Role must be <strong>teacher</strong> or <strong>student</strong> (case-insensitive).
              If omitted, defaults to <strong>student</strong>. Passwords are sent via activation
              email — do not include them in the CSV. The first row may be a header and will be
              auto-detected and skipped.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              Paste CSV data
            </label>
            <textarea
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value)
                setParseErrors([])
              }}
              rows={10}
              placeholder={`firstName,lastName,email,role\nJane,Doe,jane@example.com,student\nJohn,Smith,john@example.com,teacher`}
              className="block w-full rounded-lg border border-surface-border px-3 py-2 font-mono text-xs text-on-surface placeholder-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {parseErrors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="mb-1 text-sm font-medium text-red-700">
                {parseErrors.length} error{parseErrors.length > 1 ? 's' : ''} found:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                {parseErrors.map((err, i) => (
                  <li key={i} className="text-xs text-red-600">{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleParse} disabled={!csvText.trim()}>
              Parse &amp; Preview
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {preview.length} user{preview.length !== 1 ? 's' : ''} ready to import. Activation
            emails will be sent automatically.
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-surface-border">
            <table className="min-w-full divide-y divide-gray-100 text-xs">
              <thead className="bg-surface sticky top-0">
                <tr>
                  {['Name', 'Email', 'Role'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium uppercase tracking-wide text-on-surface-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-surface-raised">
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-on-surface">{row.firstName} {row.lastName}</td>
                    <td className="px-3 py-2 text-on-surface-muted">{row.email}</td>
                    <td className="px-3 py-2 capitalize text-on-surface-muted">
                      {row.roleName.charAt(0) + row.roleName.slice(1).toLowerCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setStep('input')}>Back</Button>
            <Button variant="primary" isLoading={isLoading} onClick={handleImport}>
              Import {preview.length} User{preview.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
