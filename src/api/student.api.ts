import api from "../services/api";

import type {
  Student,
  Teacher,
  // StudentGrade,
  // SubjectProgress,
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
  PaginatedResponse,
} from "../types/common.types";
import type { ApiStudentGradesResponse, ApiStudentProgressResponse } from "../types/student.types";

export const studentAPI = {
  // ============================================
  // PROFILE
  // ============================================
  getProfile: () =>
    api.get<Student>("/api/students/me"),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Student>>("/api/students/me", data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put("/api/students/me/password", data),

  // ============================================
  // STATS
  // ============================================
  getStats: () =>
    api.get<DashboardStats>("/api/students/me/stats"),

  // ============================================
  // TEACHERS
  // ============================================
  // ✅ CORRIGÉ : Devrait retourner PaginatedResponse<Teacher>
  getTeachers: () =>
    api.get<PaginatedResponse<Teacher>>("/api/students/me/teachers"),

  getTeacher: (id: number) =>
    api.get<Teacher>(`/api/students/teachers/${id}`),

  // ✅ CORRIGÉ : Devrait retourner PaginatedResponse<Teacher>
  searchTeachers: (params: TeacherSearchParams) =>
    api.get<PaginatedResponse<Teacher>>("/api/students/teachers/search", { params }),

  requestTeacher: (data: RequestTeacherData) =>
    api.post("/api/students/teachers/request", data),

  // ============================================
  // SUBJECTS
  // ============================================
  getSubjects: () =>
    api.get("/api/students/me/subjects"),
  
  addSubject: (data: CreateStudentSubjectData) =>
    api.post("/api/students/me/subjects", data),

  updateSubject: (subjectId: number, data: UpdateStudentSubjectData) =>
    api.put(`/api/students/me/subjects/${subjectId}`, data),

  removeSubject: (subjectId: number) =>
    api.delete(`/api/students/me/subjects/${subjectId}`),

  // ============================================
  // GRADES
  // ============================================
  getGrades: () =>
  api.get<ApiStudentGradesResponse>(
    "/api/students/me/grades"
  ),
  // getGrades: () =>
  //   api.get<{ grades: StudentGrade[]; total: number }>(
  //     "/api/students/me/grades"
  //   ),

  getGradesBySubject: (subjectId: number) =>
    api.get(`/api/students/me/grades/by-subject/${subjectId}`),

  // ============================================
  // PROGRESS
  // ============================================
  getProgress: () =>
    api.get<ApiStudentProgressResponse>("/api/students/me/progress"),

  // ============================================
  // LESSONS
  // ============================================
  // ✅ BON : Déjà avec PaginatedResponse<Lesson>
  getLessons: () =>
    api.get<PaginatedResponse<Lesson>>("/api/students/me/lessons"),

  getLessonById: (id: number) =>
    api.get<Lesson>(`/api/students/me/lessons/${id}`),

  // ============================================
  // MESSAGES
  // ============================================
  // ✅ CORRIGÉ : Devrait retourner PaginatedResponse<Message>
  getMessages: () =>
    api.get<PaginatedResponse<Message>>("/api/students/me/messages"),
    
  // ✅ AJOUTÉ : getMessage individuel
  getMessage: (id: number) =>
    api.get<Message>(`/api/students/me/messages/${id}`),
    
  // ✅ AJOUTÉ : sendMessage
  sendMessage: (data: { recipientId: number; subject: string; content: string }) =>
    api.post<Message>("/api/students/me/messages", data),
    
  // ✅ AJOUTÉ : markAsRead
  markAsRead: (id: number) =>
    api.put(`/api/students/me/messages/${id}/read`),
    
  // ✅ AJOUTÉ : deleteMessage
  deleteMessage: (id: number) =>
    api.delete(`/api/students/me/messages/${id}`),
    
  // ✅ AJOUTÉ : getSentMessages
  getSentMessages: () =>
    api.get<PaginatedResponse<Message>>("/api/students/me/messages/sent"),
};