'use client';
import { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import SearchInput from '@/components/ui/SearchInput';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useAppSelector } from '@/store/hooks';
import { useGetCoursesQuery, useEnrollStudentMutation } from '@/services/coursesApi';
import { useGetUserProgressQuery } from '@/services/progressApi';
import type { Course } from '@/types';

const TABS = [
  { id: 'assigned', label: 'My Courses' },
  { id: 'public', label: 'Browse' },
];

const VIS: Record<string, 'neutral' | 'info' | 'success'> = { private: 'neutral', class: 'info', public: 'success' };

export default function StudentCoursesPage() {
  const user = useAppSelector(s => s.auth.user);
  const [tab, setTab] = useState('assigned');
  const [search, setSearch] = useState('');

  const { data: courses = [], isLoading } = useGetCoursesQuery(
    tab === 'assigned' ? { tab: 'assigned', studentId: user?.id ?? '' } : { tab: 'public', search: search || undefined },
    { skip: !user?.id }
  );
  const { data: progressList = [] } = useGetUserProgressQuery(user?.id ?? '', { skip: !user?.id });
  const [enroll] = useEnrollStudentMutation();

  const filtered = tab === 'assigned' && search
    ? courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : courses;

  function getProgress(courseId: string) {
    return progressList.find(p => p.courseId === courseId)?.completionPercent ?? 0;
  }

  function isEnrolled(course: Course) {
    return course.enrolledStudentIds.includes(user?.id ?? '');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Courses</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />
        <div className="ml-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-52 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title={tab === 'assigned' ? 'No courses assigned' : 'No public courses'} description={tab === 'assigned' ? 'Your teacher will assign courses to you' : 'Check back later for public courses'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => {
            const pct = getProgress(course.id);
            const enrolled = isEnrolled(course);
            return (
              <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{course.title}</h3>
                  <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-3">{course.description}</p>
                {enrolled && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                      <span>Progress</span><span>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} size="sm" color={pct >= 80 ? 'green' : 'indigo'} />
                  </div>
                )}
                {enrolled ? (
                  <Link href={`/student/courses/${course.id}/study`} className="block text-center text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg py-2 transition-colors">
                    {pct > 0 ? 'Continue' : 'Start'}
                  </Link>
                ) : (
                  <Button variant="secondary" fullWidth onClick={() => enroll({ courseId: course.id, studentId: user!.id })}>
                    Enroll
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
