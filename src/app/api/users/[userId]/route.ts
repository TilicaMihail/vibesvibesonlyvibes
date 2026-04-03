import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { User } from '@/types';

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
  const users = loadData<User>('users.json');
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _p, ...userPublic } = user;
  return Response.json(userPublic);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;
  const users = loadData<User>('users.json');
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const body = await request.json() as Partial<User>;
  const updated: User = { ...user, ...body, id: user.id };
  const { password: _p, ...userPublic } = updated;

  return Response.json(userPublic);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await params;
  const users = loadData<User>('users.json');
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const updated: User = { ...user, isActive: !user.isActive };
  const { password: _p, ...userPublic } = updated;

  return Response.json(userPublic);
}
