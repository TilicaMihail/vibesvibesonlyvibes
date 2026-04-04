import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { User } from '@/types';

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
  const role = url.searchParams.get('role') || '';
  const search = url.searchParams.get('search') || '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10));

  let users = loadData<User>('users.json').filter(
    (u) => u.organizationId === auth.orgId
  );

  if (role) {
    users = users.filter((u) => u.role === role);
  }

  if (search) {
    const q = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  const total = users.length;
  const start = (page - 1) * limit;
  const paged = users.slice(start, start + limit);

  const result = paged.map(({ password: _p, ...rest }) => rest);

  return Response.json({ users: result, total, page, limit });
}

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: string;
    assignmentScope?: 'organization' | 'class';
  };

  const users = loadData<User>('users.json');
  const duplicate = users.find((u) => u.email === body.email);
  if (duplicate) {
    return Response.json({ error: 'Email already in use' }, { status: 409 });
  }

  const newUser: User = {
    id: 'u-' + Date.now(),
    isActive: true,
    createdAt: new Date().toISOString(),
    ...body,
  } as User;

  saveData('users.json', [...users, newUser]);

  const { password: _p, ...userPublic } = newUser;

  return Response.json(userPublic, { status: 201 });
}
