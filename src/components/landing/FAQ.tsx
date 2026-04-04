'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './shared'

const ITEMS = [
  { q: 'Who creates the organisation?', a: 'Anyone can register and become the admin of their own organisation. You control the entire platform from day one.' },
  { q: 'How does AI test generation work?', a: 'Teachers select which course content to use as a source, choose difficulty and question count, and the platform generates a ready-to-use test. You can review and edit every question before publishing.' },
  { q: 'Can students self-enrol in courses?', a: 'Yes — courses marked as "public" are discoverable by any student in your organisation. Admins and teachers can also manually enrol students or assign courses to entire classes.' },
  { q: 'Is there a limit on courses or students?', a: 'Not in this version. Create as many courses, tests, and users as you need.' },
  { q: 'Can I import existing users?', a: 'Yes. Admins can upload a CSV file to bulk-create student accounts. Teachers are added individually and assigned to classes from the admin dashboard.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6" style={{ backgroundColor: '#f6f3e7' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Questions</p>
          <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>FAQ</h2>
        </Reveal>

        <div className="space-y-3">
          {ITEMS.map(({ q, a }, i) => (
            <Reveal key={q} delay={i * 0.04}>
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#e8e0cc' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="cursor-pointer w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:opacity-80"
                  style={{ backgroundColor: open === i ? '#e8e0cc' : '#fff' }}
                >
                  <span className="font-semibold text-sm pr-4" style={{ color: '#29241f' }}>{q}</span>
                  <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#a27246" strokeWidth="2">
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {open === i && (
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
  )
}
