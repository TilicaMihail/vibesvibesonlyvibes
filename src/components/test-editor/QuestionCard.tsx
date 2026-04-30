'use client';
import Badge from '@/components/ui/Badge';
import type { Question } from '@/types';

interface Props {
  question: Question;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function QuestionCard({ question, index, onEdit, onDelete }: Props) {
  const typeLabel = question.questionType === 'SINGLE_CHOICE' ? 'single' : question.questionType === 'MULTI_CHOICE' ? 'multiple' : 'true/false';
  return (
    <div className="bg-surface-raised border border-surface-border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{index + 1}</span>
          <p className="text-sm text-on-surface font-medium">{question.content}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="text-xs text-on-surface-faint hover:text-brand px-2 py-1 hover:bg-brand/5 rounded">Edit</button>
          <button onClick={onDelete} className="text-xs text-on-surface-faint hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded">Delete</button>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-8">
        <Badge variant={question.questionType === 'MULTI_CHOICE' ? 'info' : question.questionType === 'TRUE_FALSE' ? 'neutral' : 'primary'}>
          {typeLabel}
        </Badge>
        <span className="text-xs text-on-surface-faint">{question.options.length} options</span>
      </div>
      <div className="pl-8 space-y-1">
        {question.options.map(opt => (
          <div key={opt.optionId} className={`flex items-center gap-2 text-xs rounded px-2 py-1 ${opt.isCorrect ? 'bg-green-50 text-green-700' : 'text-on-surface-muted'}`}>
            <span>{opt.isCorrect ? '✓' : '○'}</span>
            <span>{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
