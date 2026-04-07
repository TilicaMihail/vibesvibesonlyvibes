'use client';
import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { useAppSelector } from '@/store/hooks';
import { useGetCourseTestsQuery, useGetTestQuery } from '@/services/testsApi';
import { useCreateTestSessionMutation } from '@/services/testSessionsApi';
import type { Test } from '@/types';

// ─── Mode A: specific test selected ─────────────────────────────────────────

function TestStartCard({
  test,
  courseId,
  onBack,
}: {
  test: Test;
  courseId: string;
  onBack?: () => void;
}) {
  const router = useRouter();
  const user = useAppSelector(s => s.auth.user);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [createSession, { isLoading }] = useCreateTestSessionMutation();

  async function handleStart() {
    if (!user) return;
    const session = await createSession({
      studentId: user.id,
      courseId,
      testId: test.id,
      selectedTopics: [],
      questionCount: test.questions.length,
      timeLimitSeconds: timerEnabled ? timerMinutes * 60 : undefined,
    }).unwrap();
    router.push(`/courses/${courseId}/test/${session.id}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        {onBack ? (
          <button onClick={onBack} className="cursor-pointer hover:text-brand transition-colors">← Back to tests</button>
        ) : (
          <Link href={`/courses/${courseId}/study`} className="hover:text-brand transition-colors">← Back to course</Link>
        )}
      </div>

      <h1 className="text-2xl font-bold text-on-surface mb-1">{test.title}</h1>
      <p className="text-on-surface-faint text-sm mb-6">
        {test.questions.length} questions
        {test.isAIGenerated && <span className="ml-2"><Badge variant="primary">AI Generated</Badge></span>}
      </p>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-6 space-y-5">
        {/* Timer */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              id="timer"
              checked={timerEnabled}
              onChange={e => setTimerEnabled(e.target.checked)}
              className="cursor-pointer w-4 h-4 text-brand rounded"
            />
            <label htmlFor="timer" className="cursor-pointer text-sm font-medium text-on-surface">
              Enable timer
            </label>
          </div>
          {timerEnabled && (
            <div>
              <label className="block text-sm text-on-surface-muted mb-1">
                Duration: <strong>{timerMinutes} min</strong>
              </label>
              <input
                type="range"
                min={5}
                max={60}
                value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-xs text-on-surface-faint mt-1">
                <span>5 min</span><span>60 min</span>
              </div>
            </div>
          )}
        </div>

        <Button variant="primary" fullWidth onClick={handleStart} isLoading={isLoading}>
          Start Test
        </Button>
      </div>
    </div>
  );
}

// ─── Mode B: pick from available tests ───────────────────────────────────────

function TestPickerView({ courseId }: { courseId: string }) {
  const [picked, setPicked] = useState<Test | null>(null);
  const { data: tests = [], isLoading } = useGetCourseTestsQuery({ courseId });

  if (picked) {
    return <TestStartCard test={picked} courseId={courseId} onBack={() => setPicked(null)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand transition-colors">← Back to course</Link>
      </div>

      <h1 className="text-2xl font-bold text-on-surface mb-1">Take a Test</h1>
      <p className="text-on-surface-faint text-sm mb-6">Select a test to begin</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : tests.length === 0 ? (
        <div className="bg-surface-raised border border-surface-border rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-on-surface font-medium mb-1">No tests available</p>
          <p className="text-on-surface-faint text-sm">Ask your teacher to create tests for this course.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map(test => (
            <button
              key={test.id}
              onClick={() => setPicked(test)}
              className="cursor-pointer w-full text-left bg-surface-raised border border-surface-border rounded-xl p-5 hover:border-brand transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-on-surface group-hover:text-brand transition-colors">{test.title}</p>
                  <p className="text-sm text-on-surface-faint mt-1">{test.questions.length} questions</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {test.isAIGenerated && <Badge variant="primary">AI</Badge>}
                  <span className="text-on-surface-faint text-sm">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mode A wrapper: load test by id from URL ────────────────────────────────

function TestByIdView({ courseId, testId }: { courseId: string; testId: string }) {
  const { data: test, isLoading } = useGetTestQuery({ courseId, testId });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!test) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-on-surface-faint">Test not found.</p>
      <Link href={`/courses/${courseId}/study`} className="text-brand hover:underline text-sm mt-3 block">← Back to course</Link>
    </div>
  );

  return <TestStartCard test={test} courseId={courseId} />;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TestPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  if (testId) {
    return <TestByIdView courseId={courseId} testId={testId} />;
  }

  return <TestPickerView courseId={courseId} />;
}
