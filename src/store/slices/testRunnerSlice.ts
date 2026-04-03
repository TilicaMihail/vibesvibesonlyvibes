import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Question } from '@/types';

type TestRunnerStatus = 'idle' | 'running' | 'submitting' | 'done';

interface TestRunnerState {
  sessionId: string | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string[]>;
  flagged: string[];
  timeRemainingSeconds: number;
  status: TestRunnerStatus;
}

const initialState: TestRunnerState = {
  sessionId: null,
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
      action: PayloadAction<{ sessionId: string; questions: Question[]; timeLimitSeconds?: number }>
    ) {
      const { sessionId, questions, timeLimitSeconds } = action.payload;
      state.sessionId = sessionId;
      state.questions = questions;
      state.currentIndex = 0;
      state.answers = {};
      state.flagged = [];
      state.timeRemainingSeconds = timeLimitSeconds ?? 0;
      state.status = 'running';
    },
    answerQuestion(
      state,
      action: PayloadAction<{ questionId: string; optionIds: string[] }>
    ) {
      const { questionId, optionIds } = action.payload;
      state.answers[questionId] = optionIds;
    },
    toggleFlag(state, action: PayloadAction<string>) {
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
