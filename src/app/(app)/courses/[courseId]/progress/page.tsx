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
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-4">
        <Link href="/courses" className="hover:text-brand">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand">{course?.title}</Link>
        <span>/</span>
        <span className="text-on-surface">Progress</span>
      </div>

      <h1 className="text-2xl font-bold text-on-surface mb-6">Course Progress</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Completion', value: `${pct}%`, color: pct >= 80 ? 'text-green-600 dark:text-green-400' : 'text-brand' },
          { label: 'Resources Done', value: `${completedIds.size}/${resourceNodes.length}`, color: 'text-on-surface' },
          { label: 'Tests Taken', value: testSessions, color: 'text-on-surface' },
          { label: 'Last Access', value: progress?.lastAccessedAt ? new Date(progress.lastAccessedAt).toLocaleDateString() : '—', color: 'text-on-surface-faint' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-surface-raised border border-surface-border rounded-xl p-4">
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-on-surface-faint mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="bg-surface-raised border border-surface-border rounded-xl p-5 mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Overall Progress</span>
          <span>{pct}%</span>
        </div>
        <ProgressBar value={pct} size="md" color={pct >= 80 ? 'green' : 'brand'} showLabel={false} />
      </div>

      {/* Resource list */}
      <div className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-on-surface">Resource Completion</h2>
        </div>
        <div className="divide-y divide-surface-border">
          {resourceNodes.map(node => {
            const rp = progress?.resourceProgress.find(r => r.contentNodeId === node.id);
            const done = completedIds.has(node.id);
            return (
              <div key={node.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? 'border-green-500 bg-green-500' : 'border-surface-border'}`}>
                  {done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-on-surface flex-1">{node.title}</span>
                <Badge variant={node.type === 'test' ? 'warning' : node.type === 'video' ? 'info' : 'neutral'}>{node.type}</Badge>
                {rp?.completedAt && <span className="text-xs text-on-surface-faint">{new Date(rp.completedAt).toLocaleDateString()}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
