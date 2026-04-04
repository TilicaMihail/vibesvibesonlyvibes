import { loadData, saveData } from '@/lib/dataLoader';
import { encodeToken } from '@/lib/jwt';
import type { User, Organization } from '@/types';

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

  const org: Organization = {
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

  const orgs = loadData<Organization>('organizations.json');
  saveData('organizations.json', [...orgs, org]);
  saveData('users.json', [...users, newUser]);

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
