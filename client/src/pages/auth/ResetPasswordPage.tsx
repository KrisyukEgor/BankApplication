import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#edf2f7", // bg-blue-50
        fontFamily: theme.fontFamily,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "32px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: colors.primaryDark,
            }}
          >
            Восстановление пароля
          </h1>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              backgroundColor: colors.danger + "10",
              border: `1px solid ${colors.danger}`,
              color: colors.danger,
              textAlign: "center",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {success ? (
          <div style={{ marginTop: "16px" }}>
            <p
              style={{
                color: colors.success,
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Ссылка для восстановления пароля отправлена на ваш email.
            </p>

            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                backgroundColor: colors.primary,
                color: "white",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Вернуться к входу
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: "16px" }}>
              <label
                style={{
                  display: "block",
                  color: colors.gray800,
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
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
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 12px",
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(0, 102, 204, 0.1)",
                  opacity: isLoading ? 0.7 : 1,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: "block",
                width: "100%",
                marginTop: "24px",
                padding: "12px 16px",
                backgroundColor: isLoading ? colors.gray300 : colors.primary,
                color: "white",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {isLoading ? "Отправка..." : "Отправить ссылку"}
            </button>

            <div
              style={{
                borderTop: `1px solid ${colors.gray200}`,
                margin: "24px 0 16px",
              }}
            ></div>

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: colors.gray600,
              }}
            >
              <span>Помните пароль? </span>
              <Link
                to="/auth/login"
                style={{
                  color: colors.primary,
                  fontWeight: "500",
                  textDecoration: "none",
                }}
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
