import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { TestSession } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await params;
  const sessions = loadData<TestSession>('test-sessions.json');
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  return Response.json(session);
}
