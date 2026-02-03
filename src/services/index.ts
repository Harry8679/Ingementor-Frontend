import api from './api';

// AUTH TYPES
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/auth.types';

// COMMON TYPES
import type {
  Grade,
  Subject,
  Lesson,
  Message,
  StudentGrade,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  UpdateProfileData,
  UpdatePasswordData,
  CreateLessonData,
  UpdateLessonData,
  CreateAvailabilityData,
  UpdateAvailabilityData,
  CreateStudentSubjectData,
  UpdateStudentSubjectData,
  AddChildData,
  RequestTeacherData,
  Student,
  User,
  Teacher,
  Parent,
} from '../types/common.types';
import type { ApiStudentGradesResponse } from '../types/student.types';

// ==================== AUTH API ====================
export const authAPI = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/login_check', data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/api/register', data),

  me: () =>
    api.get<ApiResponse<User | Teacher | Student | Parent>>('/api/users/me'),
};

// ==================== GRADES API ====================
export const gradesAPI = {
  getAll: () =>
    api.get<PaginatedResponse<Grade>>('/api/grades'),
};

// ==================== SUBJECTS API ====================
export const subjectsAPI = {
  getAll: () =>
    api.get<PaginatedResponse<Subject>>('/api/subjects'),

  create: (data: { name: string; description?: string }) =>
    api.post<Subject>('/api/subjects', data),

  update: (id: number, data: Partial<Subject>) =>
    api.put<Subject>(`/api/subjects/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/subjects/${id}`),
};

// ==================== TEACHER API ====================
export const teacherAPI = {
  getProfile: () =>
    api.get<ApiResponse<Teacher>>('/api/teachers/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put('/api/teachers/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put('/api/teachers/me/password', data),

  getStats: () =>
    api.get<DashboardStats>('/api/teachers/me/stats'),

  getStudents: (status?: string) =>
    api.get('/api/teachers/me/students', { params: { status } }),

  getStudent: (id: number) =>
    api.get(`/api/teachers/students/${id}`),

  acceptStudent: (relationId: number) =>
    api.put(`/api/teachers/students/${relationId}/accept`),

  rejectStudent: (relationId: number) =>
    api.put(`/api/teachers/students/${relationId}/reject`),

  getSubjects: () =>
    api.get('/api/teachers/me/subjects'),

  addSubject: (subjectId: number) =>
    api.post('/api/teachers/me/subjects', { subjectId }),

  removeSubject: (subjectId: number) =>
    api.delete(`/api/teachers/me/subjects/${subjectId}`),

  getAvailability: () =>
    api.get('/api/teachers/me/availability'),

  createAvailability: (data: CreateAvailabilityData) =>
    api.post('/api/teachers/me/availability', data),

  updateAvailability: (id: number, data: UpdateAvailabilityData) =>
    api.put(`/api/teachers/me/availability/${id}`, data),

  deleteAvailability: (id: number) =>
    api.delete(`/api/teachers/me/availability/${id}`),
};

// ==================== STUDENT API ====================
export const studentAPI = {
  getProfile: () =>
    api.get('/api/students/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put('/api/students/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put('/api/students/me/password', data),

  changeGrade: (gradeId: number) =>
    api.put('/api/students/me/grade', { gradeId }),

  getStats: () =>
    api.get<DashboardStats>('/api/students/me/stats'),

  getTeachers: (status?: string) =>
    api.get('/api/students/me/teachers', { params: { status } }),

  getTeacher: (id: number) =>
    api.get(`/api/students/teachers/${id}`),

  searchTeachers: (params: RequestTeacherData) =>
    api.get('/api/students/teachers/search', { params }),

  requestTeacher: (data: RequestTeacherData) =>
    api.post('/api/students/me/teachers/request', data),

  getSubjects: () =>
    api.get('/api/students/me/subjects'),

  addSubject: (data: CreateStudentSubjectData) =>
    api.post('/api/students/me/subjects', data),

  updateSubject: (subjectId: number, data: UpdateStudentSubjectData) =>
    api.put(`/api/students/me/subjects/${subjectId}`, data),

  removeSubject: (subjectId: number) =>
    api.delete(`/api/students/me/subjects/${subjectId}`),

  getGrades: () =>
    api.get<ApiStudentGradesResponse[]>('/api/students/me/grades'),

  getGradesBySubject: (subjectId: number) =>
    api.get(`/api/students/me/grades/by-subject/${subjectId}`),

  getProgress: () =>
    api.get('/api/students/me/progress'),

  addGrade: (data: StudentGrade) =>
    api.post('/api/students/me/grades', data),

  updateGrade: (id: number, data: Partial<StudentGrade>) =>
    api.put(`/api/students/me/grades/${id}`, data),

  deleteGrade: (id: number) =>
    api.delete(`/api/students/me/grades/${id}`),
};

// ==================== PARENT API ====================
export const parentAPI = {
  getProfile: () =>
    api.get('/api/parents/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put('/api/parents/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put('/api/parents/me/password', data),

  getStats: () =>
    api.get<DashboardStats>('/api/parents/me/stats'),

  getChildren: () =>
    api.get<ApiResponse<Student[]>>('/api/parents/me/children'),

  getChild: (id: number) =>
    api.get(`/api/parents/children/${id}`),

  addChild: (data: AddChildData) =>
    api.post('/api/parents/me/children', data),

  removeChild: (childId: number) =>
    api.delete(`/api/parents/children/${childId}`),

  getChildLessons: (childId: number) =>
    api.get(`/api/parents/children/${childId}/lessons`),

  getAllLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/parents/me/lessons/all'),

  getAllUpcomingLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/parents/me/lessons/upcoming'),
};

// ==================== LESSONS API ====================
export const lessonsAPI = {
  getMyLessons: (status?: string) =>
    api.get<Lesson[]>('/api/lessons/me', { params: { status } }),

  getUpcomingLessons: () =>
    api.get<Lesson[]>('/api/lessons/me/upcoming'),

  getLesson: (id: number) =>
    api.get<Lesson>(`/api/lessons/${id}`),

  createLesson: (data: CreateLessonData) =>
    api.post<Lesson>('/api/lessons', data),

  updateLesson: (id: number, data: UpdateLessonData) =>
    api.put<Lesson>(`/api/lessons/${id}`, data),

  cancelLesson: (id: number) =>
    api.delete(`/api/lessons/${id}`),
};

// ==================== MESSAGES API ====================
export const messagesAPI = {
  getMessages: () =>
    api.get<Message[]>('/api/messages'),

  getSentMessages: () =>
    api.get<Message[]>('/api/messages/sent'),

  getMessage: (id: number) =>
    api.get<Message>(`/api/messages/${id}`),

  sendMessage: (data: { recipientId: number; subject: string; content: string }) =>
    api.post<Message>('/api/messages', data),

  markAsRead: (id: number) =>
    api.put(`/api/messages/${id}/read`),

  deleteMessage: (id: number) =>
    api.delete(`/api/messages/${id}`),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getDashboard: () =>
    api.get<DashboardStats>('/api/dashboard'),
};

export type { Grade, Subject, Lesson, Message, StudentGrade };
