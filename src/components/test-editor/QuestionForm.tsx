'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import type { Question, QuestionType, AnswerOption } from '@/types';

interface Props {
  initial?: Partial<Question>;
  onSave: (q: Omit<Question, 'questionId'>) => void;
  onCancel: () => void;
}

function makeOption(displayOrder: number): AnswerOption {
  return { optionId: displayOrder, text: '', isCorrect: false, displayOrder };
}

const TRUE_FALSE_OPTIONS: AnswerOption[] = [
  { optionId: 1, text: 'True', isCorrect: false, displayOrder: 1 },
  { optionId: 2, text: 'False', isCorrect: false, displayOrder: 2 },
];

export default function QuestionForm({ initial, onSave, onCancel }: Props) {
  const [content, setContent] = useState(initial?.content ?? '');
  const [type, setType] = useState<QuestionType>(initial?.questionType ?? 'SINGLE_CHOICE');
  const [options, setOptions] = useState<AnswerOption[]>(
    initial?.options ?? [makeOption(1), makeOption(2)]
  );

  useEffect(() => {
    if (type === 'TRUE_FALSE') {
      setOptions(TRUE_FALSE_OPTIONS.map(o => ({ ...o })));
    } else if (options.length === 2 && options[0].text === 'True') {
      setOptions([makeOption(1), makeOption(2)]);
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  function setCorrect(optionId: number, checked: boolean) {
    setOptions(opts => opts.map(o => ({
      ...o,
      isCorrect: type === 'SINGLE_CHOICE' || type === 'TRUE_FALSE'
        ? o.optionId === optionId && checked
        : o.optionId === optionId ? checked : o.isCorrect,
    })));
  }

  function addOption() {
    setOptions(o => [...o, makeOption(Date.now())]);
  }

  function updateOption(optionId: number, text: string) {
    setOptions(opts => opts.map(o => o.optionId === optionId ? { ...o, text } : o));
  }

  function removeOption(optionId: number) {
    setOptions(opts => opts.filter(o => o.optionId !== optionId));
  }

  function handleSave() {
    if (!content.trim() || options.every(o => !o.text.trim())) return;
    onSave({ content: content.trim(), questionType: type, options });
  }

  return (
    <div className="space-y-4 bg-surface-raised border border-surface-border rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium text-on-surface mb-1">Question Text</label>
        <textarea
          className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
          rows={3}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Enter your question..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-on-surface mb-1">Type</label>
        <select
          className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          value={type}
          onChange={e => setType(e.target.value as QuestionType)}
        >
          <option value="SINGLE_CHOICE">Single choice</option>
          <option value="MULTI_CHOICE">Multiple choice</option>
          <option value="TRUE_FALSE">True / False</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-on-surface">Answer Options</label>
          {type !== 'TRUE_FALSE' && <button onClick={addOption} className="text-xs text-brand hover:underline">+ Add option</button>}
        </div>
        <div className="space-y-2">
          {options.map(opt => (
            <div key={opt.optionId} className="flex items-center gap-2">
              <input
                type={type === 'MULTI_CHOICE' ? 'checkbox' : 'radio'}
                checked={opt.isCorrect ?? false}
                onChange={e => setCorrect(opt.optionId, e.target.checked)}
                className="text-brand"
              />
              <input
                type="text"
                className="flex-1 border border-surface-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand/30 focus:border-brand"
                value={opt.text}
                onChange={e => updateOption(opt.optionId, e.target.value)}
                disabled={type === 'TRUE_FALSE'}
                placeholder="Option text"
              />
              {type !== 'TRUE_FALSE' && options.length > 2 && (
                <button onClick={() => removeOption(opt.optionId)} className="text-on-surface-faint hover:text-red-500 text-lg leading-none">×</button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-on-surface-faint mt-1">Check the correct answer(s)</p>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Question</Button>
      </div>
    </div>
  );
}
