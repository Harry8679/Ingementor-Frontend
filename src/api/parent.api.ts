import api from '../services/api';
// import api from './api';

import type { Parent, Student, Lesson, DashboardStats, ApiResponse, UpdateProfileData, ChildProgress, Subject } from '../types/common.types';

export const parentAPI = {
  // Profil
  getProfile: () =>
    api.get<ApiResponse<Parent>>('/api/parents/me'),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Parent>>('/api/parents/me', data),

  // Stats
  getStats: () =>
    api.get<DashboardStats>('/api/parents/me/stats'),

  // Enfants
  getChildren: () =>
    api.get<ApiResponse<Student[]>>('/api/parents/me/children'),

  getChild: (id: number) =>
    api.get<ApiResponse<Student>>(`/api/parents/children/${id}`),

  // Leçons
  getAllLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/parents/me/lessons/all'),

  getUpcomingLessons: () =>
    api.get<ApiResponse<Lesson[]>>('/api/parents/me/lessons/upcoming'),

  getChildLessons: (childId: number) =>
    api.get(`/api/parents/children/${childId}/lessons`),

  getChildProgress: (childId: number) =>
    api.get<ApiResponse<ChildProgress>>(`/api/parents/children/${childId}/progress`),

  getChildSubjects: (childId: number) =>
    api.get<ApiResponse<Subject[]>>(`/api/parents/children/${childId}/subjects`),
};
