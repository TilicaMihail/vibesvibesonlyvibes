import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Class } from '@/types';

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
  const search = url.searchParams.get('search') || '';

  let classes = loadData<Class>('classes.json').filter(
    (c) => c.organizationId === auth.orgId
  );

  if (search) {
    const q = search.toLowerCase();
    classes = classes.filter((c) => c.name.toLowerCase().includes(q));
  }

  return Response.json(classes);
}

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as {
    name: string;
    description?: string;
    teacherIds?: string[];
    organizationId: string;
  };

  const newClass: Class = {
    id: 'cls-' + Date.now(),
    studentIds: [],
    isArchived: false,
    createdAt: new Date().toISOString(),
    teacherIds: [],
    ...body,
  };

  const classes = loadData<Class>('classes.json');
  saveData('classes.json', [...classes, newClass]);

  return Response.json(newClass, { status: 201 });
}
