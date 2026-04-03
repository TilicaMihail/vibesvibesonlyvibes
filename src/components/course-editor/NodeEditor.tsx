'use client';
import Input from '@/components/ui/Input';
import type { ContentNode, Test } from '@/types';

interface Props {
  node: ContentNode | null;
  tests: Test[];
  onChange: (updated: Partial<ContentNode>) => void;
}

export default function NodeEditor({ node, tests, onChange }: Props) {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-sm">Select a node from the tree to edit it</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{typeIcon(node.type)}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{node.type}</span>
      </div>

      <Input
        label="Title"
        value={node.title}
        onChange={e => onChange({ title: e.target.value })}
        placeholder="Node title"
      />

      {node.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={12}
            value={node.textContent ?? ''}
            onChange={e => onChange({ textContent: e.target.value })}
            placeholder="# Heading&#10;&#10;Write your content in markdown..."
          />
        </div>
      )}

      {node.type === 'video' && (
        <>
          <Input label="Video URL (YouTube embed)" value={node.videoUrl ?? ''} onChange={e => onChange({ videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
          <Input label="Duration (minutes)" type="number" value={String(node.duration ?? '')} onChange={e => onChange({ duration: Number(e.target.value) })} placeholder="12" />
        </>
      )}

      {node.type === 'file' && (
        <>
          <Input label="File Name" value={node.fileName ?? ''} onChange={e => onChange({ fileName: e.target.value })} placeholder="document.pdf" />
          <Input label="File URL (mocked)" value={node.fileUrl ?? ''} onChange={e => onChange({ fileUrl: e.target.value })} placeholder="/assets/files/document.pdf" />
        </>
      )}

      {node.type === 'test' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Linked Test</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={node.testId ?? ''}
            onChange={e => onChange({ testId: e.target.value || undefined })}
          >
            <option value="">— Select a test —</option>
            {tests.map(t => <option key={t.id} value={t.id}>{t.title} ({t.questions.length} questions)</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Create or edit tests in the Test Editor.</p>
        </div>
      )}
    </div>
  );
}

function typeIcon(type: string) {
  const m: Record<string, string> = { chapter: '📁', text: '📄', video: '🎬', file: '📎', test: '📝' };
  return m[type] ?? '📄';
}
