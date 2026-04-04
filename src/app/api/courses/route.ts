import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Course } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const teacherId = url.searchParams.get('teacherId') || '';
  const tab = url.searchParams.get('tab') || '';
  const search = url.searchParams.get('search') || '';
  const studentId = url.searchParams.get('studentId') || '';

  let courses = loadData<Course>('courses.json');

  if (tab === 'owned') {
    courses = courses.filter((c) => c.teacherId === teacherId);
  } else if (tab === 'assigned') {
    courses = courses.filter((c) => c.enrolledStudentIds.includes(studentId));
  } else if (tab === 'public') {
    courses = courses.filter((c) => c.visibility === 'public');
  } else if (tab === 'archived') {
    courses = courses.filter((c) => c.isArchived === true);
  }

  if (search) {
    const q = search.toLowerCase();
    courses = courses.filter((c) => c.title.toLowerCase().includes(q));
  }

  return Response.json(courses);
}

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as Omit<Course, 'id' | 'classIds' | 'enrolledStudentIds' | 'isArchived' | 'createdAt' | 'updatedAt'>;

  const now = new Date().toISOString();
  const newCourse: Course = {
    id: 'course-' + Date.now(),
    classIds: [],
    enrolledStudentIds: [],
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    ...body,
  };

  const courses = loadData<Course>('courses.json');
  saveData('courses.json', [...courses, newCourse]);

  return Response.json(newCourse, { status: 201 });
}
