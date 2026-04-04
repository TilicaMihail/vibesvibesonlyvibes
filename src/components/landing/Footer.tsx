'use client'

import Link from 'next/link'
import { scrollTo } from './shared'

export default function Footer() {
  return (
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
  )
}
