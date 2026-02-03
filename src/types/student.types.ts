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
// export interface StudentGrade {
//   id: number;
//   subject: string;
//   grade: number;
//   maxGrade: number;
//   date: string;
//   comment?: string;
// }

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

  export interface StudentGrade {
  id: number;
  subject: string;
  grade: number;
  maxGrade: number;
  date: string;
  comment?: string;
  teacher?: string;
}