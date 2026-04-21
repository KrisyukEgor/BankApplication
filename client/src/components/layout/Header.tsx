import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../app/auth/useAuthStore";
import { colors} from "../../styles/colors";
import { theme } from "../../styles/Theme";

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className="fixed top-0 z-10 flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm"
      style={{
        borderColor: colors.gray200,
        fontFamily: theme.fontFamily,
      }}
    >
      <Link
        to={user?.role === "ADMIN" ? "/admin/stats" : "/"}
        className="text-xl font-bold"
        style={{ color: colors.primaryDark }}
      >
        Online Bank
      </Link>

      {user && (
        <nav>
          <ul className="flex gap-6">
            {user.role === "ADMIN" ? (
              <>
                <li>
                  <Link
                    to="/admin/stats"
                    className="text-sm font-medium hover:underline"
                    style={{ color: colors.gray800 }}
                  >
                    Статистика
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/logs"
                    className="text-sm font-medium hover:underline"
                    style={{ color: colors.gray800 }}
                  >
                    Логи
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm font-medium hover:underline"
                    style={{ color: colors.gray800 }}
                  >
                    Профиль
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accounts"
                    className="text-sm font-medium hover:underline"
                    style={{ color: colors.gray800 }}
                  >
                    Счета
                  </Link>
                </li>
                <li>
                  <Link
                    to="/transactions"
                    className="text-sm font-medium hover:underline"
                    style={{ color: colors.gray800 }}
                  >
                    Операции
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}