'use client';
import { use } from 'react';
import Link from 'next/link';

export default function TestHistoryPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">My Test Results</h1>
          <p className="text-sm text-on-surface-faint mt-1">Test history coming soon</p>
        </div>
        <Link
          href={`/courses/${courseId}/test`}
          className="text-sm bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Take a Test
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm text-on-surface-faint mb-6">
        <Link href={`/courses/${courseId}/study`} className="hover:text-brand transition-colors">← Back to course</Link>
      </div>

      <div className="bg-surface-raised border border-surface-border rounded-xl p-10 text-center">
        <div className="text-5xl mb-3">📝</div>
        <p className="text-on-surface font-medium mb-1">Test history coming soon</p>
        <p className="text-on-surface-faint text-sm">Your past attempts will appear here once the endpoint is available.</p>
      </div>
    </div>
  );
}
