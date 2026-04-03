export type CourseVisibility = 'private' | 'class' | 'public';

export interface Course {
  id: string;
  organizationId: string;
  teacherId: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  visibility: CourseVisibility;
  classIds: string[];
  enrolledStudentIds: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreatePayload {
  organizationId: string;
  teacherId: string;
  title: string;
  description: string;
  visibility: CourseVisibility;
}

export interface CourseUpdatePayload {
  title?: string;
  description?: string;
  visibility?: CourseVisibility;
  classIds?: string[];
}
