export interface Parent {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  students?: Student[];
}

export interface Student {
  id: number;
  name: string;
  dateOfBirth?: string | null;
  parentId: number;
  parent?: Parent;
}

export interface Class {
  id: number;
  name: string;
  description?: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  classRegistrations?: { id: number; studentId: number; student?: Student }[];
}

export interface Subscription {
  id: number;
  studentId: number;
  totalSessions: number;
  remainingSessions: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  student?: Student;
}

export interface Registration {
  id: number;
  studentId: number;
  classId: number;
  subscriptionId: number;
  classDate: string;
  status: 'REGISTERED' | 'CANCELLED';
  isSessionRefunded?: boolean;
  student?: Student;
  class?: Class;
  subscription?: Subscription;
}
