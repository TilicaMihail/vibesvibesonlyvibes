'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import TeacherSidebar from '@/components/layout/TeacherSidebar'
import StudentSidebar from '@/components/layout/StudentSidebar'
import TopBar from '@/components/layout/TopBar'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setSidebarOpen } from '@/store/slices/uiSlice'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen)
  const role = useAppSelector((s) => s.auth.user?.role)

  const Sidebar = role === 'admin' ? AdminSidebar : role === 'teacher' ? TeacherSidebar : StudentSidebar

  return (
    <div className="flex h-full bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
          aria-hidden
        />
      )}

      {mounted ? <Sidebar /> : <div className="w-64 shrink-0 bg-dark hidden md:block" />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {mounted ? children : null}
        </main>
      </div>
    </div>
  )
}
