import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/colors";
import { register } from "../../app/auth/authService";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({
        email,
        password,
        confirmPassword,
        displayName,
      });
      navigate("/auth/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка регистрации"
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
          Регистрация
        </h1>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ФИО
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            style={{
              borderColor: colors.gray300,
              boxShadow: `0 0 0 3px rgba(0, 102, 204, 0.1)`,
            }}
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
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

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Повторите пароль
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Зарегистрироваться
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline"
            style={{ color: colors.primaryDark }}
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
