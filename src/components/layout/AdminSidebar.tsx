'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { toggleSidebarCollapsed, setSidebarOpen } from '@/store/slices/uiSlice'
import { logout } from '@/store/slices/authSlice'
import Avatar from '@/components/ui/Avatar'

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8l4-4" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4l4 4-4 4" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4l10 10M14 4L4 14" />
    </svg>
  )
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
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
    href: '/users',
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
    href: '/classes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M10 2L2 6.5l8 4.5 8-4.5L10 2z" strokeLinejoin="round" />
        <path d="M2 6.5v7" strokeLinecap="round" />
        <path d="M5 8.5v5.25A7 7 0 0 0 10 15a7 7 0 0 0 5-1.25V8.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)
  const open = useAppSelector((s) => s.ui.sidebarOpen)
  const user = useAppSelector((s) => s.auth.user)
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  function handleLogout() {
    dispatch(logout())
    window.location.href = '/'
  }

  return (
    <aside
      className={[
        'flex flex-col h-full bg-dark shrink-0 transition-all duration-200',
        'fixed inset-y-0 left-0 z-40 md:relative md:inset-auto md:z-auto md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
        'w-64',
        collapsed ? 'md:w-16' : 'md:w-64',
      ].join(' ')}
    >
      {/* Header */}
      <div
        className={[
          'flex items-center h-16 border-b border-white/10 px-4 gap-3',
          collapsed ? 'md:justify-center' : 'justify-between',
        ].join(' ')}
      >
        <Link
          href="/dashboard"
          className={['font-bold text-lg whitespace-nowrap text-cream', collapsed ? 'md:hidden' : ''].join(' ')}
          onClick={() => dispatch(setSidebarOpen(false))}
        >
          Edu<span className="text-brand">Platform</span>
        </Link>

        {/* Desktop retract/expand button */}
        <button
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className="cursor-pointer hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-cream hover:bg-white/10 transition-colors shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => dispatch(setSidebarOpen(false))}
          className="cursor-pointer md:hidden flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-cream hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <XIcon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => dispatch(setSidebarOpen(false))}
              title={item.label}
              className={[
                'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors',
                collapsed ? 'md:justify-center md:px-2 px-3' : 'px-3',
                isActive
                  ? 'bg-brand/20 text-brand-light'
                  : 'text-white/50 hover:text-cream hover:bg-white/5',
              ].join(' ')}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile card */}
      <div className="border-t border-white/10 p-2">
        <Link
          href="/profile"
          onClick={() => dispatch(setSidebarOpen(false))}
          title="Profile"
          className={[
            'flex items-center gap-3 rounded-xl py-2.5 transition-colors hover:bg-white/5',
            collapsed ? 'md:justify-center md:px-2 px-3' : 'px-3',
            pathname.startsWith('/profile') ? 'bg-brand/20' : '',
          ].join(' ')}
        >
          <span className="shrink-0">
            <Avatar name={fullName || 'Admin'} size="sm" />
          </span>
          <div className={['min-w-0', collapsed ? 'md:hidden' : ''].join(' ')}>
            <p className="text-sm font-medium text-cream truncate">{fullName || 'Admin'}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role ?? 'admin'}</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          title="Logout"
          className={[
            'cursor-pointer w-full flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors text-white/50 hover:text-red-400 hover:bg-red-500/10',
            collapsed ? 'md:justify-center md:px-2 px-3' : 'px-3',
          ].join(' ')}
        >
          <span className="shrink-0">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M13 3h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4" strokeLinecap="round" />
              <path d="M9 14l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 10H3" strokeLinecap="round" />
            </svg>
          </span>
          <span className={collapsed ? 'md:hidden' : ''}>Logout</span>
        </button>
      </div>
    </aside>
  )
}
