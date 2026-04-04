'use client';
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import CourseFormModal from '@/components/courses/CourseFormModal';
import { useAppSelector } from '@/store/hooks';
import { useGetCoursesQuery, useCreateCourseMutation, useUpdateCourseMutation } from '@/services/coursesApi';
import type { Course, CourseVisibility } from '@/types';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
];

const VISIBILITY_BADGE: Record<string, 'neutral' | 'info' | 'success'> = {
  private: 'neutral', class: 'info', public: 'success',
};

export default function TeacherCoursesPage() {
  const user = useAppSelector(s => s.auth.user);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useGetCoursesQuery({
    teacherId: user?.id ?? '',
    tab: tab === 'all' ? undefined : tab,
    search: search || undefined,
  }, { skip: !user?.id });

  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();

  async function handleSave(data: { title: string; description: string; visibility: CourseVisibility }) {
    if (editCourse) {
      await updateCourse({ id: editCourse.id, ...data }).unwrap();
    } else {
      await createCourse({ ...data, organizationId: user!.organizationId, teacherId: user!.id }).unwrap();
    }
    setModalOpen(false);
    setEditCourse(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" onClick={() => { setEditCourse(null); setModalOpen(true); }}>+ New Course</Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />
        <div className="ml-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState title="No courses found" description={search ? 'Try a different search term' : 'Create your first course to get started'} action={{ label: 'Create Course', onClick: () => setModalOpen(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">{course.title}</h3>
                <Badge variant={VISIBILITY_BADGE[course.visibility]}>{course.visibility}</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-4">{course.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-4">
                <span>👥 {course.enrolledStudentIds.length} students</span>
                <span>{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/teacher/courses/${course.id}`} className="flex-1 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg py-2 transition-colors">
                  Manage
                </Link>
                <button onClick={() => { setEditCourse(course); setModalOpen(true); }} className="cursor-pointer text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditCourse(null); }}
        onSave={handleSave}
        initialData={editCourse ?? undefined}
        mode={editCourse ? 'edit' : 'create'}
        isLoading={creating || updating}
      />
    </div>
  );
}
