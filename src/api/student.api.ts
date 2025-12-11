import api from '../services/api';

import type {
  Student,
  Teacher,
  // StudentSubject,
  StudentGrade,
  SubjectProgress,
  Lesson,
  DashboardStats,
  ApiResponse,
  UpdateProfileData,
  UpdatePasswordData,
  TeacherSearchParams,
  CreateStudentSubjectData,
  UpdateStudentSubjectData,
  RequestTeacherData,
  Message,
  // StudentGradesResponse,
} from '../types/common.types';

export const studentAPI = {
  // ==== Profile ====
  // getProfile: () =>
  //   api.get<ApiResponse<Student>>('/api/students/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Student>>('/api/students/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put('/api/students/me/password', data),

  // ==== Stats ====
  // getStats: () =>
  //   api.get<DashboardStats>('/api/students/me/stats'),

  // ==== Teachers ====

  // getTeachers: (status?: string) =>
  //   api.get<ApiResponse<Teacher[]>>('/api/students/me/teachers', {
  //     params: { status },
  //   }),

  getTeacher: (id: number) =>
    api.get<ApiResponse<Teacher>>(`/api/students/teachers/${id}`),

  searchTeachers: (params: TeacherSearchParams) =>
    api.get<ApiResponse<Teacher[]>>('/api/students/teachers/search', {
      params,
    }),

  requestTeacher: (data: RequestTeacherData) =>
    api.post('/api/students/me/teachers/request', data),

  // ==== Subjects ====
  // getSubjects: () =>
  //   api.get<ApiResponse<StudentSubject[]>>('/api/students/me/subjects'),

  addSubject: (data: CreateStudentSubjectData) =>
    api.post('/api/students/me/subjects', data),

  updateSubject: (subjectId: number, data: UpdateStudentSubjectData) =>
    api.put(`/api/students/me/subjects/${subjectId}`, data),

  removeSubject: (subjectId: number) =>
    api.delete(`/api/students/me/subjects/${subjectId}`),

  // ==== Grades ====
  // getGrades: () =>
  //   api.get<StudentGrade[]>('/api/students/me/grades'),
  
  // getGrades: () =>
  // api.get<{ grades: StudentGrade[]; total: number }>(
  //     "/api/students/me/grades"
  // ),

  getGradesBySubject: (subjectId: number) =>
    api.get<StudentGrade[]>(
      `/api/students/me/grades/by-subject/${subjectId}`
    ),

  // ==== Progress ====
  getProgress: () =>
    api.get<ApiResponse<SubjectProgress[]>>('/api/students/me/progress'),

  // ==== Lessons ====
  getLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/students/me/lessons'),

  getLessonById: (id: number) =>
    api.get<ApiResponse<Lesson>>(`/api/students/me/lessons/${id}`),

  getMessages: () =>
    api.get<ApiResponse<Message[]>>('/api/students/me/messages'),

  getStats: () => api.get<DashboardStats>("/students/me/stats"),
  getProfile: () => api.get("/students/me"),
  getSubjects: () => api.get("/students/me/subjects"),
  getTeachers: () => api.get("/students/me/teachers"),
  getGrades: () => api.get("/students/me/grades"),
};
