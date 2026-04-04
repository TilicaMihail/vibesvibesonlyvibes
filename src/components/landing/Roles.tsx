'use client'

import { motion } from 'framer-motion'
import { GradCapDoodle, BookDoodle, CheckDoodle } from './Doodles'
import { Reveal } from './shared'

const ROLES = [
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
]

export default function Roles() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#29241f' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>For every role</p>
          <h2 className="text-4xl font-bold" style={{ color: '#f6f3e7' }}>One platform, three perspectives</h2>
        </Reveal>

        <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
          {ROLES.map(({ role, color, items, doodle }, i) => (
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
  )
}
