export type AuthUser = {
  id: string;
  email: string;
  role: "USER" | "WORKER" | "ADMIN";
  displayName: string;
};

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



