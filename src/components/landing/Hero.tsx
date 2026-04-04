'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  BookDoodle, PencilDoodle, StarDoodle, GradCapDoodle,
  LightbulbDoodle, ArrowDoodle, CircleDoodle, CheckDoodle,
} from './Doodles'
import { scrollTo } from './shared'

export default function Hero() {
  const { scrollY } = useScroll()

  const heroTextY = useTransform(scrollY, [0, 500], [0, -30])
  const heroFade  = useTransform(scrollY, [0, 400], [1, 0])
  const bgY1 = useTransform(scrollY, [0, 700], [0, -45])
  const bgY2 = useTransform(scrollY, [0, 700], [0, -80])
  const bgY3 = useTransform(scrollY, [0, 700], [0, -130])
  const cardY = useTransform(scrollY, [0, 700], [0, -55])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

      {/* Background parallax doodles — layer 1 (slowest) */}
      <motion.div style={{ y: bgY1 }} className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-20 left-8 animate-float-up opacity-[0.055]" style={{ animationDuration: '7s' }}>
          <BookDoodle className="w-28 h-22" style={{ color: '#29241f' }} />
        </div>
        <div className="absolute bottom-24 right-10 animate-float-down opacity-[0.045]" style={{ animationDuration: '8s', animationDelay: '1s' }}>
          <GradCapDoodle className="w-24 h-20" style={{ color: '#29241f' }} />
        </div>
      </motion.div>

      {/* Background parallax doodles — layer 2 (medium) */}
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

      {/* Background parallax doodles — layer 3 (fastest) */}
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

        {/* Left: text */}
        <motion.div style={{ y: heroTextY, opacity: heroFade }} className="flex-1 lg:max-w-[52%] z-10">
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

        {/* Right: course card illustration */}
        <motion.div style={{ y: cardY }} className="flex-1 flex items-center justify-center w-full lg:max-w-[48%] z-10" aria-hidden>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(162,114,70,0.22) 0%, transparent 70%)' }}
            />
            {/* Stacked back cards */}
            <div className="absolute inset-0 rounded-3xl border-2" style={{ transform: 'rotate(-7deg) translate(-10px, 10px)', borderColor: '#c4a882', backgroundColor: 'rgba(196,168,130,0.18)' }} />
            <div className="absolute inset-0 rounded-3xl border-2" style={{ transform: 'rotate(-3deg) translate(-5px, 5px)', borderColor: '#a27246', backgroundColor: 'rgba(162,114,70,0.12)' }} />

            {/* Front card */}
            <div
              className="relative rounded-3xl border-2 p-7 w-[300px] sm:w-[340px]"
              style={{ borderColor: '#29241f', backgroundColor: '#faf8f2', boxShadow: '0 24px 64px rgba(41,36,31,0.12)' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(162,114,70,0.14)' }}>
                  <GradCapDoodle className="w-7 h-6" style={{ color: '#a27246' }} />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight" style={{ color: '#29241f' }}>Advanced JavaScript</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b5744' }}>12 chapters · 3 tests</div>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.1)', width: '100%' }} />
                <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.07)', width: '80%' }} />
                <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(41,36,31,0.07)', width: '92%' }} />
              </div>

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

              <div className="grid grid-cols-3 gap-2">
                {[['8', 'done'], ['2', 'tests'], ['84%', 'score']].map(([val, label]) => (
                  <div key={label} className="rounded-xl py-2.5 text-center" style={{ backgroundColor: '#eee8d8' }}>
                    <div className="text-sm font-bold" style={{ color: '#29241f' }}>{val}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6b5744' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -top-5 -right-5 rounded-2xl px-3.5 py-2.5 text-xs font-bold shadow-lg border animate-float-up"
              style={{ backgroundColor: '#f6f3e7', borderColor: '#e8e0cc', color: '#29241f', animationDuration: '5s' }}
            >
              <span style={{ color: '#a27246' }}>✦</span> AI Test Ready
            </motion.div>
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
  )
}
