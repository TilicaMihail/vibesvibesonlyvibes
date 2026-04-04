'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookDoodle, StarDoodle, PencilDoodle } from './Doodles'
import { Reveal } from './shared'

export default function CTASection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden" style={{ backgroundColor: '#29241f' }}>
      {/* Doodle decorations */}
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
  )
}
