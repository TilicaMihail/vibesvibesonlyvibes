'use client';
import { useState } from 'react';
import type { ChapterWithLessons, Lesson } from '@/types';

interface Props {
  chapters: ChapterWithLessons[];
  selectedLessonId: string | null;
  onSelect: (lesson: Lesson) => void;
}

export default function StudyContentTree({ chapters, selectedLessonId, onSelect }: Props) {
  const [open, setOpen] = useState<Set<string>>(new Set(chapters.map(c => c.id)));

  const toggle = (id: string) => setOpen(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  if (!chapters.length) return <p className="text-on-surface-faint text-sm p-4">No content available</p>;

  return (
    <div className="space-y-1">
      {chapters.map(chapter => (
        <div key={chapter.id}>
          <button
            onClick={() => toggle(chapter.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-surface text-on-surface"
          >
            <span className="text-base">📁</span>
            <span className="flex-1 text-sm font-medium truncate">{chapter.title}</span>
            <span className="text-xs text-on-surface-faint shrink-0">{chapter.lessons.length}</span>
            <span className="text-on-surface-faint text-xs">{open.has(chapter.id) ? '▾' : '▸'}</span>
          </button>
          {open.has(chapter.id) && (
            <div className="ml-4 space-y-0.5">
              {chapter.lessons.map(lesson => {
                const active = selectedLessonId === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelect(lesson)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left ${active ? 'bg-brand/5 text-brand' : 'hover:bg-surface text-on-surface-muted'}`}
                  >
                    <span className="text-sm">📄</span>
                    <span className="flex-1 text-sm truncate">{lesson.title}</span>
                    {lesson.testId && <span className="text-xs text-on-surface-faint shrink-0">📝</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
