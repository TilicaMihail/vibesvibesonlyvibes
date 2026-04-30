import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Question } from '@/types';

type TestRunnerStatus = 'idle' | 'running' | 'submitting' | 'done';

interface TestRunnerState {
  attemptId: string | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number[]>;
  flagged: number[];
  timeRemainingSeconds: number;
  status: TestRunnerStatus;
}

const initialState: TestRunnerState = {
  attemptId: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  flagged: [],
  timeRemainingSeconds: 0,
  status: 'idle',
};

const testRunnerSlice = createSlice({
  name: 'testRunner',
  initialState,
  reducers: {
    startSession(
      state,
      action: PayloadAction<{ attemptId: string; questions: Question[]; timeLimitSec?: number }>
    ) {
      const { attemptId, questions, timeLimitSec } = action.payload;
      state.attemptId = attemptId;
      state.questions = questions;
      state.currentIndex = 0;
      state.answers = {};
      state.flagged = [];
      state.timeRemainingSeconds = timeLimitSec ?? 0;
      state.status = 'running';
    },
    answerQuestion(
      state,
      action: PayloadAction<{ questionId: number; optionIds: number[] }>
    ) {
      const { questionId, optionIds } = action.payload;
      state.answers[questionId] = optionIds;
    },
    toggleFlag(state, action: PayloadAction<number>) {
      const questionId = action.payload;
      const index = state.flagged.indexOf(questionId);
      if (index === -1) {
        state.flagged.push(questionId);
      } else {
        state.flagged.splice(index, 1);
      }
    },
    navigateTo(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
    tick(state) {
      if (state.timeRemainingSeconds > 0) {
        state.timeRemainingSeconds -= 1;
        if (state.timeRemainingSeconds === 0) {
          state.status = 'done';
        }
      }
    },
    setSubmitting(state) {
      state.status = 'submitting';
    },
    setDone(state) {
      state.status = 'done';
    },
    resetSession() {
      return initialState;
    },
  },
});

export const {
  startSession,
  answerQuestion,
  toggleFlag,
  navigateTo,
  tick,
  setSubmitting,
  setDone,
  resetSession,
} = testRunnerSlice.actions;
export default testRunnerSlice.reducer;
