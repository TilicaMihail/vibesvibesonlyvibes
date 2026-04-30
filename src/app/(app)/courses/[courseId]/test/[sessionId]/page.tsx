'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { answerQuestion, navigateTo, tick } from '@/store/slices/testRunnerSlice';
import { useSubmitAttemptMutation } from '@/services/attemptsApi';
import type { AttemptAnswer } from '@/types';

export default function TestRunnerPage({ params }: { params: Promise<{ courseId: string; sessionId: string }> }) {
  const { courseId, sessionId: attemptId } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const runner = useAppSelector(s => s.testRunner);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitAttempt] = useSubmitAttemptMutation();

  useEffect(() => {
    if (runner.status !== 'running' || !runner.timeRemainingSeconds) return;
    const interval = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(interval);
  }, [runner.status, runner.timeRemainingSeconds, dispatch]);

  useEffect(() => {
    if (runner.status === 'done' && runner.attemptId === attemptId) handleSubmit();
  }, [runner.status]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit() {
    const answers: AttemptAnswer[] = Object.entries(runner.answers).map(([qId, optIds]) => ({
      questionId: Number(qId),
      selectedOptionIds: optIds as number[],
    }));
    await submitAttempt({ attemptId, answers }).unwrap();
    router.push(`/courses/${courseId}/test/${attemptId}/results`);
  }

  if (runner.questions.length === 0 || runner.attemptId !== attemptId) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Session expired</h2>
        <p className="text-on-surface-faint text-sm mb-6">Please go back and start the test again.</p>
        <a href={`/courses/${courseId}/study`} className="text-brand hover:underline text-sm">← Back to course</a>
      </div>
    );
  }

  const questions = runner.questions;
  const currentQ = questions[runner.currentIndex];
  const answered = (runner.answers[currentQ?.questionId] ?? []) as number[];
  const progress = Math.round(((runner.currentIndex + 1) / questions.length) * 100);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`;
  const isLowTime = runner.timeRemainingSeconds > 0 && runner.timeRemainingSeconds <= 60;

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-on-surface-faint">Question {runner.currentIndex + 1} of {questions.length}</span>
        {runner.timeRemainingSeconds > 0 && (
          <span className={`font-mono text-sm font-bold px-3 py-1 rounded-lg ${isLowTime ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-surface-border text-on-surface'}`}>
            ⏱ {formatTime(runner.timeRemainingSeconds)}
          </span>
        )}
      </div>

      <div className="mb-6"><ProgressBar value={progress} size="md" color="brand" /></div>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-6 mb-4">
        <p className="text-lg font-medium text-on-surface mb-6">{currentQ.content}</p>

        <div className="space-y-3">
          {currentQ.options.map(opt => {
            const selected = answered.includes(opt.optionId);
            const isMulti = currentQ.questionType === 'MULTI_CHOICE';
            return (
              <button
                key={opt.optionId}
                onClick={() => {
                  if (isMulti) {
                    const newSelected = selected
                      ? answered.filter(id => id !== opt.optionId)
                      : [...answered, opt.optionId];
                    dispatch(answerQuestion({ questionId: currentQ.questionId, optionIds: newSelected }));
                  } else {
                    dispatch(answerQuestion({ questionId: currentQ.questionId, optionIds: [opt.optionId] }));
                  }
                }}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${selected ? 'border-brand bg-brand/5 text-on-surface' : 'border-surface-border hover:border-brand-light text-on-surface'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 ${isMulti ? 'rounded-sm' : 'rounded-full'} border-2 flex items-center justify-center ${selected ? 'border-brand bg-brand' : 'border-surface-border'}`}>
                    {selected && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => dispatch(navigateTo(runner.currentIndex - 1))} disabled={runner.currentIndex === 0}>
          ← Previous
        </Button>

        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch(navigateTo(i))}
              className={`cursor-pointer w-7 h-7 rounded text-xs font-medium ${i === runner.currentIndex ? 'bg-brand text-white' : runner.answers[questions[i].questionId]?.length ? 'bg-brand/10 text-brand' : 'bg-surface-border text-on-surface-faint'}`}
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
