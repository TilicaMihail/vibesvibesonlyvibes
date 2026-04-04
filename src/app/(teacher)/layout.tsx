'use client';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import TopBar from '@/components/layout/TopBar';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      <TeacherSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
