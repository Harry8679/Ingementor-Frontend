import api from './axios';
import type {
  Teacher,
  Student,
  Subject,
  DashboardStats,
  Availability,
  ApiResponse,
  UpdateProfileData,
  UpdatePasswordData,
  CreateAvailabilityData,
  UpdateAvailabilityData,
  ChangePasswordResponse,
  Lesson,
} from '../types/common.types';

export const teacherAPI = {

  // ===========================
  // PROFIL
  // ===========================
  getProfile: () =>
    api.get<ApiResponse<Teacher>>('/api/teachers/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Teacher>>('/api/teachers/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put<ApiResponse<ChangePasswordResponse>>('/api/teachers/me/password', data),

  // ===========================
  // STATS
  // ===========================
  getStats: () =>
    api.get<DashboardStats>('/api/teachers/me/stats'),

  // ===========================
  // STUDENTS
  // ===========================
  getStudents: () =>
    api.get<ApiResponse<Student[]>>('/api/teachers/me/students'),

  getStudentDetail: (id: number) =>
    api.get<ApiResponse<Student>>(`/api/teachers/students/${id}`),

  requestStudent: (studentId: number, subjectId: number, notes?: string) =>
    api.post(`/api/teachers/students/${studentId}/request`, {
      subjectId,
      notes,
    }),

  removeStudent: (relationId: number) =>
    api.delete(`/api/teachers/students/${relationId}`),

  getAvailableStudents: () =>
    api.get<ApiResponse<Student[]>>('/api/teachers/students/available'),

  // ===========================
  // SUBJECTS
  // ===========================
  getSubjects: () =>
    api.get<ApiResponse<Subject[]>>('/api/teachers/me/subjects'),

  addSubject: (subjectId: number, description?: string) =>
    api.post('/api/teachers/me/subjects', {
      subjectId,
      description,
    }),

  removeSubject: (teacherSubjectId: number) =>
    api.delete(`/api/teachers/me/subjects/${teacherSubjectId}`),

  // ===========================
  // AVAILABILITY
  // ===========================
  getAvailability: () =>
    api.get<ApiResponse<Availability[]>>('/api/teachers/me/availabilities'),

  addAvailability: (data: CreateAvailabilityData) =>
    api.post('/api/teachers/me/availabilities', data),

  updateAvailability: (id: number, data: UpdateAvailabilityData) =>
    api.put(`/api/teachers/me/availabilities/${id}`, data),

  deleteAvailability: (id: number) =>
    api.delete(`/api/teachers/me/availabilities/${id}`),

  getLessons: () =>
    api.get<ApiResponse<Lesson[]>>("/api/teachers/me/lessons"),

  getLessonById: (id: number) =>
    api.get(`/api/teachers/me/lessons/${id}`),

  getMessageById: (messageId: number) =>
    api.get(`/teacher/messages/${messageId}`),

};