'use client';
import { useState } from 'react';
import Link from 'next/link';

const FEATURES = [
  { icon: '✨', title: 'AI Test Generation', desc: 'Generate personalized quizzes from course content using AI — teachers save hours, students get targeted practice.' },
  { icon: '🌳', title: 'Content Tree Builder', desc: 'Organize courses with chapters, text, videos, files, and embedded tests in a visual drag-and-drop tree.' },
  { icon: '📊', title: 'Progress Analytics', desc: 'Track completion rates, test scores, and learning activity for every student and course.' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Admins, teachers, and students each get a tailored experience with the right tools and permissions.' },
  { icon: '📋', title: 'Bulk User Import', desc: 'Import hundreds of users at once via CSV — no manual data entry.' },
  { icon: '🏫', title: 'Class Management', desc: 'Organize students into classes and assign courses directly to entire cohorts.' },
];

const FAQS = [
  { q: 'Who can create an organization?', a: 'Any admin user can register a new organization. This creates the admin account and workspace simultaneously.' },
  { q: 'How do teachers and students get added?', a: 'Admins invite teachers and students via the User Management panel, or bulk-import via CSV.' },
  { q: 'How does AI test generation work?', a: 'Teachers select topics from their course content, set a question count, and the AI samples and adapts questions from the existing question bank.' },
  { q: 'Can students take tests without a teacher creating them?', a: 'Yes — students can generate custom tests from the course study page by selecting topics they want to practice.' },
  { q: 'Is there a limit on course content types?', a: 'Courses support text (markdown), video (YouTube embeds), file attachments, and embedded quizzes — organized into chapters.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">EduPlatform</div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
            <a href="#faq" className="hover:text-indigo-600">FAQ</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50">Sign In</Link>
            <Link href="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">Get Started</Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <Link href="/login" className="block text-sm text-gray-600 py-2">Sign In</Link>
            <Link href="/register" className="block text-sm font-medium text-indigo-600 py-2">Get Started</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            ✨ AI-Powered Learning Platform
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The smarter way to<br />
            <span className="text-indigo-600">train your team</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Create courses, generate AI-powered tests, and track learning progress — all in one platform built for organizations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-200">
              Create Your Organization →
            </Link>
            <Link href="/login" className="text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 px-8 py-3.5 rounded-xl border border-gray-200 transition-colors">
              Sign In
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free to start</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get your organization up and running in minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set Up Your Organization', desc: 'Admin registers, sets up the workspace, and invites teachers and students — individually or via CSV bulk import.' },
              { step: '02', title: 'Build Courses', desc: 'Teachers create rich courses with chapters, videos, files, and embedded quizzes in an intuitive content editor.' },
              { step: '03', title: 'Learn & Test', desc: 'Students study at their own pace and generate personalized AI tests to reinforce their learning.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits by Role */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Every Role</h2>
            <p className="text-gray-500">Tailored experiences for admins, teachers, and students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: 'Admin', icon: '🏛️', color: 'border-indigo-200 bg-indigo-50',
                benefits: ['Full organization control', 'User management & bulk import', 'Class creation & assignment', 'Platform-wide analytics'],
              },
              {
                role: 'Teacher', icon: '🎓', color: 'border-purple-200 bg-purple-50',
                benefits: ['Visual course content editor', 'AI-powered test generation', 'Student progress tracking', 'Multi-class course assignment'],
              },
              {
                role: 'Student', icon: '📚', color: 'border-green-200 bg-green-50',
                benefits: ['Organized course library', 'Self-paced learning', 'Custom AI-generated tests', 'Detailed progress tracking'],
              },
            ].map(r => (
              <div key={r.role} className={`border-2 ${r.color} rounded-2xl p-6`}>
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">For {r.role}s</h3>
                <ul className="space-y-2">
                  {r.benefits.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-indigo-500">✓</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Core Features</h2>
            <p className="text-gray-500">Everything you need for effective organizational learning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <span className="text-gray-400 ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your organization&apos;s learning?</h2>
          <p className="text-indigo-200 mb-8">Join organizations already using EduPlatform to train smarter.</p>
          <Link href="/register" className="inline-block text-base font-semibold text-indigo-600 bg-white hover:bg-indigo-50 px-8 py-3.5 rounded-xl transition-colors shadow-lg">
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-indigo-600 font-bold">EduPlatform</div>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
