import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Organization } from '@/types';

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

  const orgs = loadData<Organization>('organizations.json');
  const org = orgs.find((o) => o.id === auth.orgId);

  if (!org) {
    return Response.json({ error: 'Organization not found' }, { status: 404 });
  }

  return Response.json(org);
}

export async function PUT(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgs = loadData<Organization>('organizations.json');
  const org = orgs.find((o) => o.id === auth.orgId);

  if (!org) {
    return Response.json({ error: 'Organization not found' }, { status: 404 });
  }

  const body = await request.json() as Partial<Organization>;
  const updated: Organization = { ...org, ...body, id: org.id };

  saveData('organizations.json', orgs.map((o) => (o.id === org.id ? updated : o)));

  return Response.json(updated);
}
