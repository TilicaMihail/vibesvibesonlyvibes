'use client';
import { useState } from 'react';
import type { ChapterWithLessons, Lesson } from '@/types';

interface Props {
  chapters: ChapterWithLessons[];
  selectedId?: string | null;
  onSelect?: (lesson: Lesson) => void;
}

export default function ContentTreeReadOnly({ chapters, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState<Set<string>>(new Set(chapters.map(c => c.id)));

  if (!chapters.length) return <p className="text-on-surface-faint text-sm py-4 text-center">No content yet.</p>;

  return (
    <div className="space-y-2">
      {chapters.map(chapter => (
        <div key={chapter.id} className="border border-surface-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(prev => {
              const s = new Set(prev);
              s.has(chapter.id) ? s.delete(chapter.id) : s.add(chapter.id);
              return s;
            })}
            className="w-full flex items-center gap-2 px-4 py-3 bg-surface hover:bg-surface-border text-left transition-colors"
          >
            <span>📁</span>
            <span className="font-medium text-on-surface text-sm flex-1">{chapter.title}</span>
            <span className="text-on-surface-faint text-xs">{chapter.lessons.length} lessons</span>
            <span className="text-on-surface-faint">{open.has(chapter.id) ? '▾' : '▸'}</span>
          </button>
          {open.has(chapter.id) && (
            <div className="divide-y divide-surface-border">
              {chapter.lessons.length === 0 && (
                <p className="px-6 py-2 text-xs text-on-surface-faint italic">No lessons in this chapter</p>
              )}
              {chapter.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => onSelect?.(lesson)}
                  className={[
                    'flex items-center gap-3 px-6 py-2.5 transition-colors',
                    onSelect ? 'cursor-pointer' : '',
                    selectedId === lesson.id ? 'bg-brand/10 text-brand-light' : 'hover:bg-surface',
                  ].join(' ')}
                >
                  <span className="text-base">📄</span>
                  <span className={['text-sm flex-1', selectedId === lesson.id ? 'text-brand-light font-medium' : 'text-on-surface'].join(' ')}>
                    {lesson.title}
                  </span>
                  {lesson.testId && <span className="text-xs text-on-surface-faint">📝 test</span>}
                  {lesson.lessonResources.length > 0 && (
                    <span className="text-xs text-on-surface-faint">{lesson.lessonResources.length} resources</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
