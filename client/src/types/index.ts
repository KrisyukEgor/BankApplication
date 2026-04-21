export type UserRole = "USER" | "WORKER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
};

export type ForgotPasswordData = {
  email: string;
};



