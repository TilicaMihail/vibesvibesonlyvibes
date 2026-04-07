'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';
import ProgressBar from '@/components/ui/ProgressBar';
import StudyContentTree from '@/components/study/StudyContentTree';
import { useAppSelector } from '@/store/hooks';
import { useGetCourseQuery, useGetCourseContentQuery } from '@/services/coursesApi';
import { useGetCourseProgressQuery, useMarkResourceCompleteMutation } from '@/services/progressApi';
import type { ContentNode } from '@/types';
import MarkdownContent from '@/components/ui/MarkdownContent';

export default function CourseStudyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const user = useAppSelector(s => s.auth.user);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: course } = useGetCourseQuery(courseId);
  const { data: nodes = [], isLoading } = useGetCourseContentQuery(courseId);
  const { data: progress } = useGetCourseProgressQuery({ userId: user?.id ?? '', courseId }, { skip: !user?.id });
  const [markComplete] = useMarkResourceCompleteMutation();

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null;
  const progressItems = progress?.resourceProgress ?? [];

  useEffect(() => {
    if (nodes.length > 0 && !selectedId) {
      const first = nodes.find(n => n.parentId !== null) ?? nodes[0];
      if (first) setSelectedId(first.id);
    }
  }, [nodes]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(node: ContentNode) {
    setSelectedId(node.id);
    if (node.type !== 'chapter' && node.type !== 'test' && user?.id) {
      markComplete({ userId: user.id, courseId, contentNodeId: node.id });
    }
    if (node.type === 'test') {
      const testId = (node as import('@/types').ContentNode).testId;
      router.push(`/courses/${courseId}/test${testId ? `?testId=${testId}` : ''}`);
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="absolute inset-0 flex">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-surface-raised border-x border-surface-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-surface-border">
          <p className="text-xs text-on-surface-faint mb-1 font-medium truncate">{course?.title}</p>
          <div className="flex justify-between text-xs text-on-surface-faint mb-1.5">
            <span>Progress</span><span>{progress?.completionPercent ?? 0}%</span>
          </div>
          <ProgressBar value={progress?.completionPercent ?? 0} size="sm" color={progress?.completionPercent === 100 ? 'green' : 'indigo'} />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <StudyContentTree
            nodes={nodes}
            progress={progressItems}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface">
        {!selectedNode ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-faint">
            <div className="text-5xl mb-3">📚</div>
            <p>Select a resource from the tree to start learning</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-on-surface-faint mb-4">
              <Link href="/courses" className="hover:text-brand">Courses</Link>
              <span>/</span>
              <span className="text-on-surface">{selectedNode.title}</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-6">{selectedNode.title}</h1>

            {selectedNode.type === 'text' && (
              <div className="bg-surface-raised border border-surface-border rounded-xl p-6">
                <MarkdownContent>{selectedNode.textContent ?? ''}</MarkdownContent>
              </div>
            )}

            {selectedNode.type === 'video' && selectedNode.videoUrl && (
              <div className="rounded-xl overflow-hidden border border-surface-border">
                <iframe
                  src={selectedNode.videoUrl}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {selectedNode.type === 'file' && (
              <div className="bg-surface-raised border border-surface-border rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center text-2xl">📎</div>
                <div>
                  <p className="font-medium text-on-surface">{selectedNode.fileName ?? 'File'}</p>
                  <a href={selectedNode.fileUrl ?? '#'} className="text-sm text-brand hover:underline">Download</a>
                </div>
              </div>
            )}

            {selectedNode.type === 'chapter' && (
              <div className="bg-brand/5 border border-brand/20 rounded-xl p-6 text-on-surface">
                <p className="font-medium">Chapter Overview</p>
                <p className="text-sm mt-1">Select a resource from this chapter in the sidebar to begin.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
