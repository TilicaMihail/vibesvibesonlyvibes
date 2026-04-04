'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRegisterMutation } from '@/services/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import { BookDoodle, PencilDoodle, StarDoodle, LightbulbDoodle } from '@/components/landing/Doodles'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: '', color: '#e8e0cc' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { score, label: 'Fair', color: '#f59e0b' }
  if (score <= 3) return { score, label: 'Good', color: '#a27246' }
  return { score, label: 'Strong', color: '#16a34a' }
}

/* Floating-label input */
function FloatField({
  id, label, type = 'text', autoComplete, value, onChange, required,
  error, rightSlot, helperText,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
  rightSlot?: React.ReactNode
  helperText?: string
}) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          className="peer w-full rounded-xl border bg-white px-4 pt-5 pb-2 text-sm outline-none transition-all
            focus:ring-2 placeholder-shown:pt-3"
          style={{
            color: '#29241f',
            borderColor: error ? '#f87171' : '#e8e0cc',
            outlineColor: error ? '#f87171' : '#a27246',
            // @ts-ignore
            '--tw-ring-color': error ? 'rgba(248,113,113,0.2)' : 'rgba(162,114,70,0.2)',
          }}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-3 text-sm transition-all duration-200
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
            peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs
            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs"
          style={{ color: error ? '#ef4444' : '#6b5744' }}
        >
          {label}
        </label>
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs" style={{ color: '#6b5744' }}>{helperText}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1 text-xs"
            style={{ color: '#ef4444' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Eye icon toggle button */
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" tabIndex={-1} onClick={onToggle} className="transition-opacity hover:opacity-70">
      {show ? (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#a27246" strokeWidth="1.5">
          <path d="M3 3l14 14" strokeLinecap="round"/>
          <path d="M10.47 5.07A8.62 8.62 0 0 1 10 5C5.5 5 2 10 2 10s1.06 1.69 2.9 3.25M6.5 6.5A8.47 8.47 0 0 0 2 10s3.5 5 8 5c1.74 0 3.36-.6 4.71-1.62" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="2.5"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#a27246" strokeWidth="1.5">
          <path d="M2 10s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z"/>
          <circle cx="10" cy="10" r="2.5"/>
        </svg>
      )}
    </button>
  )
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const strength = passwordStrength(adminPassword)

  function handleOrgNameChange(value: string) {
    setOrgName(value)
    if (!slugTouched) setOrgSlug(slugify(value))
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
      router.push('/dashboard')
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message ?? 'Registration failed. Please try again.'
          : 'Registration failed. Please try again.'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f6f3e7' }}>

      {/* ── Left panel — form ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-start justify-center px-6 py-10 lg:py-14 overflow-y-auto"
        style={{ backgroundColor: '#f6f3e7' }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold mb-8 block" style={{ color: '#29241f' }}>
            Edu<span style={{ color: '#a27246' }}>Platform</span>
          </Link>

          <h1 className="text-3xl font-bold mb-1" style={{ color: '#29241f' }}>
            Create your organisation.
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6b5744' }}>
            Set up your learning platform in seconds.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ─ Organisation section ─ */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a27246' }}>
                  Organisation
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#e8e0cc' }} />
              </div>
              <div className="space-y-4">
                <FloatField
                  id="orgName"
                  label="Organisation name"
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  error={fieldErrors.orgName}
                  required
                />

                <div>
                  <FloatField
                    id="orgSlug"
                    label="URL slug"
                    value={orgSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    error={fieldErrors.orgSlug}
                    required
                  />
                  {orgSlug && !fieldErrors.orgSlug && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1.5 text-xs"
                      style={{ color: '#6b5744' }}
                    >
                      Your URL: <span className="font-mono" style={{ color: '#a27246' }}>eduplatform.io/<strong>{orgSlug}</strong></span>
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* ─ Admin account section ─ */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a27246' }}>
                  Admin account
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#e8e0cc' }} />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FloatField
                    id="firstName"
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={fieldErrors.firstName}
                    required
                  />
                  <FloatField
                    id="lastName"
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={fieldErrors.lastName}
                    required
                  />
                </div>

                <FloatField
                  id="adminEmail"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  error={fieldErrors.adminEmail}
                  required
                />

                <div>
                  <FloatField
                    id="adminPassword"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    error={fieldErrors.adminPassword}
                    required
                    rightSlot={<EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
                  />
                  {/* Strength bar */}
                  {adminPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2"
                    >
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: i <= strength.score ? strength.color : '#e8e0cc',
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </motion.div>
                  )}
                </div>

                <div>
                  <FloatField
                    id="confirmPassword"
                    label="Confirm password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={fieldErrors.confirmPassword}
                    required
                    rightSlot={
                      confirmPassword.length > 0 && !fieldErrors.confirmPassword && adminPassword === confirmPassword ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#16a34a" strokeWidth="2">
                          <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                    style={{ backgroundColor: '#fce8e8', color: '#b91c1c', border: '1px solid #fca5a5' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5h1.5v5h-1.5v-5zm0 6h1.5v1.5h-1.5V10.5z"/>
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.015 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#a27246', color: '#f6f3e7' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Creating organisation…
                </span>
              ) : (
                'Create Organisation'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#6b5744' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold transition-opacity hover:opacity-70" style={{ color: '#a27246' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ── Right panel — branding ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: '#29241f' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a27246 0%, transparent 70%)' }}
        />

        {/* Doodles */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-20 left-10 animate-float-down" style={{ animationDelay: '0.5s' }}>
            <LightbulbDoodle className="w-12 h-16 opacity-15" style={{ color: '#c4a882' } as React.CSSProperties} />
          </div>
          <div className="absolute top-[40%] right-10 animate-float-up" style={{ animationDelay: '1.5s' }}>
            <StarDoodle className="w-10 h-10 opacity-15" style={{ color: '#a27246' } as React.CSSProperties} />
          </div>
          <div className="absolute bottom-32 left-16 animate-sway" style={{ animationDelay: '0.8s' }}>
            <BookDoodle className="w-16 h-12 opacity-12" style={{ color: '#c4a882' } as React.CSSProperties} />
          </div>
          <div className="absolute bottom-16 right-12 animate-float-down" style={{ animationDelay: '2.2s' }}>
            <PencilDoodle className="w-8 h-12 opacity-12" style={{ color: '#a27246' } as React.CSSProperties} />
          </div>
        </div>

        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: '#f6f3e7' }}>
            Edu<span style={{ color: '#a27246' }}>Platform</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-4xl font-bold leading-[1.15] mb-8"
            style={{ color: '#f6f3e7' }}
          >
            The platform your<br />
            <span style={{ color: '#a27246' }}>learners will love.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="space-y-5"
          >
            {[
              { title: 'Build structured courses', desc: 'Rich content trees with text, video, and file resources.' },
              { title: 'AI-powered assessments', desc: 'Generate tests automatically from your course content.' },
              { title: 'Track every learner', desc: 'Real-time progress dashboards for admins and teachers.' },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.5 }}
                className="flex gap-3"
              >
                <div
                  className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(162,114,70,0.25)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#a27246" strokeWidth="2">
                    <path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: '#f6f3e7' }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6b5744' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs relative z-10" style={{ color: '#4a3728' }}>
          No credit card required. Free to get started.
        </p>

        {/* Wave decoration */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-0 top-0 h-full w-16 pointer-events-none"
          style={{ color: '#f6f3e7' }}
        >
          <path d="M100 0 C40 20 40 80 100 100 L0 100 L0 0 Z" fill="currentColor" opacity="0.06" />
        </svg>
      </motion.div>
    </div>
  )
}
