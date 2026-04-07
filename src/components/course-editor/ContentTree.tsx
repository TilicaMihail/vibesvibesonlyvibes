'use client';
import { useState } from 'react';
import { buildTree, getTypeIcon } from '@/lib/contentTree';
import type { ContentNode, ResourceType } from '@/types';

interface Props {
  nodes: ContentNode[];
  selectedId: string | null;
  onSelect: (node: ContentNode) => void;
  onAdd: (type: ResourceType, parentId: string | null) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function ContentTree({ nodes, selectedId, onSelect, onAdd, onDelete, onMoveUp, onMoveDown }: Props) {
  const tree = buildTree(nodes);
  const [open, setOpen] = useState<Set<string>>(new Set(tree.map(c => c.id)));

  const toggleChapter = (id: string) => setOpen(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const childTypes: ResourceType[] = ['text', 'video', 'file', 'test'];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border">
        <span className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">Content</span>
        <button
          onClick={() => onAdd('chapter', null)}
          className="text-xs text-brand hover:text-brand-dark font-medium"
        >+ Chapter</button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {tree.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-on-surface-faint text-sm">No chapters yet.</p>
            <button onClick={() => onAdd('chapter', null)} className="mt-2 text-brand text-sm hover:underline">Add first chapter</button>
          </div>
        )}
        {tree.map((chapter, ci) => (
          <div key={chapter.id}>
            <div
              onClick={() => { toggleChapter(chapter.id); onSelect(chapter); }}
              className={`flex items-center gap-1.5 px-3 py-2 cursor-pointer group ${selectedId === chapter.id ? 'bg-brand/5 text-brand' : 'hover:bg-surface text-on-surface'}`}
            >
              <span className="text-sm">{getTypeIcon('chapter')}</span>
              <span className="flex-1 text-sm font-medium truncate">{chapter.title}</span>
              <div className="hidden group-hover:flex items-center gap-0.5">
                <IconBtn onClick={e => { e.stopPropagation(); onMoveUp(chapter.id); }} title="Move up">↑</IconBtn>
                <IconBtn onClick={e => { e.stopPropagation(); onMoveDown(chapter.id); }} title="Move down">↓</IconBtn>
                <IconBtn onClick={e => { e.stopPropagation(); onDelete(chapter.id); }} title="Delete" danger>×</IconBtn>
              </div>
              <span className="text-on-surface-faint text-xs ml-1">{open.has(chapter.id) ? '▾' : '▸'}</span>
            </div>
            {open.has(chapter.id) && (
              <div>
                {chapter.children.map((child, li) => (
                  <div
                    key={child.id}
                    onClick={() => onSelect(child)}
                    className={`flex items-center gap-1.5 pl-8 pr-3 py-1.5 cursor-pointer group ${selectedId === child.id ? 'bg-brand/5 text-brand' : 'hover:bg-surface text-on-surface-muted'}`}
                  >
                    <span className="text-sm">{getTypeIcon(child.type)}</span>
                    <span className="flex-1 text-sm truncate">{child.title}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <IconBtn onClick={e => { e.stopPropagation(); onMoveUp(child.id); }} title="Move up">↑</IconBtn>
                      <IconBtn onClick={e => { e.stopPropagation(); onMoveDown(child.id); }} title="Move down">↓</IconBtn>
                      <IconBtn onClick={e => { e.stopPropagation(); onDelete(child.id); }} title="Delete" danger>×</IconBtn>
                    </div>
                  </div>
                ))}
                <div className="pl-8 pr-3 py-1 flex flex-wrap gap-1">
                  {childTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => onAdd(t, chapter.id)}
                      className="text-xs text-on-surface-faint hover:text-brand hover:bg-brand/5 px-1.5 py-0.5 rounded"
                    >+{t}</button>
                  ))}
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
