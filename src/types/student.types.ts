// import type { SubjectProgress } from './common.types';

/* ============================================================
   STUDENT TYPES
   ------------------------------------------------------------
   - Types venant de l’API (backend)
   - Types utilisés par l’UI (frontend)
   - Fonctions de mapping API → UI
   ============================================================ */

/* ===========================
   API TYPES (BACKEND)
   =========================== */

/**
 * Matière telle que renvoyée par l’API
 */
export interface ApiSubject {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

/**
 * Note utilisée dans la progression
 */
export interface ApiProgressGrade {
  grade: number;
  date: string | null;
}

/**
 * Note telle que renvoyée par l’API
 */
export interface ApiStudentGrade {
  id: number;
  grade: number;
  coefficient: number;
  examDate: string;
  examName?: string;
  comments?: string;
  subject: ApiSubject;
}

/**
 * Réponse API : GET /api/students/me/grades
 */
export interface ApiStudentGradesResponse {
  grades: ApiStudentGrade[];
  total: number;
}

/* ===========================
   UI TYPES (FRONTEND)
   =========================== */

/**
 * Note utilisée par l’UI
 */
export interface StudentGrade {
  id: number;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  comment?: string;
  teacher?: string;
}

/**
 * Statistiques étudiant (dashboard)
 */
export interface StudentStats {
  totalTeachers: number;
  totalLessons: number;
  totalSubjects: number;
  averageGrade: number | null;
}

/**
 * Profil étudiant
 */
export interface StudentProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  grade?: {
    id: number;
    name: string;
    level: string;
  };
  roles: string[];
  createdAt: string;
}

/* ===========================
   MAPPERS (API → UI)
   =========================== */

/**
 * Convertit une note API en note UI
 */
export const mapApiGradeToStudentGrade = (
  apiGrade: ApiStudentGrade
): StudentGrade => ({
  id: apiGrade.id,
  subject: apiGrade.subject.name,
  grade: apiGrade.grade,
  maxGrade: 20, // convention UI : toujours sur 20
  date: apiGrade.examDate,
  comment: apiGrade.comments,
});

/**
 * Convertit une liste de notes API en notes UI
 */
export const mapApiGradesToStudentGrades = (
  apiGrades: ApiStudentGrade[]
): StudentGrade[] =>
  apiGrades.map(mapApiGradeToStudentGrade);

// UI TYPE (frontend)
export interface StudentSubjectProgress {
  subjectId: number;
  subjectName: string;
  progress: number;
  lessonCount: number;
  completedLessons: number;
  averageGrade: number;
  lastActivity: string;
}

// export const mapApiProgressToUi = (
//   api: SubjectProgress
// ): StudentSubjectProgress => ({
//   subjectId: api.subject.id,
//   subjectName: api.subject.name,
//   progress: api.gradesCount > 0 ? Math.round(api.averageGrade * 5) : 0,
//   lessonCount: api.gradesCount,
//   completedLessons: api.gradesCount,
//   averageGrade: api.averageGrade,
//   lastActivity: api.lastGrade?.createdAt ?? new Date().toISOString(),
// });

/**
 * Progression par matière (API)
 */
export interface ApiStudentSubjectProgress {
  subject: ApiSubject;
  grades: ApiProgressGrade[];
  average: number | null;
  gradeCount: number;
  needHelp: boolean;
  priority: number;
}

/* ============================================================
   STUDENT TYPES
   ============================================================ */

/* ===========================
   API TYPES (BACKEND)
   =========================== */

/**
 * Matière telle que renvoyée par l’API
 */
export interface ApiSubject {
  id: number;
  name: string;
}

/**
 * Note utilisée dans la progression
 */
export interface ApiProgressGrade {
  grade: number;
  date: string | null;
}

/**
 * Progression par matière (API)
 */
export interface ApiStudentSubjectProgress {
  subject: ApiSubject;
  grades: ApiProgressGrade[];
  average: number | null;
  gradeCount: number;
  needHelp: boolean;
  priority: number;
}

/**
 * Réponse API : GET /api/students/me/progress
 */
export interface ApiStudentProgressResponse {
  subjects: ApiStudentSubjectProgress[];
  generalAverage: number | null;
  totalGrades: number;
}

/**
 * Note telle que renvoyée par l’API (grades)
 */
export interface ApiStudentGrade {
  id: number;
  grade: number;
  coefficient: number;
  examDate: string;
  examName?: string;
  comments?: string;
  subject: ApiSubject;
}

/**
 * Réponse API : GET /api/students/me/grades
 */
export interface ApiStudentGradesResponse {
  grades: ApiStudentGrade[];
  total: number;
}

/* ===========================
   UI TYPES (FRONTEND)
   =========================== */

/**
 * Note utilisée par l’UI
 */
export interface StudentGrade {
  id: number;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  comment?: string;
}

/**
 * Progression par matière (UI)
 */
export interface StudentSubjectProgress {
  subjectId: number;
  subjectName: string;
  progress: number; // %
  lessonCount: number;
  completedLessons: number;
  averageGrade: number;
  lastActivity: string;
}

/**
 * Statistiques étudiant (dashboard)
 */
export interface StudentStats {
  totalTeachers: number;
  totalLessons: number;
  totalSubjects: number;
  averageGrade: number | null;
}

/**
 * Profil étudiant
 */
export interface StudentProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  grade?: {
    id: number;
    name: string;
    level: string;
  };
  roles: string[];
  createdAt: string;
}

export interface ApiMessagesResponse {
  messages: Message[];
  total: number;
  unreadCount: number;
}



/**
 * Convertit la progression API en progression UI
 */
export const mapApiProgressToUi = (
  api: ApiStudentSubjectProgress
): StudentSubjectProgress => {
  const lastGradeDate =
    api.grades.length > 0
      ? api.grades[api.grades.length - 1].date
      : null;

  return {
    subjectId: api.subject.id,
    subjectName: api.subject.name,
    averageGrade: api.average ?? 0,
    lessonCount: api.gradeCount,
    completedLessons: api.gradeCount,
    progress: api.average !== null
      ? Math.round((api.average / 20) * 100)
      : 0,
    lastActivity: lastGradeDate ?? new Date().toISOString(),
  };
};
