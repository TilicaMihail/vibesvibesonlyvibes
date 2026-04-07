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

  await params; // courseId not needed — we search all questions globally

  const body = await request.json() as {
    topics: string[];
    count: number;
    title?: string;
  };

  // Search all tests globally so new courses can still get questions
  const allTests = loadData<Test>('tests.json');
  const allQuestions: Question[] = allTests.flatMap((t) => t.questions);

  let pool: Question[];
  if (body.topics && body.topics.length > 0) {
    pool = allQuestions.filter(
      (q) => q.topicTag !== undefined && body.topics.includes(q.topicTag)
    );
    // If no matches by topic tag, fall back to all questions
    if (pool.length === 0) pool = allQuestions;
  } else {
    pool = allQuestions;
  }

  const selected = shuffle(pool).slice(0, body.count);

  // Return questions only — the teacher reviews and saves explicitly
  return Response.json({ questions: selected });
}
