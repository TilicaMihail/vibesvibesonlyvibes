import { loadData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { TestSession, Test, SessionAnswer } from '@/types';

function getAuth(req: Request) {
  const header = req.headers.get('Authorization') || '';
  const token = header.replace('Bearer ', '');
  return decodeToken(token);
}

export async function POST(
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

  const body = await request.json() as {
    answers: { questionId: string; selectedOptionIds: string[] }[];
  };

  const tests = loadData<Test>('tests.json');
  const test = tests.find((t) => t.id === session.testId);

  const questions = test ? test.questions : session.questions;

  let correctCount = 0;

  const scoredAnswers: SessionAnswer[] = body.answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);

    if (!question) {
      return { ...answer, isCorrect: false };
    }

    let isCorrect = false;

    if (question.type === 'single' || question.type === 'true_false') {
      const correctOption = question.options.find((o) => o.isCorrect);
      isCorrect =
        answer.selectedOptionIds.length === 1 &&
        correctOption !== undefined &&
        answer.selectedOptionIds[0] === correctOption.id;
    } else if (question.type === 'multiple') {
      const correctIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id)
        .sort();
      const selectedSorted = [...answer.selectedOptionIds].sort();
      isCorrect =
        correctIds.length === selectedSorted.length &&
        correctIds.every((id, i) => id === selectedSorted[i]);
    }

    if (isCorrect) correctCount++;

    return { ...answer, isCorrect };
  });

  const total = body.answers.length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const updated: TestSession = {
    ...session,
    answers: scoredAnswers,
    score,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  return Response.json(updated);
}
