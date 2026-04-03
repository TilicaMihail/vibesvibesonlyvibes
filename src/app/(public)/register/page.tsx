'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRegisterMutation } from '@/services/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function handleOrgNameChange(value: string) {
    setOrgName(value)
    if (!slugTouched) {
      setOrgSlug(slugify(value))
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true)
    setOrgSlug(slugify(value))
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}

    if (!orgName.trim()) errors.orgName = 'Organization name is required.'
    if (!orgSlug.trim()) errors.orgSlug = 'Slug is required.'
    if (!firstName.trim()) errors.firstName = 'First name is required.'
    if (!lastName.trim()) errors.lastName = 'Last name is required.'
    if (!adminEmail.trim()) errors.adminEmail = 'Email is required.'
    if (!adminPassword) errors.adminPassword = 'Password is required.'
    if (adminPassword.length > 0 && adminPassword.length < 8)
      errors.adminPassword = 'Password must be at least 8 characters.'
    if (adminPassword !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!validate()) return

    try {
      const result = await register({
        organizationName: orgName.trim(),
        organizationSlug: orgSlug,
        adminFirstName: firstName.trim(),
        adminLastName: lastName.trim(),
        adminEmail: adminEmail.trim(),
        adminPassword,
      }).unwrap()

      dispatch(setCredentials({ user: result.user, token: result.token }))
      document.cookie = `auth_token=${result.token}; path=/; max-age=86400`
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message ??
            'Registration failed. Please try again.'
          : 'Registration failed. Please try again.'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="text-2xl font-bold text-indigo-600">EduPlatform</span>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Create your organization
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Set up your account and start building your learning platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Organization section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                Organization details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Organization Name"
                  id="orgName"
                  type="text"
                  placeholder="Acme Corp"
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  error={fieldErrors.orgName}
                  required
                />

                <Input
                  label="Organization Slug"
                  id="orgSlug"
                  type="text"
                  placeholder="acme-corp"
                  value={orgSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  error={fieldErrors.orgSlug}
                  helperText="Used in URLs — lowercase letters, numbers, and hyphens only."
                  required
                />
              </div>
            </div>

            {/* Admin account section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
                Admin account
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    id="firstName"
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={fieldErrors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    id="lastName"
                    type="text"
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={fieldErrors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Admin Email"
                  id="adminEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@acme.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  error={fieldErrors.adminEmail}
                  required
                />

                <Input
                  label="Password"
                  id="adminPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  error={fieldErrors.adminPassword}
                  required
                />

                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={fieldErrors.confirmPassword}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Create Organization
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
