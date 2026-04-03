'use client';
import { useState } from 'react';
import { buildTree, getTypeIcon } from '@/lib/contentTree';
import Badge from '@/components/ui/Badge';
import type { ContentNode } from '@/types';

interface Props { nodes: ContentNode[] }

export default function ContentTreeReadOnly({ nodes }: Props) {
  const tree = buildTree(nodes);
  const [open, setOpen] = useState<Set<string>>(new Set(tree.map(c => c.id)));

  if (!tree.length) return <p className="text-gray-400 text-sm py-4 text-center">No content yet.</p>;

  return (
    <div className="space-y-2">
      {tree.map(chapter => (
        <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(prev => { const s = new Set(prev); s.has(chapter.id) ? s.delete(chapter.id) : s.add(chapter.id); return s; })}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
          >
            <span>{getTypeIcon('chapter')}</span>
            <span className="font-medium text-gray-800 text-sm flex-1">{chapter.title}</span>
            <span className="text-gray-400 text-xs">{chapter.children.length} items</span>
            <span className="text-gray-400">{open.has(chapter.id) ? '▾' : '▸'}</span>
          </button>
          {open.has(chapter.id) && (
            <div className="divide-y divide-gray-100">
              {chapter.children.length === 0 && (
                <p className="px-6 py-2 text-xs text-gray-400 italic">No resources in this chapter</p>
              )}
              {chapter.children.map(node => (
                <div key={node.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-gray-50">
                  <span className="text-base">{getTypeIcon(node.type)}</span>
                  <span className="text-sm text-gray-700 flex-1">{node.title}</span>
                  <Badge variant={node.type === 'test' ? 'warning' : node.type === 'video' ? 'info' : 'neutral'}>
                    {node.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
