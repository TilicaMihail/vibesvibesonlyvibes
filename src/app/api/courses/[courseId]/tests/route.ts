import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Test } from '@/types';

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
  const tests = loadData<Test>('tests.json').filter((t) => t.courseId === courseId);

  return Response.json(tests);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await params;
  const body = await request.json() as Omit<Test, 'id' | 'createdAt'>;

  const newTest: Test = {
    id: 'test-' + Date.now(),
    createdAt: new Date().toISOString(),
    ...body,
    courseId,
  };

  return Response.json(newTest, { status: 201 });
}
