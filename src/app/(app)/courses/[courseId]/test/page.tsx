'use client';
import { use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAppDispatch } from '@/store/hooks';
import { startSession } from '@/store/slices/testRunnerSlice';
import { useStartAttemptMutation } from '@/services/attemptsApi';
import { useGetTestByLessonQuery } from '@/services/testsApi';

function TestStartCard({ testId, courseId }: { testId: string; courseId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [startAttempt, { isLoading }] = useStartAttemptMutation();

  async function handleStart() {
    const attempt = await startAttempt(testId).unwrap();
    dispatch(startSession({
      attemptId: attempt.attemptId,
      questions: attempt.questions,
      timeLimitSec: attempt.timeLimitSec,
    }));
    router.push(`/courses/${courseId}/test/${attempt.attemptId}`);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand transition-colors">← Back to course</Link>
      </div>

      <h1 className="text-2xl font-bold text-on-surface mb-6">Ready to start the test?</h1>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-6">
        <p className="text-sm text-on-surface-muted mb-6">
          Once started, the timer (if set) will begin. Make sure you have enough time before starting.
        </p>
        <Button variant="primary" fullWidth onClick={handleStart} isLoading={isLoading}>
          Start Test
        </Button>
      </div>
    </div>
  );
}

function TestByLessonView({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { data: test, isLoading } = useGetTestByLessonQuery(lessonId);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!test) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-on-surface-faint">Test not found.</p>
      <Link href={`/courses/${courseId}/study`} className="text-brand hover:underline text-sm mt-3 block">← Back to course</Link>
    </div>
  );

  return <TestStartCard testId={test.id} courseId={courseId} />;
}

export default function TestPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const lessonId = searchParams.get('lessonId');

  if (testId) {
    return <TestStartCard testId={testId} courseId={courseId} />;
  }

  if (lessonId) {
    return <TestByLessonView courseId={courseId} lessonId={lessonId} />;
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-on-surface-faint">No test selected.</p>
      <Link href={`/courses/${courseId}/study`} className="text-brand hover:underline text-sm mt-3 block">← Back to course</Link>
    </div>
  );
}
