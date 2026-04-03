import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Class, User, UserPublic } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId } = await params;
  const classes = loadData<Class>('classes.json');
  const cls = classes.find((c) => c.id === classId);

  if (!cls) {
    return Response.json({ error: 'Class not found' }, { status: 404 });
  }

  const users = loadData<User>('users.json');

  const toPublic = (u: User): UserPublic => {
    const { password: _p, ...rest } = u;
    return rest;
  };

  const teachers: UserPublic[] = users
    .filter((u) => cls.teacherIds.includes(u.id))
    .map(toPublic);

  const students: UserPublic[] = users
    .filter((u) => cls.studentIds.includes(u.id))
    .map(toPublic);

  return Response.json({ ...cls, teachers, students });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId } = await params;
  const classes = loadData<Class>('classes.json');
  const cls = classes.find((c) => c.id === classId);

  if (!cls) {
    return Response.json({ error: 'Class not found' }, { status: 404 });
  }

  const body = await request.json() as {
    name?: string;
    description?: string;
    teacherIds?: string[];
  };

  const updated: Class = { ...cls, ...body, id: cls.id };

  return Response.json(updated);
}
