'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1" />
        <rect x="11" y="2" width="7" height="7" rx="1" />
        <rect x="2" y="11" width="7" height="7" rx="1" />
        <rect x="11" y="11" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="7.5" cy="6" r="3" />
        <path d="M1 17c0-3.314 2.91-6 6.5-6" strokeLinecap="round" />
        <circle cx="14" cy="7" r="2.5" />
        <path d="M19 17c0-2.761-2.239-5-5-5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Classes',
    href: '/admin/classes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M10 2L2 6.5l8 4.5 8-4.5L10 2z" strokeLinejoin="round" />
        <path d="M2 6.5v7" strokeLinecap="round" />
        <path d="M5 8.5v5.25A7 7 0 0 0 10 15a7 7 0 0 0 5-1.25V8.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/admin/profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="7" r="3.5" />
        <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
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
