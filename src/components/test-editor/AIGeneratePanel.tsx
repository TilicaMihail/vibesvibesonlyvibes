'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useGenerateTestAIMutation, useGetAIRequestStatusQuery, useInjectAIQuestionsMutation } from '@/services/testsApi';

interface Props {
  lessonId: string;
  onDone: () => void;
}

export default function AIGeneratePanel({ lessonId, onDone }: Props) {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [generateAI, { isLoading: generating }] = useGenerateTestAIMutation();
  const [injectAI, { isLoading: injecting }] = useInjectAIQuestionsMutation();
  const { data: statusData } = useGetAIRequestStatusQuery(requestId ?? '', { skip: !requestId, pollingInterval: 3000 });

  const status = statusData?.status;
  const done = status === 'DONE' || status === 'COMPLETED';

  async function handleGenerate() {
    setError('');
    try {
      const result = await generateAI({ lessonId }).unwrap();
      setRequestId(result.requestId);
    } catch {
      setError('Failed to start AI generation. Try again.');
    }
  }

  async function handleInject() {
    if (!requestId) return;
    try {
      await injectAI(requestId).unwrap();
      setRequestId(null);
      onDone();
    } catch {
      setError('Failed to inject questions. Try again.');
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-on-surface-muted">
        AI will analyze this lesson content and generate relevant questions automatically.
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!requestId && (
        <Button variant="primary" onClick={handleGenerate} isLoading={generating} fullWidth>
          {generating ? 'Starting generation...' : '✨ Generate Questions with AI'}
        </Button>
      )}

      {requestId && !done && (
        <div className="flex items-center gap-3 text-on-surface-muted text-sm">
          <Spinner size="sm" />
          <span>Generating questions... (status: {status ?? 'pending'})</span>
        </div>
      )}

      {requestId && done && (
        <Button variant="primary" onClick={handleInject} isLoading={injecting} fullWidth>
          ✓ Questions ready — Add to test
        </Button>
      )}
    </div>
  );
}
