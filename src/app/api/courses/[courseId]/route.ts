import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Course } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await params;
  const courses = loadData<Course>('courses.json');
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return Response.json({ error: 'Course not found' }, { status: 404 });
  }

  return Response.json(course);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await params;
  const courses = loadData<Course>('courses.json');
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return Response.json({ error: 'Course not found' }, { status: 404 });
  }

  const body = await request.json() as {
    title?: string;
    description?: string;
    visibility?: Course['visibility'];
    classIds?: string[];
  };

  const updated: Course = {
    ...course,
    ...body,
    id: course.id,
    updatedAt: new Date().toISOString(),
  };

  return Response.json(updated);
}
