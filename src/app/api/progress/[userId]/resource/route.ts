import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { CourseProgress, ContentNode, ResourceProgress } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;
  const body = await request.json() as { courseId: string; contentNodeId: string };
  const { courseId, contentNodeId } = body;

  const allProgress = loadData<CourseProgress>('progress.json');
  const now = new Date().toISOString();

  let courseProgress = allProgress.find(
    (p) => p.studentId === userId && p.courseId === courseId
  );

  if (!courseProgress) {
    courseProgress = {
      id: 'prog-' + Date.now(),
      studentId: userId,
      courseId,
      resourceProgress: [],
      completionPercent: 0,
      lastAccessedAt: now,
      testSessionIds: [],
    };
  }

  const existingIndex = courseProgress.resourceProgress.findIndex(
    (r) => r.contentNodeId === contentNodeId
  );

  const updatedResource: ResourceProgress = {
    contentNodeId,
    completed: true,
    completedAt: now,
    timeSpentSeconds:
      existingIndex >= 0
        ? courseProgress.resourceProgress[existingIndex].timeSpentSeconds
        : 0,
  };

  const updatedResourceProgress: ResourceProgress[] =
    existingIndex >= 0
      ? courseProgress.resourceProgress.map((r, i) =>
          i === existingIndex ? updatedResource : r
        )
      : [...courseProgress.resourceProgress, updatedResource];

  const allContent = loadData<ContentNode>('content.json');
  const courseContent = allContent.filter((n) => n.courseId === courseId);
  const totalResources = courseContent.length;
  const completedCount = updatedResourceProgress.filter((r) => r.completed).length;
  const completionPercent =
    totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

  const updated: CourseProgress = {
    ...courseProgress,
    resourceProgress: updatedResourceProgress,
    completionPercent,
    lastAccessedAt: now,
  };

  return Response.json(updated);
}
