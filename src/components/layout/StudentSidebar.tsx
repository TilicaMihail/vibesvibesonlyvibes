'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'My Courses',
    href: '/student/courses',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="1.5" />
        <path d="M3 8h14" strokeLinecap="round" />
        <path d="M7 8v9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'My Progress',
    href: '/student/progress',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 15l4-5 3.5 3 4-6 2.5 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/student/profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="7" r="3.5" />
        <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function StudentSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-6">
        <span className="text-xl font-bold text-indigo-600">EduPlatform</span>
      </div>

      <nav className="flex-1 px-3 pb-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              ].join(' ')}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
