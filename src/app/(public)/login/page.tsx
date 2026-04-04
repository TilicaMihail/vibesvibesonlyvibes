'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useLoginMutation } from '@/services/authApi'
import { setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import type { UserRole } from '@/types/user'
import { BookDoodle, PencilDoodle, StarDoodle, GradCapDoodle } from '@/components/landing/Doodles'

function roleRedirectPath(role: UserRole): string {
  if (role === 'admin') return '/dashboard'
  if (role === 'teacher') return '/courses'
  return '/courses'
}

/* Animated counter that counts from 0 to target on mount */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())
  const ref = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayed(v))
    const controls = animate(count, target, { duration: 1.8, ease: 'easeOut', delay: 0.3 })
    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [count, rounded, target])

  return (
    <span ref={ref} className="tabular-nums">
      {displayed}{suffix}
    </span>
  )
}

/* Floating-label input field */
function FloatField({
  id, label, type = 'text', autoComplete, value, onChange, required, rightSlot,
}: {
  id: string
  label: string
  type?: string
  autoComplete?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="peer w-full rounded-xl border border-cream-dark bg-white px-4 pt-5 pb-2 text-sm text-dark outline-none transition-all
          focus:border-brand focus:ring-2 focus:ring-brand/20
          placeholder-shown:pt-3"
        style={{ color: '#29241f' }}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-3 text-sm text-dark-light transition-all duration-200
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
          peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand
          peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs"
        style={{ color: '#6b5744' }}
      >
        {label}
      </label>
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  )
}

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreds, setShowCreds] = useState(false)

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
    <div className="min-h-screen flex" style={{ backgroundColor: '#f6f3e7' }}>

      {/* ── Left panel — branding ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[44%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: '#29241f' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a27246 0%, transparent 70%)' }}
        />

        {/* Doodles scattered in background */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-16 right-12 animate-float-up" style={{ animationDelay: '0s' }}>
            <BookDoodle className="w-16 h-16 opacity-15" style={{ color: '#c4a882' } as React.CSSProperties} />
          </div>
          <div className="absolute top-[38%] left-8 animate-float-down" style={{ animationDelay: '1.2s' }}>
            <PencilDoodle className="w-10 h-14 opacity-15" style={{ color: '#c4a882' } as React.CSSProperties} />
          </div>
          <div className="absolute bottom-[28%] right-16 animate-float-up" style={{ animationDelay: '0.6s' }}>
            <StarDoodle className="w-10 h-10 opacity-15" style={{ color: '#a27246' } as React.CSSProperties} />
          </div>
          <div className="absolute bottom-20 left-12 animate-sway" style={{ animationDelay: '2s' }}>
            <GradCapDoodle className="w-14 h-10 opacity-10" style={{ color: '#c4a882' } as React.CSSProperties} />
          </div>
        </div>

        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: '#f6f3e7' }}>
            Edu<span style={{ color: '#a27246' }}>Platform</span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl font-bold leading-[1.15] mb-5"
            style={{ color: '#f6f3e7' }}
          >
            Where learning<br />
            <span style={{ color: '#a27246' }}>meets purpose.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-base leading-relaxed mb-10"
            style={{ color: '#6b5744' }}
          >
            Manage courses, track progress, and deliver experiences your learners will remember.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-8"
          >
            {[
              { value: 500, suffix: '+', label: 'organisations' },
              { value: 50000, suffix: '+', label: 'students' },
              { value: 10000, suffix: '+', label: 'courses' },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold" style={{ color: '#a27246' }}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#6b5744' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave SVG — bleeds into right panel visually */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute right-0 top-0 h-full w-16 pointer-events-none"
          style={{ color: '#f6f3e7' }}
        >
          <path d="M0 0 C60 20 60 80 0 100 L100 100 L100 0 Z" fill="currentColor" opacity="0.06" />
          <path d="M30 0 C80 25 80 75 30 100 L100 100 L100 0 Z" fill="currentColor" opacity="0.04" />
        </svg>
      </motion.div>

      {/* ── Right panel — form ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ backgroundColor: '#f6f3e7' }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-bold" style={{ color: '#29241f' }}>
              Edu<span style={{ color: '#a27246' }}>Platform</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-1" style={{ color: '#29241f' }}>
            Welcome back.
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6b5744' }}>
            Sign in to continue where you left off.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FloatField
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              rightSlot={
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#a27246" strokeWidth="1.5">
                  <path d="M2 6l8 5 8-5" strokeLinecap="round"/>
                  <rect x="2" y="4" width="16" height="13" rx="2"/>
                </svg>
              }
            />

            <FloatField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightSlot={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="transition-opacity hover:opacity-70"
                >
                  {showPassword ? (
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
              }
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.22 }}
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
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors relative overflow-hidden"
              style={{ backgroundColor: '#a27246', color: '#f6f3e7' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#6b5744' }}>
            New here?{' '}
            <Link
              href="/register"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#a27246' }}
            >
              Create an organisation
            </Link>
          </p>

          {/* Test credentials — collapsible */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowCreds((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-colors"
              style={{
                backgroundColor: '#e8e0cc',
                color: '#4a3728',
              }}
            >
              <span>Test credentials</span>
              <motion.span animate={{ rotate: showCreds ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.span>
            </button>

            <AnimatePresence>
              {showCreds && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-1 rounded-xl px-4 py-3 space-y-1.5 font-mono text-xs"
                    style={{ backgroundColor: '#e8e0cc', color: '#4a3728' }}
                  >
                    <div><span style={{ color: '#a27246' }}>Admin</span>    admin@acme.com / admin123</div>
                    <div><span style={{ color: '#a27246' }}>Teacher</span>  bob@acme.com / teacher123</div>
                    <div><span style={{ color: '#a27246' }}>Student</span>  dan@acme.com / student123</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
