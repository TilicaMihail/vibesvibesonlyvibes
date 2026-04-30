export interface Classroom {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassroomMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipType: 'TEACHER' | 'STUDENT';
}

export interface ClassroomCreatePayload {
  name: string;
  description?: string;
}

export interface ClassroomUpdatePayload {
  name?: string;
  description?: string;
}

// Aliases for backward compat during migration
export type Class = Classroom;
export type ClassCreatePayload = ClassroomCreatePayload & { organizationId?: string };
export type ClassUpdatePayload = ClassroomUpdatePayload;
