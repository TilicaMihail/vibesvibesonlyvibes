export type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TRUE_FALSE';
export type TestStatus = 'DRAFT' | 'PUBLISHED';

export interface AnswerOption {
  optionId: number;
  text: string;
  displayOrder: number;
  isCorrect?: boolean;
}

export interface Question {
  questionId: number;
  questionType: QuestionType;
  content: string;
  difficulty?: number;
  options: AnswerOption[];
}

export interface Test {
  id: string;
  lessonId: string;
  createdBy: string;
  title: string;
  description?: string;
  timeLimitSec?: number;
  status: TestStatus;
  aiEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attempt {
  attemptId: string;
  attemptNumber: number;
  startedAt: string;
  timeLimitSec?: number;
  test: { id: string; title: string };
  questions: Question[];
}

export interface AttemptAnswer {
  questionId: number;
  selectedOptionIds: number[];
  timeSpent?: number;
}

export interface AttemptResultQuestion {
  questionId: number;
  questionType: QuestionType;
  content: string;
  options: AnswerOption[];
  selectedOptionIds: number[];
  correctOptionIds: number[];
  correct: boolean;
}

export interface AttemptResult {
  attemptId: string;
  score: number;
  scorePercent: number;
  passed: boolean;
  completedAt: string;
  questions: AttemptResultQuestion[];
}
