export type QuestionType = 'single' | 'multiple' | 'true_false';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  type: QuestionType;
  options: AnswerOption[];
  explanation?: string;
  topicTag?: string;
}

export interface Test {
  id: string;
  courseId: string;
  contentNodeId?: string;
  title: string;
  questions: Question[];
  isAIGenerated: boolean;
  createdAt: string;
}

export type TestSessionStatus = 'in_progress' | 'submitted' | 'timed_out';

export interface SessionAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect?: boolean;
  isFlagged?: boolean;
}

export interface TestSession {
  id: string;
  studentId: string;
  courseId: string;
  testId: string;
  startedAt: string;
  submittedAt?: string;
  timeLimitSeconds?: number;
  selectedTopics: string[];
  questionCount: number;
  questions: Question[];
  answers: SessionAnswer[];
  score?: number;
  status: TestSessionStatus;
}

export interface QuestionReport {
  questionId: string;
  testSessionId: string;
  reason: 'wrong_answer' | 'unclear_question' | 'outdated_content' | 'other';
  note?: string;
}
