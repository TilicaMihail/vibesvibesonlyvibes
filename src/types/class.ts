export interface Class {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  teacherIds: string[];
  studentIds: string[];
  isArchived: boolean;
  createdAt: string;
}

export interface ClassCreatePayload {
  organizationId: string;
  name: string;
  description?: string;
  teacherIds?: string[];
}

export interface ClassUpdatePayload {
  name?: string;
  description?: string;
  teacherIds?: string[];
}
