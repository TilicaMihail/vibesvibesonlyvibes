'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';
import StudyContentTree from '@/components/study/StudyContentTree';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { useGetCourseQuery } from '@/services/coursesApi';
import type { ChapterWithLessons, Lesson } from '@/types';

export default function CourseStudyPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const { data: course, isLoading } = useGetCourseQuery(courseId);
  const chapters: ChapterWithLessons[] = course?.chapters ?? [];
  const selectedLesson = chapters.flatMap(c => c.lessons).find(l => l.id === selectedLessonId) ?? null;

  function handleSelect(lesson: Lesson) {
    setSelectedLessonId(lesson.id);
    if (lesson.testId) {
      router.push(`/courses/${courseId}/test?testId=${lesson.testId}`);
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="absolute inset-0 flex">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-surface-raised border-x border-surface-border flex flex-col overflow-hidden">
        <div className="p-4 border-b border-surface-border">
          <p className="text-xs text-on-surface-faint mb-1 font-medium truncate">{course?.title}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <StudyContentTree
            chapters={chapters}
            selectedLessonId={selectedLessonId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface">
        {!selectedLesson ? (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-faint">
            <div className="text-5xl mb-3">📚</div>
            <p>Select a lesson from the tree to start learning</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-on-surface-faint mb-4">
              <Link href="/courses" className="hover:text-brand">Courses</Link>
              <span>/</span>
              <span className="text-on-surface">{selectedLesson.title}</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-6">{selectedLesson.title}</h1>

            <div className="bg-surface-raised border border-surface-border rounded-xl p-6 mb-4">
              <MarkdownContent>{selectedLesson.contentMarkdown ?? ''}</MarkdownContent>
            </div>

            {selectedLesson.lessonResources.length > 0 && (
              <div className="bg-surface-raised border border-surface-border rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-on-surface mb-2">Resources</h3>
                <div className="space-y-2">
                  {selectedLesson.lessonResources.map(r => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-brand hover:underline"
                    >
                      <span>📎</span>
                      <span>{r.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selectedLesson.testId && (
              <button
                onClick={() => router.push(`/courses/${courseId}/test?testId=${selectedLesson.testId}`)}
                className="w-full py-3 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-dark transition-colors"
              >
                📝 Take Test for this Lesson
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
