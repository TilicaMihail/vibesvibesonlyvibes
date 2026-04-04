'use client'

import Link from 'next/link'
import { useGetUsersQuery } from '@/services/usersApi'
import { useGetClassesQuery } from '@/services/classesApi'
import { useGetOrganizationQuery } from '@/services/organizationsApi'

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
interface KpiCardProps {
  label: string
  value: number | string
  isLoading?: boolean
}

function KpiCard({ label, value, isLoading }: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-600" />
          <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-700" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{value}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </>
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
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6">
      <h2 className="text-base font-semibold text-indigo-900 dark:text-indigo-200 mb-3">Getting Started</h2>
      <ul className="space-y-2">
        {remaining.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-indigo-300 dark:border-indigo-600 text-indigo-400 dark:text-indigo-500">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <Link
              href={item.href}
              className="text-sm text-indigo-700 dark:text-indigo-300 underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100"
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
      className="group flex gap-4 items-start rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-150"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>
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
  const { data: classes, isLoading: classesLoading } = useGetClassesQuery()
  const { data: org, isLoading: orgLoading } = useGetOrganizationQuery()

  const studentCount = studentsData?.total ?? 0
  const teacherCount = teachersData?.total ?? 0
  const classCount = classes?.length ?? 0

  const checklistItems: ChecklistItem[] = [
    { label: 'Add your first teacher', done: teacherCount > 0, href: '/admin/users' },
    { label: 'Add your first student', done: studentCount > 0, href: '/admin/users' },
    { label: 'Create your first class', done: classCount > 0, href: '/admin/classes' },
  ]

  const kpiLoading = studentsLoading || teachersLoading || classesLoading

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your organization&apos;s e-learning platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total Students" value={studentCount} isLoading={kpiLoading} />
        <KpiCard label="Total Teachers" value={teacherCount} isLoading={kpiLoading} />
        <KpiCard label="Total Classes" value={classCount} isLoading={kpiLoading} />
        <KpiCard label="Active Courses" value={0} isLoading={kpiLoading} />
      </div>

      {/* Getting started checklist */}
      {!kpiLoading && <GettingStartedChecklist items={checklistItems} />}

      {/* Org info + Quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Org info card */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">Organization</h2>
          {orgLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-600" />
              <div className="h-4 w-28 rounded bg-gray-100 dark:bg-gray-700" />
              <div className="h-4 w-36 rounded bg-gray-100 dark:bg-gray-700" />
            </div>
          ) : org ? (
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Name
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100">{org.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Slug
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-gray-700 dark:text-gray-300">{org.slug}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  Member since
                </dt>
                <dd className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                  {new Date(org.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </dd>
              </div>
              {org.description && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{org.description}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No organization data available.</p>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Quick Links</h2>
          <QuickLinkCard
            title="Manage Users"
            description="Add, edit, or deactivate students, teachers, and admins."
            href="/admin/users"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />
          <QuickLinkCard
            title="Manage Classes"
            description="Create classes, assign teachers, and enroll students."
            href="/admin/classes"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}
