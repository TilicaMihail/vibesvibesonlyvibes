'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useGenerateTestMutation } from '@/services/testsApi';
import type { Question } from '@/types';

interface Props {
  courseId: string;
  onGenerated: (questions: Question[]) => void;
}

export default function AIGeneratePanel({ courseId, onGenerated }: Props) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [generateTest] = useGenerateTestMutation();

  function addTag() {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) setTags(t => [...t, trimmed]);
    setTagInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  }

  async function handleGenerate() {
    if (tags.length === 0) { setError('Add at least one topic tag'); return; }
    setError('');
    setGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); // simulated delay
      const result = await generateTest({ courseId, topics: tags, count, title: 'AI Generated Test' }).unwrap();
      onGenerated(result.questions);
    } catch {
      setError('Failed to generate questions. Try again.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Topic Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. variables, functions — press Enter to add"
          />
          <Button variant="secondary" onClick={addTag}>Add</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                {tag}
                <button onClick={() => setTags(t => t.filter(x => x !== tag))} className="hover:text-indigo-900">×</button>
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">💡 Tip: tags match question topic tags in your course tests</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions: <strong>{count}</strong></label>
        <input
          type="range" min={3} max={20} value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400"><span>3</span><span>20</span></div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button variant="primary" onClick={handleGenerate} isLoading={generating} fullWidth>
        {generating ? 'Generating questions...' : '✨ Generate with AI'}
      </Button>

      {generating && (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <Spinner size="sm" />
          <span>Analyzing your course content and building questions...</span>
        </div>
      )}
    </div>
  );
}
