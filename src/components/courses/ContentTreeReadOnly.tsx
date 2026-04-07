'use client';
import { useState } from 'react';
import { buildTree, getTypeIcon } from '@/lib/contentTree';
import Badge from '@/components/ui/Badge';
import type { ContentNode } from '@/types';

interface Props {
  nodes: ContentNode[]
  selectedId?: string | null
  onSelect?: (node: ContentNode) => void
}

export default function ContentTreeReadOnly({ nodes, selectedId, onSelect }: Props) {
  const tree = buildTree(nodes);
  const [open, setOpen] = useState<Set<string>>(new Set(tree.map(c => c.id)));

  if (!tree.length) return <p className="text-on-surface-faint text-sm py-4 text-center">No content yet.</p>;

  return (
    <div className="space-y-2">
      {tree.map(chapter => (
        <div key={chapter.id} className="border border-surface-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(prev => { const s = new Set(prev); s.has(chapter.id) ? s.delete(chapter.id) : s.add(chapter.id); return s; })}
            className="w-full flex items-center gap-2 px-4 py-3 bg-surface hover:bg-surface-border text-left transition-colors"
          >
            <span>{getTypeIcon('chapter')}</span>
            <span className="font-medium text-on-surface text-sm flex-1">{chapter.title}</span>
            <span className="text-on-surface-faint text-xs">{chapter.children.length} items</span>
            <span className="text-on-surface-faint">{open.has(chapter.id) ? '▾' : '▸'}</span>
          </button>
          {open.has(chapter.id) && (
            <div className="divide-y divide-surface-border">
              {chapter.children.length === 0 && (
                <p className="px-6 py-2 text-xs text-on-surface-faint italic">No resources in this chapter</p>
              )}
              {chapter.children.map(node => (
                <div
                  key={node.id}
                  onClick={() => onSelect?.(node)}
                  className={[
                    'flex items-center gap-3 px-6 py-2.5 transition-colors',
                    onSelect ? 'cursor-pointer' : '',
                    selectedId === node.id
                      ? 'bg-brand/10 text-brand-light'
                      : 'hover:bg-surface',
                  ].join(' ')}
                >
                  <span className="text-base">{getTypeIcon(node.type)}</span>
                  <span className={['text-sm flex-1', selectedId === node.id ? 'text-brand-light font-medium' : 'text-on-surface'].join(' ')}>{node.title}</span>
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
