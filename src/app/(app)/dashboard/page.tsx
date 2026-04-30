'use client'

import Link from 'next/link'
import { useGetUsersQuery } from '@/services/usersApi'
import { useGetClassroomsQuery } from '@/services/classesApi'
import { useGetOrganizationQuery } from '@/services/organizationsApi'

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
interface KpiCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  isLoading?: boolean
}

function KpiCard({ label, value, icon, isLoading }: KpiCardProps) {
  return (
    <div className="bg-surface-raised rounded-2xl p-6 border border-surface-border" >
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-16 rounded bg-surface-border" />
          <div className="h-4 w-24 rounded bg-surface" />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-brand" >{value}</p>
            <p className="mt-1 text-sm text-on-surface-muted" >{label}</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand/10 text-brand">
            {icon}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Getting started checklist
// ---------------------------------------------------------------------------
interface ChecklistItem {
  label: string
  done: boolean
  href: string
}

function GettingStartedChecklist({ items }: { items: ChecklistItem[] }) {
  const remaining = items.filter((i) => !i.done)
  if (remaining.length === 0) return null

  return (
    <div className="rounded-2xl p-6 border bg-brand/5 border-brand-light">
      <h2 className="text-base font-semibold mb-3 text-on-surface" >Getting Started</h2>
      <ul className="space-y-2">
        {remaining.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand-light text-brand"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <Link
              href={item.href}
              className="text-sm underline underline-offset-2 transition-opacity hover:opacity-70 text-brand-dark"
              
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Quick Links
// ---------------------------------------------------------------------------
interface QuickLinkCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

function QuickLinkCard({ title, description, href, icon }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex gap-4 items-start rounded-2xl border bg-surface-raised p-5 transition-all duration-150 hover:shadow-md border-surface-border"
      
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors bg-brand/10 text-brand"
      >
        {icon}
      </span>
      <div>
        <p className="font-semibold transition-colors text-on-surface" >{title}</p>
        <p className="mt-0.5 text-sm text-on-surface-muted" >{description}</p>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminDashboardPage() {
  const { data: studentsData, isLoading: studentsLoading } = useGetUsersQuery({ role: 'student' })
  const { data: teachersData, isLoading: teachersLoading } = useGetUsersQuery({ role: 'teacher' })
  const { data: classes, isLoading: classesLoading } = useGetClassroomsQuery()
  const { data: org, isLoading: orgLoading } = useGetOrganizationQuery()

  const studentCount = studentsData?.total ?? 0
  const teacherCount = teachersData?.total ?? 0
  const classCount = classes?.length ?? 0

  const checklistItems: ChecklistItem[] = [
    { label: 'Add your first teacher', done: teacherCount > 0, href: '/users' },
    { label: 'Add your first student', done: studentCount > 0, href: '/users' },
    { label: 'Create your first class', done: classCount > 0, href: '/classes' },
  ]

  const kpiLoading = studentsLoading || teachersLoading || classesLoading

  const UsersIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const TeacherIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )

  const ClassIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )

  const CourseIcon = (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-on-surface" >Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-muted" >
          Overview of your organization&apos;s e-learning platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total Students" value={studentCount} icon={UsersIcon} isLoading={kpiLoading} />
        <KpiCard label="Total Teachers" value={teacherCount} icon={TeacherIcon} isLoading={kpiLoading} />
        <KpiCard label="Total Classes" value={classCount} icon={ClassIcon} isLoading={kpiLoading} />
        <KpiCard label="Active Courses" value={0} icon={CourseIcon} isLoading={kpiLoading} />
      </div>

      {/* Getting started checklist */}
      {!kpiLoading && <GettingStartedChecklist items={checklistItems} />}

      {/* Org info + Quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Org info card */}
        <div className="rounded-2xl border bg-surface-raised p-6 lg:col-span-1 border-surface-border" >
          <h2 className="mb-4 text-base font-semibold text-on-surface" >Organization</h2>
          {orgLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-40 rounded bg-surface-border" />
              <div className="h-4 w-28 rounded bg-surface" />
              <div className="h-4 w-36 rounded bg-surface" />
            </div>
          ) : org ? (
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-on-surface-faint" >Name</dt>
                <dd className="mt-0.5 text-sm font-medium text-on-surface" >{org.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-on-surface-faint" >Type</dt>
                <dd className="mt-0.5 text-sm text-on-surface-muted" >{org.organizationType}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-on-surface-faint" >Location</dt>
                <dd className="mt-0.5 text-sm text-on-surface-muted" >{org.city}, {org.country}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-on-surface-faint" >Member since</dt>
                <dd className="mt-0.5 text-sm text-on-surface-muted" >
                  {new Date(org.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-on-surface-faint" >No organization data available.</p>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-semibold text-on-surface" >Quick Links</h2>
          <QuickLinkCard
            title="Manage Users"
            description="Add, edit, or deactivate students, teachers, and admins."
            href="/users"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <QuickLinkCard
            title="Manage Classes"
            description="Create classes, assign teachers, and enroll students."
            href="/classes"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}
