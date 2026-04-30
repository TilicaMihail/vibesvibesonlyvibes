import type { ChapterWithLessons } from './content';

export type CourseStatus = 'DRAFT' | 'PUBLISHED';
export type CourseVisibility = 'PRIVATE' | 'PUBLIC';

export interface Course {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: CourseStatus;
  visibility: CourseVisibility;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  chapters?: ChapterWithLessons[];
}

export interface CourseCreatePayload {
  title: string;
  description: string;
  visibility: CourseVisibility;
  category?: string;
}

export interface CourseUpdatePayload {
  title?: string;
  description?: string;
  visibility?: CourseVisibility;
  category?: string;
  status?: CourseStatus;
}
