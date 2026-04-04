'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { scrollTo } from './shared'

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'FAQ', id: 'faq' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [navOpaque, setNavOpaque] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => scrollY.on('change', (v) => setNavOpaque(v > 40)), [scrollY])

  return (
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

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, id }) => (
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

        {/* Mobile hamburger */}
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

      {/* Mobile drawer */}
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
              {NAV_LINKS.map(({ label, id }) => (
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
  )
}
