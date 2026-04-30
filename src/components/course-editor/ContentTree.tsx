'use client';
import { useState } from 'react';
import type { ChapterWithLessons, Lesson } from '@/types';

interface Props {
  chapters: ChapterWithLessons[];
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
  onAddChapter: () => void;
  onAddLesson: (chapterId: string) => void;
  onDeleteChapter: (id: string) => void;
  onDeleteLesson: (id: string, chapterId: string) => void;
  onMoveChapter: (id: string, dir: 'up' | 'down') => void;
  onMoveLesson: (id: string, chapterId: string, dir: 'up' | 'down') => void;
}

export default function ContentTree({
  chapters, selectedLessonId,
  onSelectLesson, onAddChapter, onAddLesson,
  onDeleteChapter, onDeleteLesson, onMoveChapter, onMoveLesson,
}: Props) {
  const [open, setOpen] = useState<Set<string>>(new Set(chapters.map(c => c.id)));

  const toggleChapter = (id: string) => setOpen(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border">
        <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Content</span>
        <button onClick={onAddChapter} className="text-xs text-brand hover:text-brand-dark font-medium">+ Chapter</button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {chapters.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-on-surface-faint text-sm">No chapters yet.</p>
            <button onClick={onAddChapter} className="mt-2 text-brand text-sm hover:underline">Add first chapter</button>
          </div>
        )}
        {chapters.map(chapter => (
          <div key={chapter.id}>
            <div
              onClick={() => toggleChapter(chapter.id)}
              className="flex items-center gap-1.5 px-3 py-2 cursor-pointer group hover:bg-surface text-on-surface"
            >
              <span className="text-sm">📁</span>
              <span className="flex-1 text-sm font-medium truncate">{chapter.title}</span>
              <div className="hidden group-hover:flex items-center gap-0.5">
                <IconBtn onClick={e => { e.stopPropagation(); onMoveChapter(chapter.id, 'up'); }} title="Move up">↑</IconBtn>
                <IconBtn onClick={e => { e.stopPropagation(); onMoveChapter(chapter.id, 'down'); }} title="Move down">↓</IconBtn>
                <IconBtn onClick={e => { e.stopPropagation(); onDeleteChapter(chapter.id); }} title="Delete" danger>×</IconBtn>
              </div>
              <span className="text-on-surface-faint text-xs ml-1">{open.has(chapter.id) ? '▾' : '▸'}</span>
            </div>
            {open.has(chapter.id) && (
              <div>
                {chapter.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className={`flex items-center gap-1.5 pl-8 pr-3 py-1.5 cursor-pointer group ${selectedLessonId === lesson.id ? 'bg-brand/5 text-brand' : 'hover:bg-surface text-on-surface-muted'}`}
                  >
                    <span className="text-sm">📄</span>
                    <span className="flex-1 text-sm truncate">{lesson.title}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <IconBtn onClick={e => { e.stopPropagation(); onMoveLesson(lesson.id, chapter.id, 'up'); }} title="Move up">↑</IconBtn>
                      <IconBtn onClick={e => { e.stopPropagation(); onMoveLesson(lesson.id, chapter.id, 'down'); }} title="Move down">↓</IconBtn>
                      <IconBtn onClick={e => { e.stopPropagation(); onDeleteLesson(lesson.id, chapter.id); }} title="Delete" danger>×</IconBtn>
                    </div>
                  </div>
                ))}
                <div className="pl-8 pr-3 py-1">
                  <button
                    onClick={() => onAddLesson(chapter.id)}
                    className="text-xs text-on-surface-faint hover:text-brand hover:bg-brand/5 px-1.5 py-0.5 rounded"
                  >+ lesson</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-5 h-5 flex items-center justify-center rounded text-xs ${danger ? 'hover:text-red-600 hover:bg-red-50' : 'hover:text-brand hover:bg-brand/5'} text-on-surface-faint`}
    >{children}</button>
  );
}
