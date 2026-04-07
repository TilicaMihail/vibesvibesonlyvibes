'use client';
import Link from 'next/link';
import ProgressBar from '@/components/ui/ProgressBar';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import { useAppSelector } from '@/store/hooks';
import { useGetUserProgressQuery, useGetUserActivityQuery } from '@/services/progressApi';
import { useGetCoursesQuery } from '@/services/coursesApi';
import type { ActivityEntry } from '@/types';

function activityText(a: ActivityEntry) {
  if (a.type === 'test_submitted') return `Completed a test — Score: ${a.meta?.score ?? '?'}%`;
  if (a.type === 'resource_viewed') return `Studied a resource`;
  if (a.type === 'course_enrolled') return `Enrolled in a course`;
  return 'Activity';
}

export default function MyProgressPage() {
  const user = useAppSelector(s => s.auth.user);
  const { data: progressList = [], isLoading } = useGetUserProgressQuery(user?.id ?? '', { skip: !user?.id });
  const { data: activity = [] } = useGetUserActivityQuery(user?.id ?? '', { skip: !user?.id });
  const { data: courses = [] } = useGetCoursesQuery({ tab: 'assigned', studentId: user?.id ?? '' }, { skip: !user?.id });

  const activeCourses = progressList.filter(p => p.completionPercent < 100).length;
  const completedCourses = progressList.filter(p => p.completionPercent === 100).length;
  const totalTests = progressList.reduce((sum, p) => sum + (p.testSessionIds?.length ?? 0), 0);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">My Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Courses', value: activeCourses, color: 'text-brand' },
          { label: 'Completed', value: completedCourses, color: 'text-green-600 dark:text-green-400' },
          { label: 'Tests Taken', value: totalTests, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Total Enrolled', value: courses.length, color: 'text-on-surface' },
        ].map(s => (
          <div key={s.label} className="bg-surface-raised border border-surface-border rounded-xl p-5">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-on-surface-faint mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course progress */}
        <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <h2 className="font-semibold text-on-surface">Course Progress</h2>
          </div>
          {progressList.length === 0 ? (
            <EmptyState title="No progress yet" description="Start a course to track your progress" />
          ) : (
            <div className="divide-y divide-surface-border">
              {progressList.map(p => {
                const course = courses.find(c => c.id === p.courseId);
                return (
                  <div key={p.id} className="px-5 py-4">
                    <div className="flex justify-between items-center mb-2">
                      <Link href={`/courses/${p.courseId}/progress`} className="text-sm font-medium text-on-surface hover:text-brand truncate max-w-[70%]">
                        {course?.title ?? p.courseId}
                      </Link>
                      <span className="text-sm font-bold text-brand">{p.completionPercent}%</span>
                    </div>
                    <ProgressBar value={p.completionPercent} size="sm" color={p.completionPercent === 100 ? 'green' : 'indigo'} />
                    <p className="text-xs text-on-surface-faint mt-1">Last accessed {new Date(p.lastAccessedAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-border">
            <h2 className="font-semibold text-on-surface">Recent Activity</h2>
          </div>
          {activity.length === 0 ? (
            <EmptyState title="No activity yet" description="Your learning activity will appear here" />
          ) : (
            <div className="divide-y divide-surface-border">
              {activity.slice(0, 10).map(a => (
                <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-base mt-0.5">
                    {a.type === 'test_submitted' ? '📝' : a.type === 'resource_viewed' ? '📖' : '🎓'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface">{activityText(a)}</p>
                    {a.testSessionId && (
                      <Link href={`/courses/${a.courseId}/test/${a.testSessionId}/results`} className="text-xs text-brand dark:text-on-surface-faint hover:underline">View results</Link>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-faint shrink-0">{new Date(a.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
