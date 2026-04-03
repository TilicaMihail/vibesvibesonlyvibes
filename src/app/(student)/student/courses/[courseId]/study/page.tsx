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

export default function CourseStudyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const user = useAppSelector(s => s.auth.user);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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
      router.push(`/student/courses/${courseId}/test?topics=${encodeURIComponent(node.title)}`);
    }
  }

  function toggleTopic(title: string) {
    setSelectedTopics(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="flex h-full -m-6">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 mb-1 font-medium truncate">{course?.title}</p>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
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
      <div className="flex-1 overflow-y-auto p-6">
        {!selectedNode ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="text-5xl mb-3">📚</div>
            <p>Select a resource from the tree to start learning</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <Link href="/student/courses" className="hover:text-indigo-600">Courses</Link>
              <span>/</span>
              <span className="text-gray-700">{selectedNode.title}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{selectedNode.title}</h1>

            {selectedNode.type === 'text' && (
              <div className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-xl p-6 whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                {selectedNode.textContent ?? ''}
              </div>
            )}

            {selectedNode.type === 'video' && selectedNode.videoUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src={selectedNode.videoUrl}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {selectedNode.type === 'file' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">📎</div>
                <div>
                  <p className="font-medium text-gray-900">{selectedNode.fileName ?? 'File'}</p>
                  <a href={selectedNode.fileUrl ?? '#'} className="text-sm text-indigo-600 hover:underline">Download</a>
                </div>
              </div>
            )}

            {selectedNode.type === 'chapter' && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-indigo-800">
                <p className="font-medium">Chapter Overview</p>
                <p className="text-sm mt-1">Select a resource from this chapter in the sidebar to begin.</p>
              </div>
            )}

            {/* Generate test section */}
            {nodes.filter(n => n.type !== 'chapter').length > 0 && (
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-800 mb-3">🧠 Generate Custom Test</h3>
                <p className="text-sm text-gray-500 mb-3">Select topics to test yourself on</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {nodes.filter(n => n.parentId !== null && n.type !== 'test').map(n => (
                    <button
                      key={n.id}
                      onClick={() => toggleTopic(n.title)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedTopics.includes(n.title) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:border-indigo-400'}`}
                    >
                      {n.title}
                    </button>
                  ))}
                </div>
                <Link
                  href={`/student/courses/${courseId}/test?topics=${encodeURIComponent(selectedTopics.join(','))}`}
                  className={`inline-block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${selectedTopics.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}
                >
                  Generate Test
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
