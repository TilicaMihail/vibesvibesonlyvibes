'use client';
import { use } from 'react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { useGetCourseQuery } from '@/services/coursesApi';

export default function CourseProgressPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { data: course, isLoading } = useGetCourseQuery(courseId);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-4">
        <Link href="/courses" className="hover:text-brand">Courses</Link>
        <span>/</span>
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand">{course?.title}</Link>
        <span>/</span>
        <span className="text-on-surface">Progress</span>
      </div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Course Progress</h1>
      <div className="bg-surface-raised border border-surface-border rounded-xl p-10 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-on-surface font-medium">Progress tracking coming soon</p>
        <p className="text-on-surface-faint text-sm mt-1">Detailed progress will be available once backend endpoints are ready.</p>
      </div>
    </div>
  );
}
