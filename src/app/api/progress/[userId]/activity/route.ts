import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { TestSession, CourseProgress, ActivityEntry } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;

  const sessions = loadData<TestSession>('test-sessions.json').filter(
    (s) => s.studentId === userId && s.status === 'submitted'
  );

  const testActivities: ActivityEntry[] = sessions.map((s) => ({
    id: 'act-ts-' + s.id,
    studentId: userId,
    type: 'test_submitted',
    courseId: s.courseId,
    testSessionId: s.id,
    timestamp: s.submittedAt || s.startedAt,
    meta: {
      score: s.score ?? 0,
      testId: s.testId,
    },
  }));

  const allProgress = loadData<CourseProgress>('progress.json').filter(
    (p) => p.studentId === userId
  );

  const resourceActivities: ActivityEntry[] = allProgress.flatMap((p) =>
    p.resourceProgress
      .filter((r) => r.completed && r.completedAt)
      .map((r) => ({
        id: 'act-res-' + p.courseId + '-' + r.contentNodeId,
        studentId: userId,
        type: 'resource_viewed' as const,
        courseId: p.courseId,
        resourceId: r.contentNodeId,
        timestamp: r.completedAt as string,
      }))
  );

  const merged: ActivityEntry[] = [...testActivities, ...resourceActivities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return Response.json(merged.slice(0, 20));
}
