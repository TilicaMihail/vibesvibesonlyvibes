import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Test } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; testId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { testId } = await params;
  const tests = loadData<Test>('tests.json');
  const test = tests.find((t) => t.id === testId);

  if (!test) {
    return Response.json({ error: 'Test not found' }, { status: 404 });
  }

  return Response.json(test);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string; testId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { testId } = await params;
  const tests = loadData<Test>('tests.json');
  const test = tests.find((t) => t.id === testId);

  if (!test) {
    return Response.json({ error: 'Test not found' }, { status: 404 });
  }

  const body = await request.json() as Partial<Test>;
  const updated: Test = { ...test, ...body, id: test.id };

  saveData('tests.json', tests.map((t) => (t.id === testId ? updated : t)));

  return Response.json(updated);
}
