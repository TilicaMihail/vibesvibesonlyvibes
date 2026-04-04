'use client'

import { motion } from 'framer-motion'
import { Reveal, TiltCard } from './shared'

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

const FEATURES = [
  { icon: <IconAI />, title: 'AI Test Generation', desc: 'Automatically create quizzes and assessments from any course content. Review, edit, and publish in minutes.' },
  { icon: <IconTree />, title: 'Content Tree Builder', desc: 'Structure courses into chapters and resources. Mix text, videos, and file attachments freely.' },
  { icon: <IconChart />, title: 'Progress Analytics', desc: 'Track completion rates, test scores, and time spent per resource for every student.' },
  { icon: <IconShield />, title: 'Role-Based Access', desc: "Admins manage the platform. Teachers own their courses. Students access what they're assigned." },
  { icon: <IconUpload />, title: 'Bulk User Import', desc: 'Upload a CSV to create hundreds of student accounts instantly and assign them to classes.' },
  { icon: <IconUsers />, title: 'Class Management', desc: 'Group students into classes, attach courses, and manage enrolments from one interface.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6" style={{ backgroundColor: '#f6f3e7' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Everything you need</p>
          <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>Core features</h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, desc }, i) => (
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
  )
}
