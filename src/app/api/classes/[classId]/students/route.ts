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
  const students: UserPublic[] = users
    .filter((u) => cls.studentIds.includes(u.id))
    .map(({ password: _p, ...rest }) => rest);

  return Response.json(students);
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

  const body = await request.json() as { studentIds: string[] };
  const updated: Class = { ...cls, studentIds: body.studentIds };

  return Response.json(updated);
}
