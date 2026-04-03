'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Question, QuestionType, AnswerOption } from '@/types';

interface Props {
  initial?: Partial<Question>;
  onSave: (q: Omit<Question, 'id' | 'testId'>) => void;
  onCancel: () => void;
}

const TRUE_FALSE_OPTIONS: AnswerOption[] = [
  { id: 'tf-true', text: 'True', isCorrect: false },
  { id: 'tf-false', text: 'False', isCorrect: false },
];

export default function QuestionForm({ initial, onSave, onCancel }: Props) {
  const [text, setText] = useState(initial?.text ?? '');
  const [type, setType] = useState<QuestionType>(initial?.type ?? 'single');
  const [topicTag, setTopicTag] = useState(initial?.topicTag ?? '');
  const [explanation, setExplanation] = useState(initial?.explanation ?? '');
  const [options, setOptions] = useState<AnswerOption[]>(
    initial?.options ?? [
      { id: 'opt-1', text: '', isCorrect: false },
      { id: 'opt-2', text: '', isCorrect: false },
    ]
  );

  useEffect(() => {
    if (type === 'true_false') setOptions(TRUE_FALSE_OPTIONS.map(o => ({ ...o })));
    else if (options === TRUE_FALSE_OPTIONS) {
      setOptions([
        { id: 'opt-1', text: '', isCorrect: false },
        { id: 'opt-2', text: '', isCorrect: false },
      ]);
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  function setCorrect(id: string, checked: boolean) {
    setOptions(opts => opts.map(o => ({
      ...o,
      isCorrect: type === 'single' || type === 'true_false' ? o.id === id && checked : o.id === id ? checked : o.isCorrect,
    })));
  }

  function addOption() {
    setOptions(o => [...o, { id: 'opt-' + Date.now(), text: '', isCorrect: false }]);
  }

  function updateOption(id: string, text: string) {
    setOptions(opts => opts.map(o => o.id === id ? { ...o, text } : o));
  }

  function removeOption(id: string) {
    setOptions(opts => opts.filter(o => o.id !== id));
  }

  function handleSave() {
    if (!text.trim() || options.every(o => !o.text.trim())) return;
    onSave({ text: text.trim(), type, topicTag: topicTag.trim(), explanation: explanation.trim(), options });
  }

  return (
    <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your question..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={type} onChange={e => setType(e.target.value as QuestionType)}>
            <option value="single">Single choice</option>
            <option value="multiple">Multiple choice</option>
            <option value="true_false">True / False</option>
          </select>
        </div>
        <Input label="Topic Tag" value={topicTag} onChange={e => setTopicTag(e.target.value)} placeholder="e.g. variables" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Answer Options</label>
          {type !== 'true_false' && <button onClick={addOption} className="text-xs text-indigo-600 hover:underline">+ Add option</button>}
        </div>
        <div className="space-y-2">
          {options.map(opt => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type={type === 'multiple' ? 'checkbox' : 'radio'}
                checked={opt.isCorrect}
                onChange={e => setCorrect(opt.id, e.target.checked)}
                className="text-indigo-600"
              />
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={opt.text}
                onChange={e => updateOption(opt.id, e.target.value)}
                disabled={type === 'true_false'}
                placeholder="Option text"
              />
              {type !== 'true_false' && options.length > 2 && (
                <button onClick={() => removeOption(opt.id)} className="text-gray-300 hover:text-red-500 text-lg leading-none">×</button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">Check the correct answer(s)</p>
      </div>
      <Input label="Explanation (optional)" value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Why is this the correct answer?" />
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Question</Button>
      </div>
    </div>
  );
}
