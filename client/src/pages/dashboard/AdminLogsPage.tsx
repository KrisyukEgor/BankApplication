import React, { useMemo, useState } from "react";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";

type EventType =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DB_QUERY"
  | "ERROR";

type LogItem = {
  id: string;
  user: string;
  eventType: EventType;
  message: string;
  source: string;
  createdAt: string;
};

const mockLogs: LogItem[] = [
  {
    id: "l1",
    user: "Анна Иванова",
    eventType: "LOGIN",
    message: "Успешный вход в систему",
    source: "auth-service",
    createdAt: "2026-04-21 12:40",
  },
  {
    id: "l2",
    user: "Иван Петров",
    eventType: "CREATE",
    message: "Создание нового банковского счёта",
    source: "accounts-service",
    createdAt: "2026-04-21 12:15",
  },
  {
    id: "l3",
    user: "Мария Смирнова",
    eventType: "DB_QUERY",
    message: "SELECT * FROM accounts WHERE user_id = ...",
    source: "postgres",
    createdAt: "2026-04-21 11:58",
  },
  {
    id: "l4",
    user: "Система",
    eventType: "ERROR",
    message: "Unhandled exception: timeout while processing transfer",
    source: "api-gateway",
    createdAt: "2026-04-21 11:10",
  },
  {
    id: "l5",
    user: "Анна Иванова",
    eventType: "DELETE",
    message: "Удаление шаблона платежа",
    source: "payments-service",
    createdAt: "2026-04-21 10:44",
  },
  {
    id: "l6",
    user: "Дмитрий Егоров",
    eventType: "LOGOUT",
    message: "Выход из системы",
    source: "auth-service",
    createdAt: "2026-04-21 10:20",
  },
];

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getEventColor(eventType: EventType) {
  if (eventType === "ERROR") return colors.danger;
  if (eventType === "DB_QUERY") return colors.warning;
  if (eventType === "LOGIN" || eventType === "LOGOUT") return colors.primary;
  return colors.success;
}

export function AdminLogsPage() {
  const [eventType, setEventType] = useState<string>("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredLogs = useMemo(() => {
    return mockLogs.filter((item) => {
      const matchesEvent = eventType ? item.eventType === eventType : true;
      const matchesUser = userFilter
        ? item.user.toLowerCase().includes(userFilter.toLowerCase())
        : true;

      const itemDateOnly = item.createdAt.slice(0, 10);
      const matchesFrom = dateFrom ? itemDateOnly >= dateFrom : true;
      const matchesTo = dateTo ? itemDateOnly <= dateTo : true;

      return matchesEvent && matchesUser && matchesFrom && matchesTo;
    });
  }, [eventType, userFilter, dateFrom, dateTo]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#edf2f7",
        fontFamily: theme.fontFamily,
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "24px 28px",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: colors.primaryDark,
              marginBottom: "8px",
            }}
          >
            Админ-панель: логи
          </h1>

          <p
            style={{
              color: colors.gray600,
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Поиск и фильтрация логов по действиям, пользователям и временным интервалам.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={filterLabelStyle}>Тип события</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Все</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="DB_QUERY">DB_QUERY</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div>
              <label style={filterLabelStyle}>Пользователь</label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Введите имя"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={filterLabelStyle}>Дата с</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={filterLabelStyle}>Дата по</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadJson("admin-logs.json", filteredLogs)}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Экспорт JSON
          </button>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "20px 24px",
                border: `1px solid ${colors.gray200}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      marginBottom: "10px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor: `${getEventColor(log.eventType)}15`,
                      color: getEventColor(log.eventType),
                    }}
                  >
                    {log.eventType}
                  </div>

                  <div
                    style={{
                      color: colors.gray800,
                      fontSize: "15px",
                      fontWeight: "700",
                      marginBottom: "6px",
                    }}
                  >
                    {log.message}
                  </div>

                  <div style={{ color: colors.gray600, fontSize: "14px", marginBottom: "4px" }}>
                    Пользователь: {log.user}
                  </div>

                  <div style={{ color: colors.gray600, fontSize: "14px" }}>
                    Источник: {log.source}
                  </div>
                </div>

                <div
                  style={{
                    color: colors.gray600,
                    fontSize: "13px",
                    minWidth: "160px",
                    textAlign: "right",
                  }}
                >
                  {log.createdAt}
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "24px",
                textAlign: "center",
                color: colors.gray600,
              }}
            >
              По заданным фильтрам логи не найдены.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const filterLabelStyle: React.CSSProperties = {
  display: "block",
  color: colors.gray800,
  fontSize: "14px",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px",
  border: `1px solid ${colors.gray300}`,
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "white",
};