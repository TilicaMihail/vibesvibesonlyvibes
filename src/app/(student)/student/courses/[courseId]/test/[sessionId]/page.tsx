'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Spinner from '@/components/ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startSession, answerQuestion, navigateTo, tick, setDone } from '@/store/slices/testRunnerSlice';
import { useGetTestSessionQuery } from '@/services/testSessionsApi';
import { useSubmitTestSessionMutation } from '@/services/testSessionsApi';

export default function TestRunnerPage({ params }: { params: Promise<{ courseId: string; sessionId: string }> }) {
  const { courseId, sessionId } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const runner = useAppSelector(s => s.testRunner);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: session, isLoading } = useGetTestSessionQuery(sessionId);
  const [submitSession, { isLoading: submitting }] = useSubmitTestSessionMutation();

  useEffect(() => {
    if (session && runner.sessionId !== sessionId) {
      dispatch(startSession({
        sessionId,
        questions: session.questions,
        timeLimitSeconds: session.timeLimitSeconds ?? undefined,
      }));
    }
  }, [session, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer tick
  useEffect(() => {
    if (runner.status !== 'running' || !runner.timeRemainingSeconds) return;
    const interval = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(interval);
  }, [runner.status, runner.timeRemainingSeconds, dispatch]);

  // Auto-submit when timer done
  useEffect(() => {
    if (runner.status === 'done' && runner.sessionId === sessionId) handleSubmit();
  }, [runner.status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    const answers = Object.entries(runner.answers).map(([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds,
    }));
    await submitSession({ sessionId, answers }).unwrap();
    router.push(`/student/courses/${courseId}/test/${sessionId}/results`);
  }

  if (isLoading || runner.questions.length === 0) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  const questions = runner.questions;
  const currentQ = questions[runner.currentIndex];
  const answered = runner.answers[currentQ?.id] ?? [];
  const progress = Math.round(((runner.currentIndex + 1) / questions.length) * 100);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;
  const isLowTime = runner.timeRemainingSeconds > 0 && runner.timeRemainingSeconds <= 60;

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">Question {runner.currentIndex + 1} of {questions.length}</span>
        {runner.timeRemainingSeconds > 0 && (
          <span className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${isLowTime ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
            ⏱ {formatTime(runner.timeRemainingSeconds)}
          </span>
        )}
      </div>

      <div className="mb-6"><ProgressBar value={progress} size="md" color="indigo" /></div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <p className="text-lg font-medium text-gray-900 mb-6">{currentQ.text}</p>

        <div className="space-y-3">
          {currentQ.options.map(opt => {
            const selected = answered.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (currentQ.type === 'multiple') {
                    const newSelected = selected
                      ? answered.filter(id => id !== opt.id)
                      : [...answered, opt.id];
                    dispatch(answerQuestion({ questionId: currentQ.id, optionIds: newSelected }));
                  } else {
                    dispatch(answerQuestion({ questionId: currentQ.id, optionIds: [opt.id] }));
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-${currentQ.type === 'multiple' ? 'sm' : 'full'} border-2 flex items-center justify-center ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                    {selected && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => dispatch(navigateTo(runner.currentIndex - 1))} disabled={runner.currentIndex === 0}>
          ← Previous
        </Button>

        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch(navigateTo(i))}
              className={`w-7 h-7 rounded text-xs font-medium ${i === runner.currentIndex ? 'bg-indigo-600 text-white' : runner.answers[questions[i].id]?.length ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {runner.currentIndex < questions.length - 1 ? (
          <Button variant="primary" onClick={() => dispatch(navigateTo(runner.currentIndex + 1))}>
            Next →
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setConfirmOpen(true)}>
            Submit Test
          </Button>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        title="Submit Test"
        message={`You've answered ${Object.keys(runner.answers).length} of ${questions.length} questions. Submit now?`}
        confirmLabel="Submit"
        confirmVariant="primary"
      />
    </div>
  );
}
