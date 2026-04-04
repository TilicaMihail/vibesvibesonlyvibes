'use client'

import { GradCapDoodle, BookDoodle, LightbulbDoodle } from './Doodles'
import { Reveal } from './shared'

const STEPS = [
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
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: '#e8e0cc' }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a27246' }}>Simple by design</p>
          <h2 className="text-4xl font-bold" style={{ color: '#29241f' }}>How it works</h2>
        </Reveal>

        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px"
            style={{ backgroundColor: '#a27246', opacity: 0.3 }}
            aria-hidden
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map(({ step, title, desc, icon }, i) => (
              <Reveal key={step} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
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
  )
}
