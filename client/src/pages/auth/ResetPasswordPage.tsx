import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/colors";
import { resetPassword } from "../../app/auth/authService";

export function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await resetPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при отправке запроса");
    } finally {
      setIsLoading(false);
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
          Восстановление пароля
        </h1>

        {success ? (
          <div className="mb-4">
            <p style={{ color: colors.success }}>
              Ссылка для восстановления пароля отправлена на ваш email.
            </p>
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="mt-4 rounded px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Вернуться к входу
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="reset-email"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
                style={{
                  borderColor: colors.gray300,
                  boxShadow: `0 0 0 3px rgba(0, 102, 204, 0.1)`,
                  opacity: isLoading ? 0.7 : 1,
                }}
              />
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded px-4 py-2 font-medium text-white"
              style={{
                backgroundColor: isLoading ? colors.gray300 : colors.primary,
              }}
            >
              {isLoading ? "Отправка..." : "Отправить ссылку"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              <span>Помните пароль? </span>
              <Link
                to="/auth/login"
                className="text-blue-600 hover:underline"
                style={{ color: colors.primaryDark }}
              >
                Войти
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
}
