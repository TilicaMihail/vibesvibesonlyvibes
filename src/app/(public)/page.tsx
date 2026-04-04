'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import {
  BookDoodle,
  PencilDoodle,
  StarDoodle,
  GradCapDoodle,
  LightbulbDoodle,
  CheckDoodle,
  ArrowDoodle,
  CircleDoodle,
} from '@/components/landing/Doodles'

/* ─── Smooth scroll helper ───────────────────────────────────────────────── */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ─── Tilt card ──────────────────────────────────────────────────────────── */
function TiltCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 20 })
  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Scroll reveal ──────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }: {
  children: React.ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right' | 'none'
}) {
  const initial =
    direction === 'up'    ? { opacity: 0, y: 32 }
    : direction === 'left'  ? { opacity: 0, x: -32 }
    : direction === 'right' ? { opacity: 0, x: 32 }
    : { opacity: 0 }
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Feature icons ───────────────────────────────────────────────────────── */
const IconAI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconTree = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
)
const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

/* ─────────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { scrollY } = useScroll()
  const [navOpaque, setNavOpaque] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => scrollY.on('change', (v) => setNavOpaque(v > 40)), [scrollY])

  // Hero text drift
  const heroTextY = useTransform(scrollY, [0, 500], [0, -30])
  const heroFade  = useTransform(scrollY, [0, 400], [1, 0])

  // Background doodle parallax layers
  const bgY1 = useTransform(scrollY, [0, 700], [0, -45])   // slowest
  const bgY2 = useTransform(scrollY, [0, 700], [0, -80])   // medium
  const bgY3 = useTransform(scrollY, [0, 700], [0, -130])  // fastest

  // Card stack parallax
  const cardY = useTransform(scrollY, [0, 700], [0, -55])

  return (
    <div style={{ backgroundColor: '#f6f3e7', color: '#29241f' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: navOpaque ? 'rgba(246,243,231,0.92)' : 'transparent',
          backdropFilter: navOpaque ? 'blur(12px)' : 'none',
          boxShadow: navOpaque ? '0 1px 0 rgba(41,36,31,0.08)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: '#29241f' }}>
            Edu<span style={{ color: '#a27246' }}>Platform</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', id: 'features' },
              { label: 'How It Works', id: 'how-it-works' },
              { label: 'FAQ', id: 'faq' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="nav-link text-sm font-medium transition-opacity hover:opacity-70 cursor-pointer bg-transparent border-none"
                style={{ color: '#29241f' }}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: '#29241f' }}>
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" className="text-sm font-semibold px-5 py-2 rounded-xl" style={{ backgroundColor: '#29241f', color: '#f6f3e7' }}>
                Get Started
              </Link>
            </motion.div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg cursor-pointer"
            style={{ color: '#29241f' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: '#e8e0cc', backgroundColor: '#f6f3e7' }}
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {[
                  { label: 'Features', id: 'features' },
                  { label: 'How It Works', id: 'how-it-works' },
                  { label: 'FAQ', id: 'faq' },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => { scrollTo(id); setMenuOpen(false) }}
                    className="text-sm font-medium text-left cursor-pointer bg-transparent border-none"
                    style={{ color: '#29241f' }}
                  >
                    {label}
                  </button>
                ))}
                <div className="pt-2 flex flex-col gap-3 border-t" style={{ borderColor: '#e8e0cc' }}>
                  <Link href="/login" className="text-sm font-medium text-center py-2" style={{ color: '#29241f' }}>Sign In</Link>
                  <Link href="/register" className="text-sm font-semibold text-center py-2.5 rounded-xl" style={{ backgroundColor: '#29241f', color: '#f6f3e7' }}>Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══ HERO ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* ── Background parallax doodles (full hero, very low opacity) ── */}
        <motion.div style={{ y: bgY1 }} className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute top-20 left-8 animate-float-up opacity-[0.055]" style={{ animationDuration: '7s' }}>
            <BookDoodle className="w-28 h-22" style={{ color: '#29241f' }} />
          </div>
          <div className="absolute bottom-24 right-10 animate-float-down opacity-[0.045]" style={{ animationDuration: '8s', animationDelay: '1s' }}>
            <GradCapDoodle className="w-24 h-20" style={{ color: '#29241f' }} />
          </div>
        </motion.div>

        <motion.div style={{ y: bgY2 }} className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute top-1/3 right-[6%] animate-float-down opacity-[0.05]" style={{ animationDuration: '9s', animationDelay: '0.5s' }}>
            <LightbulbDoodle className="w-20 h-24" style={{ color: '#a27246' }} />
          </div>
          <div className="absolute bottom-1/3 left-[4%] animate-sway opacity-[0.04]" style={{ animationDuration: '10s', animationDelay: '2s' }}>
            <PencilDoodle className="w-14 h-20" style={{ color: '#29241f' }} />
          </div>
          <div className="absolute top-16 right-[28%] animate-spin-slow opacity-[0.045]" style={{ animationDuration: '28s' }}>
            <StarDoodle className="w-16 h-16" style={{ color: '#a27246' }} />
          </div>
        </motion.div>

        <motion.div style={{ y: bgY3 }} className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute top-[55%] right-[14%] animate-spin-slow opacity-[0.04]" style={{ animationDuration: '22s', animationDirection: 'reverse' }}>
            <CircleDoodle className="w-20 h-20" style={{ color: '#a27246' }} />
          </div>
          <div className="absolute bottom-16 left-[22%] animate-float-up opacity-[0.04]" style={{ animationDuration: '6s', animationDelay: '1.5s' }}>
            <ArrowDoodle className="w-20 h-12" style={{ color: '#29241f' }} />
          </div>
          <div className="absolute top-24 left-[35%] animate-float-down opacity-[0.035]" style={{ animationDuration: '11s' }}>
            <CheckDoodle className="w-16 h-16" style={{ color: '#7a5530' }} />
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-0 py-20 lg:py-0">

          {/* ── Left: text content ─────────────────────────────────── */}
          <motion.div
            style={{ y: heroTextY, opacity: heroFade }}
            className="flex-1 lg:max-w-[52%] z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{ backgroundColor: 'rgba(162,114,70,0.1)', borderColor: 'rgba(162,114,70,0.3)', color: '#a27246' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#a27246' }} />
              Built for modern learning organisations
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
              style={{ color: '#29241f' }}
            >
              Learning that<br />
              <span style={{ color: '#a27246' }}>actually sticks.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: '#6b5744' }}
            >
              Build courses, run AI-generated assessments, and track every learner's growth — all inside one beautiful platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register" className="inline-block px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg" style={{ backgroundColor: '#a27246', color: '#f6f3e7' }}>
                  Start for free
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="inline-block px-7 py-3.5 rounded-xl text-sm font-semibold border cursor-pointer bg-transparent"
                  style={{ borderColor: '#29241f', color: '#29241f' }}
                >
                  See how it works
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── Right: course card illustration ────────────────────── */}
          <motion.div
            style={{ y: cardY }}
            className="flex-1 flex items-center justify-center w-full lg:max-w-[48%] z-10"
            aria-hidden
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Ambient glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(162,114,70,0.22) 0%, transparent 70%)' }}
              />

              {/* Back card */}
              <div
                className="absolute inset-0 rounded-3xl border-2"
                style={{
                  transform: 'rotate(-7deg) translate(-10px, 10px)',
                  borderColor: '#c4a882',
                  backgroundColor: 'rgba(196,168,130,0.18)',
                }}
              />
              {/* Middle card */}
              <div
                className="absolute inset-0 rounded-3xl border-2"
                style={{
                  transform: 'rotate(-3deg) translate(-5px, 5px)',
                  borderColor: '#a27246',
                  backgroundColor: 'rgba(162,114,70,0.12)',
                }}
              />

              {/* Front card */}
              <div
                className="relative rounded-3xl border-2 p-7 w-[300px] sm:w-[340px]"
                style={{ borderColor: '#29241f', backgroundColor: '#faf8f2', boxShadow: '0 24px 64px rgba(41,36,31,0.12)' }}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(162,114,70,0.14)' }}
                  >
                    <GradCapDoodle className="w-7 h-6" style={{ color: '#a27246' }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight" style={{ color: '#29241f' }}>Advanced JavaScript</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6b5744' }}>12 chapters · 3 tests</div>
                  </div>
                </div>

                {/* Content lines (skeleton) */}
                <div className="space-y-2 mb-5">
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.1)', width: '100%' }} />
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.07)', width: '80%' }} />
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.07)', width: '92%' }} />
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2" style={{ color: '#6b5744' }}>
                    <span>Progress</span>
                    <span style={{ color: '#a27246', fontWeight: 600 }}>68%</span>
                  </div>
                  <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: '#e8e0cc' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '68%' }}
                      transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: '#a27246' }}
                    />
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[['8', 'done'], ['2', 'tests'], ['84%', 'score']].map(([val, label]) => (
                    <div
                      key={label}
                      className="rounded-xl py-2.5 text-center"
                      style={{ backgroundColor: '#eee8d8' }}
                    >
                      <div className="text-sm font-bold" style={{ color: '#29241f' }}>{val}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#6b5744' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -top-5 -right-5 rounded-2xl px-3.5 py-2.5 text-xs font-bold shadow-lg border animate-float-up"
                style={{ backgroundColor: '#f6f3e7', borderColor: '#e8e0cc', color: '#29241f', animationDuration: '5s' }}
              >
                <span style={{ color: '#a27246' }}>✦</span> AI Test Ready
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="absolute -bottom-4 -left-6 rounded-2xl px-3.5 py-2.5 text-xs font-bold shadow-lg border animate-float-down"
                style={{ backgroundColor: '#29241f', borderColor: '#4a3728', color: '#f6f3e7', animationDuration: '6s', animationDelay: '1s' }}
              >
                3 new students enrolled
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: '#e8e0cc' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Simple by design</p>
            <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>How it works</h2>
          </Reveal>

          {/* 3-column step cards with connector line */}
          <div className="relative">
            {/* Connector line (desktop only) */}
            <div
              className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
              style={{ backgroundColor: '#a27246', opacity: 0.3 }}
              aria-hidden
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {[
                {
                  step: '01',
                  title: 'Set up your organisation',
                  desc: 'Register in seconds. Invite teachers, create classes, and bulk-import students with a CSV. Role-based access is automatic.',
                  icon: <GradCapDoodle className="w-12 h-10" style={{ color: '#a27246' }} />,
                },
                {
                  step: '02',
                  title: 'Build rich courses',
                  desc: 'Structure chapters, drop in text, videos, and files using the visual content tree. Organised, logical, learner-friendly.',
                  icon: <BookDoodle className="w-12 h-10" style={{ color: '#a27246' }} />,
                },
                {
                  step: '03',
                  title: 'Assess and track',
                  desc: 'AI generates tests from your content in seconds. Students get instant results. You watch everything on the dashboard.',
                  icon: <LightbulbDoodle className="w-10 h-12" style={{ color: '#a27246' }} />,
                },
              ].map(({ step, title, desc, icon }, i) => (
                <Reveal key={step} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center md:items-center">
                    {/* Step badge */}
                    <div
                      className="relative z-10 w-24 h-24 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-sm"
                      style={{ backgroundColor: '#f6f3e7' }}
                    >
                      <span className="text-xs font-bold mb-1" style={{ color: '#a27246' }}>{step}</span>
                      {icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#29241f' }}>{title}</h3>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#4a3728' }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6" style={{ backgroundColor: '#f6f3e7' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Everything you need</p>
            <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>Core features</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <IconAI />, title: 'AI Test Generation', desc: 'Automatically create quizzes and assessments from any course content. Review, edit, and publish in minutes.' },
              { icon: <IconTree />, title: 'Content Tree Builder', desc: 'Structure courses into chapters and resources. Mix text, videos, and file attachments freely.' },
              { icon: <IconChart />, title: 'Progress Analytics', desc: 'Track completion rates, test scores, and time spent per resource for every student.' },
              { icon: <IconShield />, title: 'Role-Based Access', desc: 'Admins manage the platform. Teachers own their courses. Students access what they\'re assigned.' },
              { icon: <IconUpload />, title: 'Bulk User Import', desc: 'Upload a CSV to create hundreds of student accounts instantly and assign them to classes.' },
              { icon: <IconUsers />, title: 'Class Management', desc: 'Group students into classes, attach courses, and manage enrolments from one interface.' },
            ].map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <TiltCard
                  className="h-full rounded-2xl border p-6 cursor-default group"
                  style={{ backgroundColor: '#fff', borderColor: '#e8e0cc' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: 'rgba(162,114,70,0.1)', color: '#a27246' }}
                  >
                    {icon}
                  </motion.div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#29241f' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b5744' }}>{desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ROLES ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ backgroundColor: '#29241f' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>For every role</p>
            <h2 className="text-4xl font-bold" style={{ color: '#f6f3e7' }}>One platform, three perspectives</h2>
          </Reveal>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            {[
              {
                role: 'Admin',
                color: '#c4a882',
                items: ['Manage your entire organisation', 'Invite teachers and bulk-import students', 'View platform-wide analytics', 'Configure classes and course access'],
                doodle: <GradCapDoodle className="w-10 h-8" />,
              },
              {
                role: 'Teacher',
                color: '#a27246',
                items: ['Build and publish courses freely', 'Create AI-generated test banks', 'Track student progress per resource', 'Manage enrolled students'],
                doodle: <BookDoodle className="w-10 h-8" />,
              },
              {
                role: 'Student',
                color: '#7a5530',
                items: ['Browse assigned and public courses', 'Study at your own pace', 'Take timed AI-powered tests', 'See your progress and scores'],
                doodle: <CheckDoodle className="w-10 h-8" />,
              },
            ].map(({ role, color, items, doodle }, i) => (
              <Reveal key={role} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 260 }}
                  className="rounded-2xl p-7 h-full relative overflow-hidden border"
                  style={{ backgroundColor: 'rgba(246,243,231,0.05)', borderColor: 'rgba(246,243,231,0.1)' }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 right-0 h-0.5 origin-left"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}22`, color }}>
                      {doodle}
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: '#f6f3e7' }}>{role}</h3>
                  </div>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: '#c4a882' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="2" className="mt-0.5 shrink-0">
                          <path d="M2 7l3.5 3.5L12 4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-6" style={{ backgroundColor: '#f6f3e7' }}>
        <div className="max-w-2xl mx-auto">
          <Reveal className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Questions</p>
            <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>FAQ</h2>
          </Reveal>

          <div className="space-y-3">
            {[
              { q: 'Who creates the organisation?', a: 'Anyone can register and become the admin of their own organisation. You control the entire platform from day one.' },
              { q: 'How does AI test generation work?', a: 'Teachers select which course content to use as a source, choose difficulty and question count, and the platform generates a ready-to-use test. You can review and edit every question before publishing.' },
              { q: 'Can students self-enrol in courses?', a: 'Yes — courses marked as "public" are discoverable by any student in your organisation. Admins and teachers can also manually enrol students or assign courses to entire classes.' },
              { q: 'Is there a limit on courses or students?', a: 'Not in this version. Create as many courses, tests, and users as you need.' },
              { q: 'Can I import existing users?', a: 'Yes. Admins can upload a CSV file to bulk-create student accounts. Teachers are added individually and assigned to classes from the admin dashboard.' },
            ].map(({ q, a }, i) => (
              <Reveal key={q} delay={i * 0.04}>
                <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0cc' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="cursor-pointer w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:opacity-80"
                    style={{ backgroundColor: openFaq === i ? '#e8e0cc' : '#fff' }}
                  >
                    <span className="font-semibold text-sm pr-4" style={{ color: '#29241f' }}>{q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#a27246" strokeWidth="2">
                        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#4a3728', backgroundColor: '#fff' }}>
                          {a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ backgroundColor: '#29241f' }}>
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          <div className="absolute top-8 left-8 animate-float-up opacity-10">
            <BookDoodle className="w-20 h-16" style={{ color: '#a27246' }} />
          </div>
          <div className="absolute bottom-8 right-12 animate-float-down opacity-10">
            <StarDoodle className="w-12 h-12" style={{ color: '#c4a882' }} />
          </div>
          <div className="absolute top-1/2 right-8 -translate-y-1/2 animate-sway">
            <PencilDoodle className="w-10 h-16 opacity-10" style={{ color: '#a27246' }} />
          </div>
        </div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a27246 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: '#f6f3e7' }}>
              Ready to transform<br />
              <span style={{ color: '#a27246' }}>how your team learns?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base mb-10 leading-relaxed" style={{ color: '#6b5744' }}>
              Join organisations building smarter learning experiences. Set up in minutes, scale without limits.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register" className="px-8 py-4 rounded-xl text-sm font-semibold shadow-xl" style={{ backgroundColor: '#a27246', color: '#f6f3e7' }}>
                  Get started for free
                </Link>
              </motion.div>
              <Link href="/login" className="text-sm font-medium transition-opacity hover:opacity-70" style={{ color: '#c4a882' }}>
                Already have an account? Sign in
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t" style={{ backgroundColor: '#f6f3e7', borderColor: '#e8e0cc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="max-w-xs">
              <Link href="/" className="text-xl font-bold" style={{ color: '#29241f' }}>
                Edu<span style={{ color: '#a27246' }}>Platform</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: '#6b5744' }}>
                Modern learning management for organisations that care about outcomes.
              </p>
            </div>

            <div className="flex gap-16 sm:gap-24">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a27246' }}>Platform</h4>
                <ul className="space-y-2.5 text-sm" style={{ color: '#4a3728' }}>
                  <li><button onClick={() => scrollTo('features')} className="hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none text-inherit">Features</button></li>
                  <li><button onClick={() => scrollTo('how-it-works')} className="hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none text-inherit">How it works</button></li>
                  <li><button onClick={() => scrollTo('faq')} className="hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none text-inherit">FAQ</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#a27246' }}>Account</h4>
                <ul className="space-y-2.5 text-sm" style={{ color: '#4a3728' }}>
                  <li><Link href="/login" className="hover:opacity-70 transition-opacity">Sign In</Link></li>
                  <li><Link href="/register" className="hover:opacity-70 transition-opacity">Register</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t text-xs" style={{ borderColor: '#e8e0cc', color: '#6b5744' }}>
            <span>© {new Date().getFullYear()} EduPlatform. All rights reserved.</span>
            <span>Built with care for learners everywhere.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
