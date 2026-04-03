import { loadData } from '@/lib/dataLoader';
import { encodeToken } from '@/lib/jwt';
import type { User } from '@/types';

export async function POST(request: Request) {
  const { email, password } = await request.json() as { email: string; password: string };

  const users = loadData<User>('users.json');
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (!user.isActive) {
    return Response.json({ error: 'Account deactivated' }, { status: 403 });
  }

  const token = encodeToken({
    userId: user.id,
    role: user.role,
    orgId: user.organizationId,
    exp: Date.now() + 86400000,
  });

  const { password: _password, ...userPublic } = user;

  return Response.json({ token, user: userPublic }, { status: 200 });
}
