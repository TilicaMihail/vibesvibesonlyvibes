export type ResourceType = 'chapter' | 'text' | 'file' | 'video' | 'test';

export interface ContentNode {
  id: string;
  courseId: string;
  parentId: string | null;
  type: ResourceType;
  title: string;
  order: number;
  textContent?: string;
  fileUrl?: string;
  fileName?: string;
  videoUrl?: string;
  duration?: number;
  testId?: string;
}

export interface ContentTreeNode extends ContentNode {
  children: ContentTreeNode[];
}
