import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/auth/useAuthStore";
import { colors } from "../../styles/colors";
import { login } from "../../app/auth/authService";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { user } = await login({
        email,
        password,
      });
      setUser(user);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка входа"
      );
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg bg-white p-6 shadow-lg"
        style={{
          maxWidth: "28rem",
          border: `1px solid ${colors.gray200}`,
        }}
      >
        <h1 className="mb-6 text-2xl font-bold">
          Вход в интернет‑банк
        </h1>

        <div className="mb-4">
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: colors.gray300,
              boxShadow: `0 0 0 3px rgba(0, 102, 204, 0.1)`,
            }}
          />
        </div>

        <div className="mb-4">
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: colors.gray300,
              boxShadow: `0 0 0 3px rgba(0, 102, 204, 0.1)`,
            }}
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded px-4 py-2 font-medium text-white"
          style={{ backgroundColor: colors.primary }}
        >
          Войти
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline"
            style={{ color: colors.primaryDark }}
          >
            Зарегистрироваться
          </Link>
          <br />
          <Link
            to="/auth/reset-password"
            className="text-blue-600 hover:underline"
            style={{
              color: colors.primaryDark,
              textDecoration: "none",
            }}
          >
            Забыли пароль?
          </Link>
        </p>
      </form>
    </div>
  );
}
