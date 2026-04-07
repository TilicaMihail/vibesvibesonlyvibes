'use client';
import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAppSelector } from '@/store/hooks';
import { useGetCourseTestsQuery } from '@/services/testsApi';
import { useCreateTestSessionMutation } from '@/services/testSessionsApi';

export default function TestGenerationPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector(s => s.auth.user);

  const rawTopics = searchParams.get('topics') ?? '';
  const [topics, setTopics] = useState<string[]>(rawTopics ? rawTopics.split(',').filter(Boolean) : []);
  const [count, setCount] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);

  const { data: tests = [] } = useGetCourseTestsQuery({ courseId });
  const [createSession, { isLoading }] = useCreateTestSessionMutation();

  async function handleStart() {
    if (!user) return;
    const firstTest = tests[0];
    const session = await createSession({
      studentId: user.id,
      courseId,
      testId: firstTest?.id,
      selectedTopics: topics,
      questionCount: count,
      timeLimitSeconds: timerEnabled ? timerMinutes * 60 : undefined,
    }).unwrap();
    router.push(`/courses/${courseId}/test/${session.id}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand">← Back to course</Link>
      </div>

      <h1 className="text-2xl font-bold text-on-surface mb-2">Generate Test</h1>
      <p className="text-on-surface-faint text-sm mb-6">Configure your personalized test session</p>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-6 space-y-6">
        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Selected Topics</label>
          {topics.length === 0 ? (
            <p className="text-on-surface-faint text-sm italic">No topics selected — the test will cover all available content</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <span key={t} className="inline-flex items-center gap-1 bg-brand/10 text-brand text-sm px-3 py-1 rounded-full">
                  {t}
                  <button onClick={() => setTopics(ts => ts.filter(x => x !== t))} className="cursor-pointer hover:text-brand-dark ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-1">
            Questions: <strong className="text-brand">{count}</strong>
          </label>
          <input
            type="range" min={3} max={20} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="flex justify-between text-xs text-on-surface-faint mt-1"><span>3</span><span>20</span></div>
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <input type="checkbox" id="timer" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} className="cursor-pointer w-4 h-4 text-brand rounded" />
            <label htmlFor="timer" className="cursor-pointer text-sm font-medium text-on-surface">Enable timer</label>
          </div>
          {timerEnabled && (
            <div>
              <label className="block text-sm text-on-surface-muted mb-1">Duration: <strong>{timerMinutes} min</strong></label>
              <input
                type="range" min={5} max={60} value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-xs text-on-surface-faint mt-1"><span>5 min</span><span>60 min</span></div>
            </div>
          )}
        </div>

        {tests.length === 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-lg p-3 text-sm">
            ⚠️ No tests available for this course yet. Ask your teacher to create tests.
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
          isLoading={isLoading}
          disabled={tests.length === 0}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
}
