'use client';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Lesson } from '@/types';

interface Props {
  lesson: Lesson | null;
  onChange: (partial: Partial<Lesson>) => void;
  onAddResource: (title: string, url: string) => void;
  onDeleteResource: (resourceId: string) => void;
}

export default function LessonEditor({ lesson, onChange, onAddResource, onDeleteResource }: Props) {
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-on-surface-faint">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-sm">Select a lesson from the tree to edit it</p>
      </div>
    );
  }

  function handleAddResource() {
    if (!resTitle.trim() || !resUrl.trim()) return;
    onAddResource(resTitle.trim(), resUrl.trim());
    setResTitle('');
    setResUrl('');
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📄</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted bg-surface px-2 py-0.5 rounded">lesson</span>
      </div>

      <Input
        label="Lesson Title"
        value={lesson.title}
        onChange={e => onChange({ title: e.target.value })}
        placeholder="Lesson title"
      />

      <div>
        <label className="block text-sm font-medium text-on-surface mb-1">Content (Markdown)</label>
        <textarea
          className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none bg-surface text-on-surface"
          rows={14}
          value={lesson.contentMarkdown ?? ''}
          onChange={e => onChange({ contentMarkdown: e.target.value })}
          placeholder={'# Heading\n\nWrite your lesson content in markdown...'}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-2">Resources</h3>
        {lesson.lessonResources.length > 0 && (
          <div className="space-y-1 mb-3">
            {lesson.lessonResources.map(r => (
              <div key={r.id} className="flex items-center gap-2 text-sm border border-surface-border rounded-lg px-3 py-2">
                <span className="text-base">📎</span>
                <span className="flex-1 font-medium text-on-surface truncate">{r.title}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline truncate max-w-[120px]">{r.url}</a>
                <button onClick={() => onDeleteResource(r.id)} className="text-on-surface-faint hover:text-red-500 text-xs px-1">×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              label="Resource title"
              value={resTitle}
              onChange={e => setResTitle(e.target.value)}
              placeholder="e.g. Slide deck"
            />
          </div>
          <div className="flex-1">
            <Input
              label="URL"
              value={resUrl}
              onChange={e => setResUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="pb-0.5">
            <Button variant="secondary" onClick={handleAddResource}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
