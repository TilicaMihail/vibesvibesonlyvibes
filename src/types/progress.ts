export interface ResourceProgress {
  contentNodeId: string;
  completed: boolean;
  completedAt?: string;
  timeSpentSeconds: number;
}

export interface CourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  resourceProgress: ResourceProgress[];
  completionPercent: number;
  lastAccessedAt: string;
  testSessionIds: string[];
}

export type ActivityType =
  | 'resource_viewed'
  | 'test_submitted'
  | 'course_enrolled';

export interface ActivityEntry {
  id: string;
  studentId: string;
  type: ActivityType;
  courseId?: string;
  resourceId?: string;
  testSessionId?: string;
  timestamp: string;
  meta?: Record<string, string | number>;
}

export interface ProgressSummary {
  activeCourses: number;
  completedCourses: number;
  totalTestsTaken: number;
  averageScore: number;
  totalTimeSpentSeconds: number;
}
