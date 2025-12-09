import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:8002/api';

const api = axios.create({
baseURL: API_BASE_URL,
headers: {
    'Content-Type': 'application/json',
},
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
(config) => {
    const token = useAuthStore.getState().token;
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
(response) => response,
(error) => {
    if (error.response?.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/connexion';
    }
    return Promise.reject(error);
}
);

// ============================================================================
// TYPES
// ============================================================================

// User Types
export interface BaseUser {
id: number;
email: string;
firstName: string;
lastName: string;
fullName: string;
phone: string | null;
roles: string[];
isActive: boolean;
emailVerified: boolean;
createdAt: string;
updatedAt: string;
}

export interface Teacher extends BaseUser {
userType: 'teacher';
bio: string | null;
experience: string | null;
rating: string | null;
isVerified: boolean;
availabilities?: Record<string, string[]>;
}

export interface Student extends BaseUser {
userType: 'student';
grade: {
    id: number;
    name: string;
    level: 'PRIMARY' | 'MIDDLE' | 'HIGH';
} | null;
}

export interface ParentUser extends BaseUser {
userType: 'parent';
address: string | null;
}

export interface Admin extends BaseUser {
userType: 'admin';
}

export interface SuperAdmin extends BaseUser {
userType: 'super_admin';
}

export type User = Teacher | Student | ParentUser | Admin | SuperAdmin;

// Grade
export interface Grade {
id: number;
name: string;
level: 'PRIMARY' | 'MIDDLE' | 'HIGH';
order: number;
description: string | null;
}

// Subject
export interface Subject {
id: number;
name: string;
description: string | null;
icon: string | null;
}

// TeacherGradePrice
export interface TeacherGradePrice {
id: number;
teacher: {
    id: number;
    fullName: string;
};
grade: Grade;
subject: Subject;
hourlyRate: string;
}

// Lesson
export interface Lesson {
id: number;
teacher: {
    id: number;
    fullName: string;
};
student: {
    id: number;
    fullName: string;
};
subject: Subject;
scheduledAt: string;
duration: number;
price: string;
status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
location: 'ONLINE' | 'HOME' | 'OFFICE';
notes: string | null;
createdAt: string;
}

// Review
export interface Review {
id: number;
teacher: {
    id: number;
    fullName: string;
};
student: {
    id: number;
    fullName: string;
};
rating: number;
comment: string | null;
createdAt: string;
}

// Payment
export interface Payment {
id: number;
lesson: {
    id: number;
};
amount: string;
status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
paymentMethod: 'CARD' | 'CASH' | 'TRANSFER';
transactionId: string | null;
paidAt: string | null;
createdAt: string;
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface RegisterTeacherData {
userType: 'teacher';
email: string;
password: string;
firstName: string;
lastName: string;
phone?: string;
bio?: string;
experience?: string;
}

export interface RegisterStudentData {
userType: 'student';
email: string;
password: string;
firstName: string;
lastName: string;
phone?: string;
gradeId: number;
}

export interface RegisterParentData {
userType: 'parent';
email: string;
password: string;
firstName: string;
lastName: string;
phone?: string;
address?: string;
}

export type RegisterData = RegisterTeacherData | RegisterStudentData | RegisterParentData;

export interface LoginData {
email: string;
password: string;
}

export interface UpdateUserData {
firstName?: string;
lastName?: string;
phone?: string;
bio?: string;
experience?: string;
address?: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface LoginResponse {
token: string;
user: User;
}

export interface RegisterResponse {
success: boolean;
message: string;
token: string;
user: User;
}

export interface UserResponse {
success: boolean;
user: User;
}

export interface ApiError {
success: false;
message: string;
errors?: Record<string, string>;
}

// API Platform Collection Response
export interface HydraCollection<T> {
'@context': string;
'@id': string;
'@type': 'hydra:Collection';
'hydra:member': T[];
'hydra:totalItems': number;
'hydra:view'?: {
    '@id': string;
    '@type': 'hydra:PartialCollectionView';
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
};
}

// Query Parameters
export interface TeacherQueryParams {
page?: number;
itemsPerPage?: number;
isVerified?: boolean;
'subjects.id'?: number;
}

export interface LessonQueryParams {
page?: number;
itemsPerPage?: number;
'teacher.id'?: number;
'student.id'?: number;
status?: Lesson['status'];
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const authAPI = {
/**
 * Inscription d'un nouvel utilisateur
 */
register: (data: RegisterData): Promise<AxiosResponse<RegisterResponse>> =>
    api.post<RegisterResponse>('/register', data),

/**
 * Connexion d'un utilisateur
 */
login: (data: LoginData): Promise<AxiosResponse<LoginResponse>> =>
    api.post<LoginResponse>('/login', data),

/**
 * Récupérer les informations de l'utilisateur connecté
 */
me: (): Promise<AxiosResponse<UserResponse>> =>
    api.get<UserResponse>('/me'),

/**
 * Mettre à jour les informations de l'utilisateur
 */
updateProfile: (data: UpdateUserData): Promise<AxiosResponse<UserResponse>> =>
    api.patch<UserResponse>('/me', data),
};

export const teachersAPI = {
/**
 * Récupérer tous les professeurs
 */
getAll: (params?: TeacherQueryParams): Promise<AxiosResponse<HydraCollection<Teacher>>> =>
    api.get<HydraCollection<Teacher>>('/teachers', { params }),

/**
 * Récupérer un professeur par son ID
 */
getById: (id: number): Promise<AxiosResponse<Teacher>> =>
    api.get<Teacher>(`/teachers/${id}`),

/**
 * Récupérer les professeurs vérifiés
 */
getVerified: (params?: Omit<TeacherQueryParams, 'isVerified'>): Promise<AxiosResponse<HydraCollection<Teacher>>> =>
    api.get<HydraCollection<Teacher>>('/teachers', { 
    params: { ...params, isVerified: true } 
    }),

/**
 * Rechercher des professeurs par matière
 */
getBySubject: (subjectId: number, params?: Omit<TeacherQueryParams, 'subjects.id'>): Promise<AxiosResponse<HydraCollection<Teacher>>> =>
    api.get<HydraCollection<Teacher>>('/teachers', { 
    params: { ...params, 'subjects.id': subjectId } 
    }),
};

export const gradesAPI = {
/**
 * Récupérer tous les niveaux scolaires
 */
getAll: (): Promise<AxiosResponse<HydraCollection<Grade>>> =>
    api.get<HydraCollection<Grade>>('/grades'),

/**
 * Récupérer un niveau par son ID
 */
getById: (id: number): Promise<AxiosResponse<Grade>> =>
    api.get<Grade>(`/grades/${id}`),
};

export const subjectsAPI = {
/**
 * Récupérer toutes les matières
 */
getAll: (): Promise<AxiosResponse<HydraCollection<Subject>>> =>
    api.get<HydraCollection<Subject>>('/subjects'),

/**
 * Récupérer une matière par son ID
 */
getById: (id: number): Promise<AxiosResponse<Subject>> =>
    api.get<Subject>(`/subjects/${id}`),
};

export const lessonsAPI = {
/**
 * Récupérer tous les cours
 */
getAll: (params?: LessonQueryParams): Promise<AxiosResponse<HydraCollection<Lesson>>> =>
    api.get<HydraCollection<Lesson>>('/lessons', { params }),

/**
 * Récupérer un cours par son ID
 */
getById: (id: number): Promise<AxiosResponse<Lesson>> =>
    api.get<Lesson>(`/lessons/${id}`),

/**
 * Récupérer les cours d'un professeur
 */
getByTeacher: (teacherId: number, params?: Omit<LessonQueryParams, 'teacher.id'>): Promise<AxiosResponse<HydraCollection<Lesson>>> =>
    api.get<HydraCollection<Lesson>>('/lessons', { 
    params: { ...params, 'teacher.id': teacherId } 
    }),

/**
 * Récupérer les cours d'un étudiant
 */
getByStudent: (studentId: number, params?: Omit<LessonQueryParams, 'student.id'>): Promise<AxiosResponse<HydraCollection<Lesson>>> =>
    api.get<HydraCollection<Lesson>>('/lessons', { 
    params: { ...params, 'student.id': studentId } 
    }),
};

export const reviewsAPI = {
/**
 * Récupérer tous les avis
 */
getAll: (): Promise<AxiosResponse<HydraCollection<Review>>> =>
    api.get<HydraCollection<Review>>('/reviews'),

/**
 * Récupérer les avis d'un professeur
 */
getByTeacher: (teacherId: number): Promise<AxiosResponse<HydraCollection<Review>>> =>
    api.get<HydraCollection<Review>>('/reviews', { 
    params: { 'teacher.id': teacherId } 
    }),
};

export const teacherGradePricesAPI = {
/**
 * Récupérer tous les tarifs
 */
getAll: (): Promise<AxiosResponse<HydraCollection<TeacherGradePrice>>> =>
    api.get<HydraCollection<TeacherGradePrice>>('/teacher_grade_prices'),

/**
 * Récupérer les tarifs d'un professeur
 */
getByTeacher: (teacherId: number): Promise<AxiosResponse<HydraCollection<TeacherGradePrice>>> =>
    api.get<HydraCollection<TeacherGradePrice>>('/teacher_grade_prices', { 
    params: { 'teacher.id': teacherId } 
    }),

/**
 * Récupérer les tarifs pour un niveau spécifique
 */
getByGrade: (gradeId: number): Promise<AxiosResponse<HydraCollection<TeacherGradePrice>>> =>
    api.get<HydraCollection<TeacherGradePrice>>('/teacher_grade_prices', { 
    params: { 'grade.id': gradeId } 
    }),
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Type guard pour vérifier si un user est un Teacher
 */
export const isTeacher = (user: User): user is Teacher => {
return user.userType === 'teacher';
};

/**
 * Type guard pour vérifier si un user est un Student
 */
export const isStudent = (user: User): user is Student => {
return user.userType === 'student';
};

/**
 * Type guard pour vérifier si un user est un Parent
 */
export const isParent = (user: User): user is ParentUser => {
return user.userType === 'parent';
};

/**
 * Type guard pour vérifier si un user est un Admin
 */
export const isAdmin = (user: User): user is Admin | SuperAdmin => {
return user.userType === 'admin' || user.userType === 'super_admin';
};

export default api;