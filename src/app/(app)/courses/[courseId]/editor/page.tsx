'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ContentTree from '@/components/course-editor/ContentTree';
import NodeEditor from '@/components/course-editor/NodeEditor';
import { buildTree, flattenTree } from '@/lib/contentTree';
import { useGetCourseQuery, useGetCourseContentQuery, useUpdateCourseContentMutation } from '@/services/coursesApi';
import { useGetCourseTestsQuery } from '@/services/testsApi';
import type { ContentNode, ResourceType } from '@/types';

export default function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { data: course } = useGetCourseQuery(courseId);
  const { data: fetchedNodes = [], isLoading } = useGetCourseContentQuery(courseId);
  const { data: tests = [] } = useGetCourseTestsQuery({ courseId });
  const [updateContent, { isLoading: saving }] = useUpdateCourseContentMutation();

  const [nodes, setNodes] = useState<ContentNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (fetchedNodes.length > 0 && nodes.length === 0) setNodes(fetchedNodes);
  }, [fetchedNodes]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null;

  function addNode(type: ResourceType, parentId: string | null) {
    const newId = 'cn-' + Date.now();
    const siblings = nodes.filter(n => n.parentId === parentId);
    const order = siblings.length;
    const node: ContentNode = { id: newId, courseId, parentId, type, title: type === 'chapter' ? 'New Chapter' : `New ${type}`, order };
    setNodes(n => [...n, node]);
    setSelectedId(newId);
    setDirty(true);
  }

  function deleteNode(id: string) {
    setNodes(n => n.filter(x => x.id !== id && x.parentId !== id));
    if (selectedId === id) setSelectedId(null);
    setDirty(true);
  }

  function moveNode(id: string, dir: 'up' | 'down') {
    setNodes(prev => {
      const node = prev.find(n => n.id === id)!;
      const siblings = prev.filter(n => n.parentId === node.parentId).sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex(n => n.id === id);
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= siblings.length) return prev;
      const swap = siblings[swapIdx];
      return prev.map(n => n.id === id ? { ...n, order: swap.order } : n.id === swap.id ? { ...n, order: node.order } : n);
    });
    setDirty(true);
  }

  function updateNode(partial: Partial<ContentNode>) {
    if (!selectedId) return;
    setNodes(n => n.map(x => x.id === selectedId ? { ...x, ...partial } : x));
    setDirty(true);
  }

  async function handleSave() {
    const tree = buildTree(nodes);
    const flat = flattenTree(tree);
    await updateContent({ courseId, content: flat }).unwrap();
    setDirty(false);
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-4 px-6 py-3 bg-surface-raised border-b border-surface-border">
        <Link href={`/courses/${courseId}`} className="text-on-surface-faint hover:text-gray-700 dark:hover:text-gray-300">← Back</Link>
        <span className="text-sm font-medium text-on-surface">Course Editor — {course?.title ?? '...'}</span>
        {dirty && <span className="text-xs text-amber-500 font-medium">• Unsaved changes</span>}
        <div className="ml-auto">
          <Button variant="primary" onClick={handleSave} isLoading={saving}>Save</Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-x border-surface-border bg-surface-raised overflow-hidden flex flex-col">
          <ContentTree
            nodes={nodes}
            selectedId={selectedId}
            onSelect={n => setSelectedId(n.id)}
            onAdd={addNode}
            onDelete={deleteNode}
            onMoveUp={id => moveNode(id, 'up')}
            onMoveDown={id => moveNode(id, 'down')}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-surface">
          <NodeEditor node={selectedNode} tests={tests} onChange={updateNode} />
        </div>
      </div>
    </div>
  );
}
