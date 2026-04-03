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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Courses', value: activeCourses, color: 'text-indigo-600' },
          { label: 'Completed', value: completedCourses, color: 'text-green-600' },
          { label: 'Tests Taken', value: totalTests, color: 'text-blue-600' },
          { label: 'Total Enrolled', value: courses.length, color: 'text-gray-900' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course progress */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Course Progress</h2>
          </div>
          {progressList.length === 0 ? (
            <EmptyState title="No progress yet" description="Start a course to track your progress" />
          ) : (
            <div className="divide-y divide-gray-100">
              {progressList.map(p => {
                const course = courses.find(c => c.id === p.courseId);
                return (
                  <div key={p.id} className="px-5 py-4">
                    <div className="flex justify-between items-center mb-2">
                      <Link href={`/student/courses/${p.courseId}/progress`} className="text-sm font-medium text-gray-800 hover:text-indigo-600 truncate max-w-[70%]">
                        {course?.title ?? p.courseId}
                      </Link>
                      <span className="text-sm font-bold text-indigo-600">{p.completionPercent}%</span>
                    </div>
                    <ProgressBar value={p.completionPercent} size="sm" color={p.completionPercent === 100 ? 'green' : 'indigo'} />
                    <p className="text-xs text-gray-400 mt-1">Last accessed {new Date(p.lastAccessedAt).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Recent Activity</h2>
          </div>
          {activity.length === 0 ? (
            <EmptyState title="No activity yet" description="Your learning activity will appear here" />
          ) : (
            <div className="divide-y divide-gray-100">
              {activity.slice(0, 10).map(a => (
                <div key={a.id} className="px-5 py-3 flex items-start gap-3">
                  <span className="text-base mt-0.5">
                    {a.type === 'test_submitted' ? '📝' : a.type === 'resource_viewed' ? '📖' : '🎓'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{activityText(a)}</p>
                    {a.testSessionId && (
                      <Link href={`/student/courses/${a.courseId}/test/${a.testSessionId}/results`} className="text-xs text-indigo-500 hover:underline">View results</Link>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(a.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
