export type UserRole = 'ADMIN' | 'COORDINATOR' | 'INTERVIEWER' | 'CANDIDATE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
}
