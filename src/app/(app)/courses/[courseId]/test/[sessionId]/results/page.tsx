'use client';
import { use } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useGetAttemptResultQuery } from '@/services/attemptsApi';

export default function TestResultsPage({ params }: { params: Promise<{ courseId: string; sessionId: string }> }) {
  const { courseId, sessionId: attemptId } = use(params);
  const { data: result, isLoading } = useGetAttemptResultQuery(attemptId);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!result) return <div className="text-center py-20 text-on-surface-faint">Results not found</div>;

  const score = result.scorePercent;
  const correct = result.questions.filter(q => q.correct).length;
  const total = result.questions.length;
  const scoreColor = score >= 70 ? 'text-green-600 dark:text-green-400' : score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const scoreBg = score >= 70 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : score >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Test Results</h1>
        <Link href={`/courses/${courseId}/study`} className="text-sm text-brand hover:underline">← Back to course</Link>
      </div>

      <div className={`border rounded-xl p-8 text-center mb-6 ${scoreBg}`}>
        <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>{score.toFixed(0)}%</div>
        <p className="text-on-surface-muted text-lg font-medium">
          {result.passed ? '🎉 Passed!' : score >= 50 ? '📚 Keep practicing!' : '💪 Don\'t give up!'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: total, color: 'text-on-surface' },
          { label: 'Correct', value: correct, color: 'text-green-600 dark:text-green-400' },
          { label: 'Incorrect', value: total - correct, color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-raised border border-surface-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-on-surface-faint mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wide">Question Review</h2>
        {result.questions.map((q, i) => {
          const yourOptions = q.options
            .filter(o => q.selectedOptionIds.includes(o.optionId))
            .map(o => o.text).join(', ');
          const correctOptions = q.options
            .filter(o => q.correctOptionIds.includes(o.optionId))
            .map(o => o.text).join(', ');

          return (
            <div key={q.questionId} className={`bg-surface-raised border rounded-xl p-4 ${q.correct ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-lg shrink-0 ${q.correct ? 'text-green-500' : 'text-red-500'}`}>
                  {q.correct ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface mb-2">{i + 1}. {q.content}</p>
                  <div className="space-y-1 text-xs">
                    <p className={q.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      Your answer: <strong>{yourOptions || 'Not answered'}</strong>
                    </p>
                    {!q.correct && <p className="text-green-600 dark:text-green-400">Correct: <strong>{correctOptions}</strong></p>}
                  </div>
                </div>
                <Badge variant={q.correct ? 'success' : 'danger'}>{q.correct ? 'Correct' : 'Wrong'}</Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={`/courses/${courseId}/study`} className="flex-1 text-center py-2.5 border border-surface-border hover:bg-surface-border text-on-surface rounded-lg text-sm font-medium transition-colors">
          Back to Course
        </Link>
      </div>
    </div>
  );
}
