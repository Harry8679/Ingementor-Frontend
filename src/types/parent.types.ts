import type { Student, Subject } from "./common.types";

// ========================
// PARENT STATS
// ========================
export interface ParentStats {
  totalChildren: number;
  totalLessons: number;
  totalTeachers: number;
}

// ========================
// CHILDREN LIST
// ========================
export interface ParentChildRelation {
  id: number; // StudentParent ID
  relationship: string;
  student: Student;
}

// ========================
// CHILD SUBJECTS
// ========================
export interface ParentChildSubject {
  id: number;
  needHelp: boolean;
  priority: string;
  notes?: string;

  subject: Subject;
}

// ========================
// CHILD TEACHERS
// ========================
export interface ParentChildTeacher {
  id: number;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
    bio?: string;
    experience?: string;
    rating?: number;
    isVerified?: boolean;
  };
  subject: {
    id: number;
    name: string;
  };
  status: string;
  startDate?: string;
  notes?: string;
}

// ========================
// CHILD LESSONS
// ========================
export interface ParentChildLessonInfo {
  id: number;
  teacher: {
    id: number;
    fullName: string;
  };
  student?: {
    id: number;
    fullName: string;
  };
  subject: {
    id: number;
    name: string;
  };
  scheduledAt?: string;
  duration?: number;
  status?: string;
  price?: number;
  notes?: string;
}

// ========================
// CHILD PROGRESS DETAILS
// ========================
export interface ParentChildProgress {
  studentName: string;

  subjects: {
    subject: Subject;
    grades: {
      grade: number;
      date: string | null;
      examName?: string | null;
    }[];
    average: number | null;
    gradeCount: number;
    needHelp: boolean;
    priority: string;
  }[];

  generalAverage: number | null;

  totalGrades: number;
  totalLessons: number;
  totalTeachers: number;
}

// ========================
// ALL CHILDREN PROGRESS
// ========================
export interface AllChildrenProgressItem {
  id: number;
  student: {
    id: number;
    fullName: string;
    gradeName?: string;
  };
  generalAverage: number | null;
  totalGrades: number;
  totalSubjects: number;
  totalTeachers: number;
  totalLessons: number;
}

// ========================
// TEACHER DETAIL (parent view)
// ========================
export interface ParentTeacherTeachingTo {
  studentId: number;
  studentName: string;
  subject: string;
  startDate?: string;
}

export interface ParentTeacherDetail {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  experience?: string;
  rating?: number;
  isVerified?: boolean;

  subjects: {
    id: number;
    name: string;
    description?: string;
  }[];

  teachingTo: ParentTeacherTeachingTo[];
}