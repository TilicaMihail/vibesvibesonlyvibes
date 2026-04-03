'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Spinner from '@/components/ui/Spinner';
import Avatar from '@/components/ui/Avatar';
import ContentTreeReadOnly from '@/components/courses/ContentTreeReadOnly';
import CourseFormModal from '@/components/courses/CourseFormModal';
import { useGetCourseQuery, useGetCourseContentQuery, useGetCourseEnrollmentsQuery, useUpdateCourseMutation } from '@/services/coursesApi';
import type { CourseVisibility } from '@/types';

const TABS = [{ id: 'content', label: 'Content' }, { id: 'students', label: 'Students' }];
const VIS: Record<string, 'neutral' | 'info' | 'success'> = { private: 'neutral', class: 'info', public: 'success' };

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [tab, setTab] = useState('content');
  const [editOpen, setEditOpen] = useState(false);

  const { data: course, isLoading } = useGetCourseQuery(courseId);
  const { data: nodes = [] } = useGetCourseContentQuery(courseId);
  const { data: students = [] } = useGetCourseEnrollmentsQuery(courseId);
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();

  async function handleSave(data: { title: string; description: string; visibility: CourseVisibility }) {
    await updateCourse({ id: courseId, ...data }).unwrap();
    setEditOpen(false);
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!course) return <div className="text-center py-20 text-gray-400">Course not found</div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
        <Link href="/teacher/courses" className="hover:text-indigo-600">My Courses</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{course.title}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <Badge variant={VIS[course.visibility]}>{course.visibility}</Badge>
            </div>
            <p className="text-gray-500">{course.description}</p>
            <p className="text-xs text-gray-400 mt-2">👥 {course.enrolledStudentIds.length} enrolled • Updated {new Date(course.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
            <Link href={`/teacher/courses/${courseId}/editor`}>
              <Button variant="secondary">Content Editor</Button>
            </Link>
            <Link href={`/teacher/courses/${courseId}/test-editor`}>
              <Button variant="primary">Test Editor</Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === 'content' && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <ContentTreeReadOnly nodes={nodes} />
          </div>
        )}
        {tab === 'students' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {students.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No students enrolled yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                        <span className="text-sm font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                      <td className="px-4 py-3"><Badge variant={s.isActive ? 'success' : 'danger'}>{s.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <CourseFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initialData={course}
        mode="edit"
        isLoading={updating}
      />
    </div>
  );
}
