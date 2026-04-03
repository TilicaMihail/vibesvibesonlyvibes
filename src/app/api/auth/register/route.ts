import { loadData } from '@/lib/dataLoader';
import { encodeToken } from '@/lib/jwt';
import type { User } from '@/types';

export async function POST(request: Request) {
  const {
    organizationName,
    organizationSlug,
    adminEmail,
    adminPassword,
    adminFirstName,
    adminLastName,
  } = await request.json() as {
    organizationName: string;
    organizationSlug: string;
    adminEmail: string;
    adminPassword: string;
    adminFirstName: string;
    adminLastName: string;
  };

  const users = loadData<User>('users.json');
  const existing = users.find((u) => u.email === adminEmail);

  if (existing) {
    return Response.json({ error: 'Email already in use' }, { status: 409 });
  }

  const org = {
    id: `org-${Date.now()}`,
    name: organizationName,
    slug: organizationSlug,
    createdAt: new Date().toISOString(),
  };

  const newUser: User = {
    id: `u-admin-${Date.now()}`,
    organizationId: org.id,
    email: adminEmail,
    password: adminPassword,
    firstName: adminFirstName,
    lastName: adminLastName,
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const token = encodeToken({
    userId: newUser.id,
    role: newUser.role,
    orgId: newUser.organizationId,
    exp: Date.now() + 86400000,
  });

  const { password: _password, ...userPublic } = newUser;

  return Response.json(
    { token, user: userPublic, organizationId: org.id },
    { status: 201 }
  );
}
