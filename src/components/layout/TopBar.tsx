'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleDarkMode } from '@/store/slices/uiSlice'

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export default function TopBar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const darkMode = useAppSelector((state) => state.ui.darkMode)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const orgName = 'EduPlatform'

  function handleLogout() {
    dispatch(logout())
    document.cookie = 'auth_token=; max-age=0; path=/'
    router.push('/login')
  }

  const profilePath =
    user?.role === 'admin'
      ? '/admin/profile'
      : user?.role === 'teacher'
        ? '/teacher/profile'
        : '/student/profile'

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest'

  const dropdownItems = [
    {
      label: 'Profile',
      onClick: () => router.push(profilePath),
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="10" cy="7" r="3.5" />
          <path d="M2.5 17.5c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M13 3h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-4" strokeLinecap="round" />
          <path d="M9 14l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 10H3" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shrink-0">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{orgName}</span>

      <div className="flex items-center gap-3">
        {/* Always rendered to keep DOM structure stable between server and client */}
        <span
          className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block"
          suppressHydrationWarning
        >
          {user ? fullName : ''}
        </span>

        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="cursor-pointer p-2 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {mounted && darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <Dropdown
          trigger={
            <Avatar
              name={fullName}
              avatarUrl={user?.avatarUrl}
              size="md"
            />
          }
          items={dropdownItems}
          align="right"
        />
      </div>
    </header>
  )
}
