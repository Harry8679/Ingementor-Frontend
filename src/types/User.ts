export interface User {
  id: number;
  email: string;
  userType: 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';

  // Champs souvent présents mais parfois optionnels selon l’API
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string | null;
  roles?: string[];

  bio?: string;
  experience?: string;
  isVerified?: boolean;
  rating?: string;

  grade?: {
    id: number;
    name: string;
    level: string;
  };

  address?: string;
}
