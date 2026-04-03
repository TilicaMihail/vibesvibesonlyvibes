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
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{index + 1}</span>
          <p className="text-sm text-gray-800 font-medium">{question.text}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-indigo-600 px-2 py-1 hover:bg-indigo-50 rounded">Edit</button>
          <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded">Delete</button>
        </div>
      </div>
      <div className="flex items-center gap-2 pl-8">
        <Badge variant={question.type === 'multiple' ? 'info' : question.type === 'true_false' ? 'neutral' : 'primary'}>
          {question.type.replace('_', ' ')}
        </Badge>
        {question.topicTag && <Badge variant="neutral">{question.topicTag}</Badge>}
        <span className="text-xs text-gray-400">{question.options.length} options</span>
      </div>
      <div className="pl-8 space-y-1">
        {question.options.map(opt => (
          <div key={opt.id} className={`flex items-center gap-2 text-xs rounded px-2 py-1 ${opt.isCorrect ? 'bg-green-50 text-green-700' : 'text-gray-500'}`}>
            <span>{opt.isCorrect ? '✓' : '○'}</span>
            <span>{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
