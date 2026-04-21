import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
} from "../../types";

type MockAuthUser = AuthUser & {
  password: string;
};

const mockUsers: MockAuthUser[] = [
  {
    id: "1",
    email: "user@bank.com",
    password: "123456",
    role: "USER",
    displayName: "Клиент Клиентов",
  },
  {
    id: "2",
    email: "worker@bank.com",
    password: "123456",
    role: "WORKER",
    displayName: "Сотрудник Банка",
  },
  {
    id: "3",
    email: "admin@bank.com",
    password: "123456",
    role: "ADMIN",
    displayName: "Главный Администратор",
  },
];

let mockUser: AuthUser | null = null;

export async function login({
  email,
  password,
}: LoginCredentials): Promise<{ accessToken: string; user: AuthUser }> {
  if (!email || !password) {
    throw new Error("Email и пароль обязательны");
  }

  const foundUser = mockUsers.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    throw new Error("Неверный email или пароль");
  }

  const { password: _password, ...user } = foundUser;
  mockUser = user;

  return {
    accessToken: `mock-jwt-token-${user.role.toLowerCase()}`,
    user,
  };
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

  const existingUser = mockUsers.find((user) => user.email === data.email);

  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }

  const newUser: MockAuthUser = {
    id: Math.random().toString(36).substring(2),
    email: data.email,
    password: data.password,
    role: "USER",
    displayName: data.displayName,
  };

  mockUsers.push(newUser);

  const { password: _password, ...user } = newUser;
  mockUser = user;

  return { user };
}

export async function logout(): Promise<void> {
  mockUser = null;
}

export async function resetPassword(
  data: ForgotPasswordData
): Promise<void> {
  if (!data.email) {
    throw new Error("Email обязателен");
  }

  console.log("Сброс пароля, email:", data.email);
}

export function getMockUser(): AuthUser | null {
  return mockUser;
}