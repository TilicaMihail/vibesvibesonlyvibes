import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { ContentNode } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await params;
  const nodes = loadData<ContentNode>('content.json')
    .filter((n) => n.courseId === courseId)
    .sort((a, b) => a.order - b.order);

  return Response.json(nodes);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await params;

  const body = await request.json() as ContentNode[];

  return Response.json(body);
}
