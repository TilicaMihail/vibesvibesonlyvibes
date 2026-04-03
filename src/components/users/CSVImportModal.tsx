'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { UserCreatePayload, UserRole } from '@/types'

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (users: UserCreatePayload[]) => Promise<void>
  organizationId: string
  isLoading?: boolean
}

interface ParsedRow {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
}

function parseCSV(raw: string, organizationId: string): { rows: UserCreatePayload[]; errors: string[] } {
  const lines = raw.trim().split('\n').filter((l) => l.trim())
  if (lines.length === 0) return { rows: [], errors: ['No data found.'] }

  // Skip header row if it looks like a header
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

    if (cols.length < 4) {
      errors.push(`Row ${lineNum}: expected at least 4 columns (firstName, lastName, email, password).`)
      return
    }

    const [firstName, lastName, email, password, roleRaw] = cols
    const role: UserRole = (['admin', 'teacher', 'student'] as UserRole[]).includes(
      roleRaw as UserRole,
    )
      ? (roleRaw as UserRole)
      : 'student'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(`Row ${lineNum}: invalid email "${email}".`)
      return
    }
    if (!password) {
      errors.push(`Row ${lineNum}: password is required.`)
      return
    }

    rows.push({ organizationId, firstName, lastName, email, password, role })
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
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">Expected column order:</p>
            <code className="block font-mono">firstName, lastName, email, password, role</code>
            <p className="mt-1 text-gray-500">
              Role must be one of: <strong>admin</strong>, <strong>teacher</strong>,{' '}
              <strong>student</strong>. If omitted, defaults to <strong>student</strong>.
              The first row may be a header — it will be auto-detected and skipped.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Paste CSV data
            </label>
            <textarea
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value)
                setParseErrors([])
              }}
              rows={10}
              placeholder={`firstName,lastName,email,password,role\nJane,Doe,jane@example.com,secret123,student\nJohn,Smith,john@example.com,secret456,teacher`}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {parseErrors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="mb-1 text-sm font-medium text-red-700">
                {parseErrors.length} error{parseErrors.length > 1 ? 's' : ''} found:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                {parseErrors.map((err, i) => (
                  <li key={i} className="text-xs text-red-600">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleParse}
              disabled={!csvText.trim()}
            >
              Parse &amp; Preview
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {preview.length} user{preview.length !== 1 ? 's' : ''} ready to import.
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-100 text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {['Name', 'Email', 'Role'].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-medium uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-gray-800">
                      {row.firstName} {row.lastName}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{row.email}</td>
                    <td className="px-3 py-2 capitalize text-gray-600">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="secondary" onClick={() => setStep('input')}>
              Back
            </Button>
            <Button variant="primary" isLoading={isLoading} onClick={handleImport}>
              Import {preview.length} User{preview.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
