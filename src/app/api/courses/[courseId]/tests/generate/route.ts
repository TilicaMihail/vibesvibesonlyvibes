import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Test, Question } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const body = await request.json() as {
    topics: string[];
    count: number;
    title?: string;
  };

  const tests = loadData<Test>('tests.json').filter((t) => t.courseId === courseId);

  const allQuestions: Question[] = tests.flatMap((t) => t.questions);

  const matching = allQuestions.filter(
    (q) => q.topicTag !== undefined && body.topics.includes(q.topicTag)
  );

  const selected = shuffle(matching).slice(0, body.count);

  const newTest: Test = {
    id: 'test-ai-' + Date.now(),
    courseId,
    title: body.title || 'AI Generated Test',
    isAIGenerated: true,
    createdAt: new Date().toISOString(),
    questions: selected,
  };

  return Response.json(newTest);
}
