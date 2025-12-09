// ==================== USER TYPES ====================
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher extends User {
  bio?: string;
  experience?: string;
  hourlyRate?: number;
  subjects?: Subject[];
  availability?: Availability[];
}

export interface Student extends User {
  gradeId: number;
  grade?: Grade;
  subjects?: StudentSubject[];
  teachers?: Teacher[];
}

export interface Parent extends User {
  address?: string;
  children?: Student[];
}

// ==================== CORE ENTITIES ====================
export interface Subject {
  id: number;
  name: string;
  description?: string;
}

export interface Grade {
  id: number;
  name: string;
  level?: number;
}

export interface Availability {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacher?: Teacher;
}

// ==================== LESSON TYPES ====================
export interface Lesson {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  teacher?: Teacher;
  student?: Student;
  subject?: Subject;
  notes?: string;
  createdAt?: string;
}

export interface CreateLessonData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  teacherId?: number;
  studentId?: number;
  subjectId: number;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

// ==================== MESSAGE TYPES ====================
export interface Message {
  id: number;
  subject: string;
  content: string;
  isRead: boolean;
  sender?: User;
  recipient?: User;
  createdAt: string;
}

export interface SendMessageData {
  recipientId: number;
  subject: string;
  content: string;
}

// ==================== GRADE TYPES ====================
export interface StudentGrade {
  id: number;
  value: number;
  coefficient: number;
  date: string;
  subject: Subject;
  student?: Student;
  notes?: string;
}

export interface CreateGradeData {
  value: number;
  coefficient: number;
  date: string;
  subjectId: number;
  notes?: string;
}

export interface UpdateGradeData {
  value?: number;
  coefficient?: number;
  date?: string;
  notes?: string;
}

// ==================== SUBJECT RELATION TYPES ====================
export interface StudentSubject {
  id: number;
  student: Student;
  subject: Subject;
  needHelp: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
}

export interface CreateStudentSubjectData {
  subjectId: number;
  needHelp: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
}

export interface UpdateStudentSubjectData {
  needHelp?: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
}

// ==================== TEACHER-STUDENT RELATION ====================
export interface TeacherStudentRelation {
  id: number;
  teacher: Teacher;
  student: Student;
  subject: Subject;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  message?: string;
  createdAt: string;
}

export interface RequestTeacherData {
  teacherId: number;
  subjectId: number;
  message?: string;
}

// ==================== PARENT-STUDENT RELATION ====================
export interface ParentStudentRelation {
  id: number;
  parent: Parent;
  student: Student;
  relationship: string;
}

export interface AddChildData {
  studentId: number;
  relationship: string;
}

// ==================== AVAILABILITY TYPES ====================
export interface CreateAvailabilityData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityData {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

// ==================== PROFILE UPDATE TYPES ====================
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  experience?: string;
  hourlyRate?: number;
  address?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  studentsCount?: number;
  teachersCount?: number;
  lessonsCount?: number;
  subjectsCount?: number;
  gradesCount?: number;
  unreadMessages?: number;
  averageGrade?: number;
  childrenCount: number;
  upcomingLessons?: Lesson[];
  recentGrades?: StudentGrade[];
}

// ==================== PROGRESS TYPES ====================
export interface SubjectProgress {
  subject: Subject;
  averageGrade: number;
  gradesCount: number;
  lastGrade?: StudentGrade;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface StudentProgress {
  student: Student;
  subjects: SubjectProgress[];
  overallAverage: number;
}

// ==================== SEARCH TYPES ====================
export interface TeacherSearchParams {
  subjectId?: number;
  minRate?: number;
  maxRate?: number;
  experience?: string;
  availability?: string;
  search?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}

// ==================== AUTH TYPES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterTeacherRequest {
  userType: 'teacher';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  experience?: string;
}

export interface RegisterStudentRequest {
  userType: 'student';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gradeId: number;
}

export interface RegisterParentRequest {
  userType: 'parent';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export type RegisterRequest = RegisterTeacherRequest | RegisterStudentRequest | RegisterParentRequest;

export interface AuthResponse {
  token: string;
  user: User | Teacher | Student | Parent;
}

export interface ChildProgress {
  subjects: {
    subject: string;
    progress: number; // % ou autre
  }[];
  overall: number; // progression globale
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}