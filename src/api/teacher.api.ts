import api from '../services/api';

import type {
  Teacher,
  Student,
  Subject,
  Lesson,
  DashboardStats,
  Availability,
  ApiResponse,
  UpdateProfileData,
  UpdatePasswordData,
  CreateAvailabilityData,
  UpdateAvailabilityData,
} from '../types/common.types';

export const teacherAPI = {
  // ===== PROFILE =====
  getProfile: () =>
    api.get<ApiResponse<Teacher>>('/api/teachers/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Teacher>>('/api/teachers/me', data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put('/api/teachers/me/password', data),

  // ===== STATS =====
  getStats: () =>
    api.get<DashboardStats>('/api/teachers/me/stats'),

  // ===== STUDENTS =====
  getStudents: (status?: string) =>
    api.get<ApiResponse<Student[]>>('/api/teachers/me/students', {
      params: { status },
    }),

  getStudent: (id: number) =>
    api.get<ApiResponse<Student>>(`/api/teachers/students/${id}`),

  acceptStudent: (relationId: number) =>
    api.put(`/api/teachers/students/${relationId}/accept`),

  rejectStudent: (relationId: number) =>
    api.put(`/api/teachers/students/${relationId}/reject`),

  // ===== SUBJECTS =====
  getSubjects: () =>
    api.get<ApiResponse<Subject[]>>('/api/teachers/me/subjects'),

  addSubject: (subjectId: number) =>
    api.post('/api/teachers/me/subjects', { subjectId }),

  removeSubject: (subjectId: number) =>
    api.delete(`/api/teachers/me/subjects/${subjectId}`),

  // ===== AVAILABILITY =====
  getAvailability: () =>
    api.get<ApiResponse<Availability[]>>('/api/teachers/me/availability'),

  createAvailability: (data: CreateAvailabilityData) =>
    api.post('/api/teachers/me/availability', data),

  updateAvailability: (id: number, data: UpdateAvailabilityData) =>
    api.put(`/api/teachers/me/availability/${id}`, data),

  deleteAvailability: (id: number) =>
    api.delete(`/api/teachers/me/availability/${id}`),

  // ===== LESSONS =====
  getLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/teachers/me/lessons'),

  getUpcomingLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/teachers/me/lessons/upcoming'),
};