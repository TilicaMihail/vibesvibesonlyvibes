import { loadData, saveData } from '@/lib/dataLoader';
import { decodeToken } from '@/lib/jwt';
import type { Test, TestSession, Question } from '@/types';

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

export async function POST(request: Request) {
  const auth = getAuth(request);
  if (!auth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as {
    studentId: string;
    courseId: string;
    testId?: string;
    selectedTopics: string[];
    questionCount: number;
    timeLimitSeconds?: number;
  };

  let selectedQuestions: Question[] = [];

  if (body.testId) {
    const tests = loadData<Test>('tests.json');
    const test = tests.find((t) => t.id === body.testId);

    if (test) {
      let questions = test.questions;

      if (body.selectedTopics && body.selectedTopics.length > 0) {
        questions = questions.filter(
          (q) => q.topicTag !== undefined && body.selectedTopics.includes(q.topicTag)
        );
      }

      selectedQuestions = shuffle(questions).slice(0, body.questionCount);
    }
  }

  const session: TestSession = {
    id: 'ts-' + Date.now(),
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    answers: [],
    score: undefined,
    studentId: body.studentId,
    courseId: body.courseId,
    testId: body.testId || '',
    selectedTopics: body.selectedTopics,
    questionCount: body.questionCount,
    timeLimitSeconds: body.timeLimitSeconds,
    questions: selectedQuestions,
  };

  const sessions = loadData<TestSession>('test-sessions.json');
  saveData('test-sessions.json', [...sessions, session]);

  return Response.json(session, { status: 201 });
}
