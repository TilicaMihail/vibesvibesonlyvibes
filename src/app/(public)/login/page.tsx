'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useLoginMutation } from '@/services/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import type { UserRole } from '@/types/user'

function roleRedirectPath(role: UserRole): string {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'teacher') return '/teacher/courses'
  return '/student/courses'
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    try {
      const result = await login({ email, password }).unwrap()
      dispatch(setCredentials({ user: result.user, token: result.token }))
      document.cookie = `auth_token=${result.token}; path=/; max-age=86400`
      router.push(roleRedirectPath(result.user.role))
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message ?? 'Invalid email or password.'
          : 'Invalid email or password.'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 flex-col justify-between p-12 text-white">
        <div>
          <span className="text-2xl font-bold tracking-tight">EduPlatform</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Empower your organisation with smarter learning.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Manage courses, track student progress, and deliver great learning
            experiences — all in one place.
          </p>
        </div>

        <div className="flex gap-6 text-indigo-300 text-sm">
          <span>500+ organisations</span>
          <span>50k+ students</span>
          <span>10k+ courses</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-bold text-indigo-600">EduPlatform</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Show/hide toggle sits over the input's right padding */}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 bottom-2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M3 3l14 14" strokeLinecap="round" />
                    <path d="M10.47 5.07A8.62 8.62 0 0 1 10 5C5.5 5 2 10 2 10s1.06 1.69 2.9 3.25M6.5 6.5A8.47 8.47 0 0 0 2 10s3.5 5 8 5c1.74 0 3.36-.6 4.71-1.62" strokeLinecap="round" />
                    <circle cx="10" cy="10" r="2.5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z" />
                    <circle cx="10" cy="10" r="2.5" />
                  </svg>
                )}
              </button>
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
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New to EduPlatform?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create an organization
            </Link>
          </p>

          {/* Test credentials */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Test credentials
            </p>
            <div className="space-y-1 text-xs text-gray-600 font-mono">
              <div>
                <span className="text-gray-400">Admin:</span>{' '}
                admin@acme.com / admin123
              </div>
              <div>
                <span className="text-gray-400">Teacher:</span>{' '}
                bob@acme.com / teacher123
              </div>
              <div>
                <span className="text-gray-400">Student:</span>{' '}
                dan@acme.com / student123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
