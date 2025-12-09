export type { 
  LoginRequest,
  RegisterRequest,
  RegisterTeacherRequest,
  RegisterStudentRequest,
  RegisterParentRequest,
  AuthResponse,
} from './common.types';

export type UserType = "student" | "teacher" | "parent";

export interface RegisterBasePayload {
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Student
export interface StudentRegisterPayload extends RegisterBasePayload {
  userType: "student";
  gradeId: number;
}

// Teacher
export interface TeacherRegisterPayload extends RegisterBasePayload {
  userType: "teacher";
  bio: string;
  experience: string;
}

// Parent
export interface ParentRegisterPayload extends RegisterBasePayload {
  userType: "parent";
  address: string;
}

export type RegisterPayload =
  | StudentRegisterPayload
  | TeacherRegisterPayload
  | ParentRegisterPayload;
