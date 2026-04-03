import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Course, User, UserPublic } from '@/types';

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

  const users = loadData<User>('users.json');
  const students: UserPublic[] = users
    .filter((u) => course.enrolledStudentIds.includes(u.id))
    .map(({ password: _p, ...rest }) => rest);

  return Response.json(students);
}

export async function POST(
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

  const { studentId } = await request.json() as { studentId: string };

  const enrolledStudentIds = course.enrolledStudentIds.includes(studentId)
    ? course.enrolledStudentIds
    : [...course.enrolledStudentIds, studentId];

  const updated: Course = {
    ...course,
    enrolledStudentIds,
    updatedAt: new Date().toISOString(),
  };

  return Response.json(updated);
}

export async function DELETE(
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

  const { studentId } = await request.json() as { studentId: string };

  const updated: Course = {
    ...course,
    enrolledStudentIds: course.enrolledStudentIds.filter((id) => id !== studentId),
    updatedAt: new Date().toISOString(),
  };

  return Response.json(updated);
}
