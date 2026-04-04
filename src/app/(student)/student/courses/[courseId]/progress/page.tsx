'use client';
import { use } from 'react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { useAppSelector } from '@/store/hooks';
import { useGetCourseQuery, useGetCourseContentQuery } from '@/services/coursesApi';
import { useGetCourseProgressQuery } from '@/services/progressApi';

export default function CourseProgressPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const user = useAppSelector(s => s.auth.user);

  const { data: course, isLoading: courseLoading } = useGetCourseQuery(courseId);
  const { data: nodes = [] } = useGetCourseContentQuery(courseId);
  const { data: progress, isLoading: progressLoading } = useGetCourseProgressQuery(
    { userId: user?.id ?? '', courseId }, { skip: !user?.id }
  );

  if (courseLoading || progressLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const resourceNodes = nodes.filter(n => n.parentId !== null);
  const completedIds = new Set(progress?.resourceProgress.filter(r => r.completed).map(r => r.contentNodeId) ?? []);
  const pct = progress?.completionPercent ?? 0;
  const testSessions = progress?.testSessionIds?.length ?? 0;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-4">
        <Link href="/student/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400">Courses</Link>
        <span>/</span>
        <Link href={`/student/courses/${courseId}/study`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{course?.title}</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">Progress</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Course Progress</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Completion', value: `${pct}%`, color: pct >= 80 ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Resources Done', value: `${completedIds.size}/${resourceNodes.length}`, color: 'text-gray-900 dark:text-gray-100' },
          { label: 'Tests Taken', value: testSessions, color: 'text-gray-900 dark:text-gray-100' },
          { label: 'Last Access', value: progress?.lastAccessedAt ? new Date(progress.lastAccessedAt).toLocaleDateString() : '—', color: 'text-gray-500 dark:text-gray-400' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Overall Progress</span>
          <span>{pct}%</span>
        </div>
        <ProgressBar value={pct} size="md" color={pct >= 80 ? 'green' : 'indigo'} showLabel={false} />
      </div>

      {/* Resource list */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Resource Completion</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {resourceNodes.map(node => {
            const rp = progress?.resourceProgress.find(r => r.contentNodeId === node.id);
            const done = completedIds.has(node.id);
            return (
              <div key={node.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  {done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{node.title}</span>
                <Badge variant={node.type === 'test' ? 'warning' : node.type === 'video' ? 'info' : 'neutral'}>{node.type}</Badge>
                {rp?.completedAt && <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(rp.completedAt).toLocaleDateString()}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
