import api from "./axios";

import type {
  Parent,
  Student,
  StudentGrade,
  ApiResponse,
  UpdateProfileData,
  UpdatePasswordData,
  CreateStudentSubjectData,
  Teacher,
} from "../types/common.types";

import type {
  ParentChildRelation,
  ParentStats,
  ParentChildSubject,
  ParentChildTeacher,
  ParentChildLessonInfo,
  ParentChildProgress,
  AllChildrenProgressItem,
  ParentTeacherDetail,
} from "../types/parent.types";

export const parentAPI = {
  // ==========================
  // PROFILE
  // ==========================
  getProfile: () =>
    api.get<ApiResponse<Parent>>("/api/parents/me"),

  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<Parent>>("/api/parents/me", data),

  updatePassword: (data: UpdatePasswordData) =>
    api.put<ApiResponse<{ success: boolean; message: string }>>(
      "/api/parents/me/password",
      data
    ),

  getStats: () =>
    api.get<ApiResponse<ParentStats>>("/api/parents/me/stats"),

  // ==========================
  // CHILDREN
  // ==========================
  getChildren: () =>
    api.get<
      ApiResponse<{
        children: ParentChildRelation[];
        total: number;
      }>
    >("/api/parents/me/children"),

  addChild: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gradeId: number;
    relationship?: string;
  }) => api.post("/api/parents/me/children", data),

  updateChild: (id: number, data: Partial<Student>) =>
    api.put(`/api/parents/me/children/${id}`, data),

  removeChild: (id: number) =>
    api.delete(`/api/parents/me/children/${id}`),

  getChildDetails: (id: number) =>
    api.get<
      ApiResponse<{
        id: number;
        relationship: string;
        student: Student;
        subjects: ParentChildSubject[];
        teachers: ParentChildTeacher[];
        stats: {
          totalLessons: number;
          averageGrade: number | null;
          totalSubjects: number;
          totalTeachers: number;
        };
      }>
    >(`/api/parents/me/children/${id}/details`),

  // ==========================
  // CHILD SUBJECTS
  // ==========================
  getChildSubjects: (childId: number) =>
    api.get<
      ApiResponse<{
        studentName: string;
        subjects: ParentChildSubject[];
        total: number;
      }>
    >(`/api/parents/children/${childId}/subjects`),

  addSubjectToChild: (childId: number, data: CreateStudentSubjectData) =>
    api.post(`/api/parents/children/${childId}/subjects`, data),

  updateChildSubject: (
    childId: number,
    subjectRelationId: number,
    data: Partial<CreateStudentSubjectData>
  ) =>
    api.put(
      `/api/parents/children/${childId}/subjects/${subjectRelationId}`,
      data
    ),

  removeChildSubject: (childId: number, subjectRelationId: number) =>
    api.delete(
      `/api/parents/children/${childId}/subjects/${subjectRelationId}`
    ),

  // ==========================
  // CHILD LESSONS
  // ==========================
  getChildLessons: (childRelationId: number) =>
    api.get<
      ApiResponse<{
        studentName: string;
        lessons: ParentChildLessonInfo[];
        total: number;
      }>
    >(`/api/parents/children/${childRelationId}/lessons`),

  getChildUpcomingLessons: (childRelationId: number) =>
    api.get<
      ApiResponse<{
        studentName: string;
        lessons: ParentChildLessonInfo[];
        total: number;
      }>
    >(`/api/parents/children/${childRelationId}/lessons/upcoming`),

  getAllLessons: () =>
    api.get<
      ApiResponse<{
        lessons: ParentChildLessonInfo[];
        total: number;
      }>
    >("/api/parents/me/lessons/all"),

  getAllUpcomingLessons: () =>
    api.get<
      ApiResponse<{
        lessons: ParentChildLessonInfo[];
        total: number;
      }>
    >("/api/parents/me/lessons/upcoming"),

  // ==========================
  // CHILD GRADES
  // ==========================
  getChildGrades: (childRelationId: number) =>
    api.get<
      ApiResponse<{
        studentName: string;
        grades: StudentGrade[];
        generalAverage: number | null;
        total: number;
      }>
    >(`/api/parents/children/${childRelationId}/grades`),

  getChildProgress: (childRelationId: number) =>
    api.get<ApiResponse<ParentChildProgress>>(
      `/api/parents/children/${childRelationId}/progress`
    ),

  getAllChildrenProgress: () =>
    api.get<
      ApiResponse<{
        children: AllChildrenProgressItem[];
        total: number;
      }>
    >("/api/parents/me/children/progress/all"),

  // ==========================
  // TEACHERS
  // ==========================
  getChildTeachers: (childRelationId: number) =>
    api.get<
      ApiResponse<{
        studentName: string;
        teachers: ParentChildTeacher[];
        total: number;
      }>
    >(`/api/parents/children/${childRelationId}/teachers`),

  getAllTeachers: () =>
    api.get<
      ApiResponse<{
        teachers: Teacher[];
        total: number;
      }>
    >("/api/parents/me/teachers/all"),

  getTeacherDetail: (teacherId: number) =>
    api.get<ApiResponse<ParentTeacherDetail>>(
      `/api/parents/teachers/${teacherId}`
    ),
};