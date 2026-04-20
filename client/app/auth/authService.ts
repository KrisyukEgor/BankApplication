import { AuthUser, LoginCredentials, RegisterData, ForgotPasswordData } from "../../types";

let mockUser: AuthUser | null = null;

export async function login({
  email,
  password,
}: LoginCredentials): Promise<{ accessToken: string; user: AuthUser }> {
  if (!email || !password) {
    throw new Error("Email и пароль обязательны");
  }

  
  if (
    email === "user@bank.com" &&
    password === "123456"
  ) {
    const user: AuthUser = {
      id: "1",
      email,
      role: "USER",
      displayName: "Клиент Клиентов",
    };
    mockUser = user;
    return {
      accessToken: "mock-jwt-token",
      user,
    };
  }

  throw new Error("Неверный email или пароль");
}

export async function register(
  data: RegisterData
): Promise<{ user: AuthUser }> {
  if (!data.email || !data.password || !data.displayName) {
    throw new Error("Все поля обязательны");
  }
  if (data.password !== data.confirmPassword) {
    throw new Error("Пароли не совпадают");
  }

  const user: AuthUser = {
    id: Math.random().toString(36).substring(2),
    email: data.email,
    role: "USER",
    displayName: data.displayName,
  };
  mockUser = user;

  return { user };
}

export async function logout(): Promise<void> {
  mockUser = null;
}

export async function resetPassword(
  data: ForgotPasswordData
): Promise<void> {
  if (!data.email) throw new Error("Email обязателен");
  
  console.log("Сброс пароля, email:", data.email);
  return;
}

export function getMockUser(): AuthUser | null {
  return mockUser;
}