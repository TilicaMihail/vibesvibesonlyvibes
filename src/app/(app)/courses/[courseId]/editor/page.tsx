'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import ContentTree from '@/components/course-editor/ContentTree';
import LessonEditor from '@/components/course-editor/LessonEditor';
import { useGetCourseQuery } from '@/services/coursesApi';
import { useCreateChapterMutation, useDeleteChapterMutation, useUpdateChapterMutation } from '@/services/chaptersApi';
import { useCreateLessonMutation, useUpdateLessonMutation, useDeleteLessonMutation, useCreateLessonResourceMutation, useDeleteLessonResourceMutation } from '@/services/lessonsApi';
import type { ChapterWithLessons, Lesson } from '@/types';

export default function CourseEditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { data: course, isLoading } = useGetCourseQuery(courseId);
  const chapters: ChapterWithLessons[] = course?.chapters ?? [];

  const [createChapter] = useCreateChapterMutation();
  const [deleteChapter] = useDeleteChapterMutation();
  const [updateChapter] = useUpdateChapterMutation();
  const [createLesson] = useCreateLessonMutation();
  const [updateLesson] = useUpdateLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [createLessonResource] = useCreateLessonResourceMutation();
  const [deleteLessonResource] = useDeleteLessonResourceMutation();

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const selectedLesson = chapters.flatMap(c => c.lessons).find(l => l.id === selectedLessonId) ?? null;

  async function handleAddChapter() {
    await createChapter({ courseId, title: 'New Chapter' });
  }

  async function handleDeleteChapter(id: string) {
    await deleteChapter({ id, courseId });
  }

  async function handleMoveChapter(id: string, dir: 'up' | 'down') {
    const idx = chapters.findIndex(c => c.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= chapters.length) return;
    await updateChapter({ id, orderIndex: chapters[swapIdx].orderIndex });
    await updateChapter({ id: chapters[swapIdx].id, orderIndex: chapters[idx].orderIndex });
  }

  async function handleAddLesson(chapterId: string) {
    const lesson = await createLesson({ chapterId, title: 'New Lesson', contentMarkdown: '' }).unwrap();
    setSelectedLessonId(lesson.id);
  }

  async function handleDeleteLesson(id: string, chapterId: string) {
    await deleteLesson({ id, chapterId });
    if (selectedLessonId === id) setSelectedLessonId(null);
  }

  async function handleMoveLesson(id: string, chapterId: string, dir: 'up' | 'down') {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const lessons = [...chapter.lessons].sort((a, b) => a.orderIndex - b.orderIndex);
    const idx = lessons.findIndex(l => l.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) return;
    await updateLesson({ id, orderIndex: lessons[swapIdx].orderIndex });
    await updateLesson({ id: lessons[swapIdx].id, orderIndex: lessons[idx].orderIndex });
  }

  async function handleLessonChange(partial: Partial<Lesson>) {
    if (!selectedLessonId) return;
    await updateLesson({ id: selectedLessonId, ...partial });
  }

  async function handleAddResource(title: string, url: string) {
    if (!selectedLessonId) return;
    await createLessonResource({ lessonId: selectedLessonId, title, url });
  }

  async function handleDeleteResource(resourceId: string) {
    if (!selectedLessonId) return;
    await deleteLessonResource({ lessonId: selectedLessonId, resourceId });
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-4 px-6 py-3 bg-surface-raised border-b border-surface-border">
        <Link href={`/courses/${courseId}`} className="text-on-surface-faint hover:text-gray-700 dark:hover:text-gray-300">← Back</Link>
        <span className="text-sm font-medium text-on-surface">Course Editor — {course?.title ?? '...'}</span>
        <span className="text-xs text-on-surface-faint ml-auto">Changes save automatically</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-x border-surface-border bg-surface-raised overflow-hidden flex flex-col">
          <ContentTree
            chapters={chapters}
            selectedLessonId={selectedLessonId}
            onSelectLesson={l => setSelectedLessonId(l.id)}
            onAddChapter={handleAddChapter}
            onAddLesson={handleAddLesson}
            onDeleteChapter={handleDeleteChapter}
            onDeleteLesson={handleDeleteLesson}
            onMoveChapter={handleMoveChapter}
            onMoveLesson={handleMoveLesson}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-surface">
          <LessonEditor
            lesson={selectedLesson}
            onChange={handleLessonChange}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
          />
        </div>
      </div>
    </div>
  );
}
