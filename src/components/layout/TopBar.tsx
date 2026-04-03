'use client'

import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

export default function TopBar() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)

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
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
      <span className="text-sm font-semibold text-gray-700">{orgName}</span>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-gray-600 hidden sm:block">
            {fullName}
          </span>
        )}

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
