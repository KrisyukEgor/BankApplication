import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthUser } from "../../types";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";

type Props = {
  user: AuthUser | null;
};

export function Sidebar({ user }: Props) {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 z-10 h-full border-r bg-white shadow"
      style={{
        width: 240,
        borderColor: colors.gray200,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="p-6">
        <h2
          className="text-lg font-bold"
          style={{ color: colors.primaryDark }}
        >
          Меню
        </h2>
      </div>

      <ul className="space-y-2 px-2">
        {user ? (
          <>
            {/** USER */}
            <li>
              <Link
                to="/profile"
                className={`block rounded px-3 py-2 text-sm font-medium ${
                  location.pathname === "/profile"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Профиль
              </Link>
            </li>

            <li>
              <Link
                to="/accounts"
                className={`block rounded px-3 py-2 text-sm font-medium ${
                  location.pathname === "/accounts"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Счета
              </Link>
            </li>

            <li>
              <Link
                to="/transactions"
                className={`block rounded px-3 py-2 text-sm font-medium ${
                  location.pathname === "/transactions"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Операции
              </Link>
            </li>

            {["WORKER", "ADMIN"].includes(user.role) && (
              <li>
                <Link
                  to="/admin/users"
                  className={`block rounded px-3 py-2 text-sm font-medium ${
                    location.pathname === "/admin/users"
                      ? "bg-blue-50 text-blue-700"
                      : "text-primary hover:bg-blue-50"
                  }`}
                  style={{
                    color: colors.primary,
                  }}
                >
                  Пользователи (админ)
                </Link>
              </li>
            )}
          </>
        ) : (
          <li>
            <Link
              to="/auth/login"
              className="block rounded px-3 py-2 text-sm font-medium text-primary"
              style={{ color: colors.primary }}
            >
              Вход в кабинет
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}