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
    router.push(`/student/courses/${courseId}/test/${session.id}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href={`/student/courses/${courseId}/study`} className="hover:text-indigo-600">← Back to course</Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Test</h1>
      <p className="text-gray-500 text-sm mb-6">Configure your personalized test session</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selected Topics</label>
          {topics.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No topics selected — the test will cover all available content</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topics.map(t => (
                <span key={t} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
                  {t}
                  <button onClick={() => setTopics(ts => ts.filter(x => x !== t))} className="hover:text-indigo-900 ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Questions: <strong className="text-indigo-600">{count}</strong>
          </label>
          <input
            type="range" min={3} max={20} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3</span><span>20</span></div>
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <input type="checkbox" id="timer" checked={timerEnabled} onChange={e => setTimerEnabled(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
            <label htmlFor="timer" className="text-sm font-medium text-gray-700">Enable timer</label>
          </div>
          {timerEnabled && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Duration: <strong>{timerMinutes} min</strong></label>
              <input
                type="range" min={5} max={60} value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 min</span><span>60 min</span></div>
            </div>
          )}
        </div>

        {tests.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3 text-sm">
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
