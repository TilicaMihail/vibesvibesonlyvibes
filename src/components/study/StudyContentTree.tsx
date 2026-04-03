'use client';
import { useState } from 'react';
import { buildTree, getTypeIcon } from '@/lib/contentTree';
import type { ContentNode, ResourceProgress } from '@/types';

interface Props {
  nodes: ContentNode[];
  progress: ResourceProgress[];
  selectedId: string | null;
  onSelect: (node: ContentNode) => void;
}

export default function StudyContentTree({ nodes, progress, selectedId, onSelect }: Props) {
  const tree = buildTree(nodes);
  const [open, setOpen] = useState<Set<string>>(new Set(tree.map(c => c.id)));
  const completedSet = new Set(progress.filter(p => p.completed).map(p => p.contentNodeId));

  const toggle = (id: string) => setOpen(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });

  if (!tree.length) return <p className="text-gray-400 text-sm p-4">No content available</p>;

  return (
    <div className="space-y-1">
      {tree.map(chapter => {
        const total = chapter.children.length;
        const done = chapter.children.filter(c => completedSet.has(c.id)).length;
        return (
          <div key={chapter.id}>
            <button
              onClick={() => toggle(chapter.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left ${selectedId === chapter.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span className="text-base">📁</span>
              <span className="flex-1 text-sm font-medium truncate">{chapter.title}</span>
              <span className="text-xs text-gray-400 shrink-0">{done}/{total}</span>
              <span className="text-gray-400 text-xs">{open.has(chapter.id) ? '▾' : '▸'}</span>
            </button>
            {open.has(chapter.id) && (
              <div className="ml-4 space-y-0.5">
                {chapter.children.map(node => {
                  const completed = completedSet.has(node.id);
                  const active = selectedId === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => onSelect(node)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left ${active ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <span className="text-sm">{getTypeIcon(node.type)}</span>
                      <span className="flex-1 text-sm truncate">{node.title}</span>
                      {completed && <span className="text-green-500 text-xs shrink-0">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
