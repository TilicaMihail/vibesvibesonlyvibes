import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { CourseProgress } from '@/types';

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
  const url = new URL(request.url);
  const courseId = url.searchParams.get('courseId') || '';

  const allProgress = loadData<CourseProgress>('progress.json').filter(
    (p) => p.studentId === userId
  );

  if (courseId) {
    const progress = allProgress.find((p) => p.courseId === courseId);
    if (!progress) {
      return Response.json({ error: 'Progress not found' }, { status: 404 });
    }
    return Response.json(progress);
  }

  return Response.json(allProgress);
}
