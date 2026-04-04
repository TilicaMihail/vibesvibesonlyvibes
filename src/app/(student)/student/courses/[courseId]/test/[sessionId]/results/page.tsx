'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useGetTestSessionQuery } from '@/services/testSessionsApi';

export default function TestResultsPage({ params }: { params: Promise<{ courseId: string; sessionId: string }> }) {
  const { courseId, sessionId } = use(params);
  const { data: session, isLoading } = useGetTestSessionQuery(sessionId);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportQId, setReportQId] = useState('');

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!session) return <div className="text-center py-20 text-gray-400 dark:text-gray-500">Results not found</div>;

  const score = session.score ?? 0;
  const correct = session.answers.filter(a => a.isCorrect).length;
  const total = session.answers.length;
  const scoreColor = score >= 70 ? 'text-green-600 dark:text-green-400' : score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const scoreBg = score >= 70 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : score >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Test Results</h1>
        <Link href={`/student/courses/${courseId}/study`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← Back to course</Link>
      </div>

      {/* Score card */}
      <div className={`border rounded-xl p-8 text-center mb-6 ${scoreBg}`}>
        <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>{score.toFixed(0)}%</div>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          {score >= 70 ? '🎉 Great job!' : score >= 50 ? '📚 Keep practicing!' : '💪 Don\'t give up!'}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: total, color: 'text-gray-900 dark:text-gray-100' },
          { label: 'Correct', value: correct, color: 'text-green-600 dark:text-green-400' },
          { label: 'Incorrect', value: total - correct, color: 'text-red-600 dark:text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Question Review</h2>
        {session.answers.map((answer, i) => {
          const question = session.questions[i];
          if (!question) return null;
          const correct_q = answer.isCorrect;
          const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.text).join(', ');
          const yourOptions = question.options.filter(o => answer.selectedOptionIds.includes(o.id)).map(o => o.text).join(', ');

          return (
            <div key={answer.questionId} className={`bg-white dark:bg-gray-800 border rounded-xl p-4 ${correct_q ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}`}>
              <div className="flex items-start gap-3">
                <span className={`text-lg shrink-0 ${correct_q ? 'text-green-500' : 'text-red-500'}`}>
                  {correct_q ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">{question.text}</p>
                  <div className="space-y-1 text-xs">
                    <p className={correct_q ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      Your answer: <strong>{yourOptions || 'Not answered'}</strong>
                    </p>
                    {!correct_q && <p className="text-green-600 dark:text-green-400">Correct: <strong>{correctOptions}</strong></p>}
                    {question.explanation && <p className="text-gray-400 dark:text-gray-500 italic mt-1">{question.explanation}</p>}
                  </div>
                </div>
                <Badge variant={correct_q ? 'success' : 'danger'}>{correct_q ? 'Correct' : 'Wrong'}</Badge>
              </div>
              {session.questions[i]?.testId && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => { setReportQId(answer.questionId); setReportOpen(true); }}
                    className="cursor-pointer text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                  >Report question</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={`/student/courses/${courseId}/test`} className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          Try Again
        </Link>
        <Link href={`/student/courses/${courseId}/study`} className="flex-1 text-center py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
          Back to Course
        </Link>
      </div>

      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Report Question" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">What&apos;s wrong with this question?</p>
          <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="wrong_answer">Wrong correct answer</option>
            <option value="unclear_question">Unclear question text</option>
            <option value="outdated_content">Outdated content</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { void reportQId; setReportOpen(false); }}>Submit Report</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
