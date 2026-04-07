'use client';
import { use } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useAppSelector } from '@/store/hooks';
import { useGetTestSessionsQuery } from '@/services/testSessionsApi';

export default function TestHistoryPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const user = useAppSelector(s => s.auth.user);

  const { data: sessions = [], isLoading } = useGetTestSessionsQuery(
    { studentId: user?.id ?? '', courseId },
    { skip: !user?.id }
  );

  const scoreColor = (score: number) =>
    score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">My Test Results</h1>
          <p className="text-sm text-on-surface-faint mt-1">{sessions.length} completed attempt{sessions.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href={`/courses/${courseId}/test`}
          className="text-sm bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Take a Test
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand transition-colors">← Back to course</Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : sessions.length === 0 ? (
        <div className="bg-surface-raised border border-surface-border rounded-xl p-10 text-center">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-on-surface font-medium mb-1">No tests taken yet</p>
          <p className="text-on-surface-faint text-sm mb-4">Complete a test to see your results here.</p>
          <Link
            href={`/courses/${courseId}/test`}
            className="inline-block text-sm bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
          >
            Take Your First Test
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const score = session.score ?? 0;
            const date = new Date(session.submittedAt ?? session.startedAt).toLocaleDateString();
            const time = new Date(session.submittedAt ?? session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const correct = session.answers.filter(a => a.isCorrect).length;

            return (
              <Link
                key={session.id}
                href={`/courses/${courseId}/test/${session.id}/results`}
                className="flex items-center gap-4 bg-surface-raised border border-surface-border rounded-xl p-4 hover:border-brand transition-colors group"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                  score >= 70 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : score >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {score.toFixed(0)}%
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface group-hover:text-brand transition-colors truncate">
                    {session.questions[0]?.testId ? `Test attempt` : 'Custom test'}
                  </p>
                  <p className="text-xs text-on-surface-faint mt-0.5">
                    {correct} / {session.answers.length} correct · {date} at {time}
                  </p>
                </div>

                <Badge variant={scoreColor(score)}>
                  {score >= 70 ? 'Passed' : score >= 50 ? 'Average' : 'Failed'}
                </Badge>

                <span className="text-on-surface-faint text-sm">→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
