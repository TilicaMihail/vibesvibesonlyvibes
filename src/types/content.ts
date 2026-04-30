export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  contentMarkdown: string;
  orderIndex: number;
  testId?: string;
  lessonResources: LessonResource[];
  createdAt: string;
  updatedAt: string;
}

export interface ChapterWithLessons extends Chapter {
  lessons: Lesson[];
}
