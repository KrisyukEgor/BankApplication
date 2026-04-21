import React, { useMemo, useState } from "react";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";

type Period = "day" | "week" | "month";

type ActivityPoint = {
  label: string;
  users: number;
  operations: number;
};

type TopUser = {
  id: string;
  name: string;
  email: string;
  operationsCount: number;
  lastSeen: string;
};

type CrudStats = {
  create: number;
  read: number;
  update: number;
  delete: number;
};

type Anomaly = {
  id: string;
  user: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  detectedAt: string;
};

const mockActivityByPeriod: Record<Period, ActivityPoint[]> = {
  day: [
    { label: "09:00", users: 12, operations: 34 },
    { label: "12:00", users: 25, operations: 62 },
    { label: "15:00", users: 31, operations: 79 },
    { label: "18:00", users: 18, operations: 41 },
  ],
  week: [
    { label: "Пн", users: 55, operations: 190 },
    { label: "Вт", users: 61, operations: 214 },
    { label: "Ср", users: 58, operations: 201 },
    { label: "Чт", users: 66, operations: 240 },
    { label: "Пт", users: 72, operations: 286 },
    { label: "Сб", users: 29, operations: 94 },
    { label: "Вс", users: 18, operations: 51 },
  ],
  month: [
    { label: "Нед 1", users: 240, operations: 810 },
    { label: "Нед 2", users: 265, operations: 920 },
    { label: "Нед 3", users: 249, operations: 880 },
    { label: "Нед 4", users: 291, operations: 1015 },
  ],
};

const mockTopUsers: TopUser[] = [
  { id: "1", name: "Анна Иванова", email: "anna@example.com", operationsCount: 183, lastSeen: "2026-04-21 13:25" },
  { id: "2", name: "Иван Петров", email: "ivan@example.com", operationsCount: 171, lastSeen: "2026-04-21 12:58" },
  { id: "3", name: "Мария Смирнова", email: "maria@example.com", operationsCount: 165, lastSeen: "2026-04-21 12:14" },
  { id: "4", name: "Олег Ковалёв", email: "oleg@example.com", operationsCount: 158, lastSeen: "2026-04-21 11:47" },
  { id: "5", name: "Елена Орлова", email: "elena@example.com", operationsCount: 146, lastSeen: "2026-04-21 10:55" },
  { id: "6", name: "Павел Сидоров", email: "pavel@example.com", operationsCount: 138, lastSeen: "2026-04-21 10:12" },
  { id: "7", name: "Наталья Миронова", email: "nataly@example.com", operationsCount: 132, lastSeen: "2026-04-21 09:51" },
  { id: "8", name: "Дмитрий Егоров", email: "d.egorov@example.com", operationsCount: 127, lastSeen: "2026-04-21 09:17" },
  { id: "9", name: "Сергей Алексеев", email: "sergey@example.com", operationsCount: 119, lastSeen: "2026-04-21 08:49" },
  { id: "10", name: "Юлия Фомина", email: "yulia@example.com", operationsCount: 113, lastSeen: "2026-04-21 08:15" },
];

const mockCrudStats: CrudStats = {
  create: 248,
  read: 1420,
  update: 316,
  delete: 57,
};

const mockAnomalies: Anomaly[] = [
  {
    id: "a1",
    user: "Анна Иванова",
    type: "Необычно частые входы",
    description: "12 входов за 20 минут с разных IP-адресов.",
    severity: "high",
    detectedAt: "2026-04-21 12:40",
  },
  {
    id: "a2",
    user: "Иван Петров",
    type: "Пиковая CRUD-активность",
    description: "Количество операций update выше среднего в 6.2 раза.",
    severity: "medium",
    detectedAt: "2026-04-21 11:05",
  },
  {
    id: "a3",
    user: "Мария Смирнова",
    type: "Ночная активность",
    description: "Серия операций после 03:00, что не характерно для профиля.",
    severity: "low",
    detectedAt: "2026-04-21 03:44",
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

function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminStatsPage() {
  const [period, setPeriod] = useState<Period>("week");

  const activityData = mockActivityByPeriod[period];

  const totalUsers = useMemo(
    () => activityData.reduce((sum, item) => sum + item.users, 0),
    [activityData]
  );

  const totalOperations = useMemo(
    () => activityData.reduce((sum, item) => sum + item.operations, 0),
    [activityData]
  );

  const crudTotal =
    mockCrudStats.create +
    mockCrudStats.read +
    mockCrudStats.update +
    mockCrudStats.delete;

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
            Админ-панель: статистика
          </h1>

          <p
            style={{
              color: colors.gray600,
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Аналитика активности пользователей, CRUD-операций, временных трендов и аномалий.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {(["day", "week", "month"] as Period[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPeriod(item)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: `1px solid ${item === period ? colors.primary : colors.gray300}`,
                    backgroundColor: item === period ? colors.primary : colors.white,
                    color: item === period ? colors.white : colors.gray800,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {item === "day" ? "День" : item === "week" ? "Неделя" : "Месяц"}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => downloadJson("admin-stats.json", {
                  period,
                  activityData,
                  topUsers: mockTopUsers,
                  crudStats: mockCrudStats,
                  anomalies: mockAnomalies,
                })}
                style={{
                  padding: "10px 14px",
                  borderRadius: "6px",
                  border: `1px solid ${colors.gray300}`,
                  backgroundColor: colors.white,
                  color: colors.gray800,
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Экспорт JSON
              </button>

              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    "admin-top-users.csv",
                    mockTopUsers.map((user) => ({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      operationsCount: user.operationsCount,
                      lastSeen: user.lastSeen,
                    }))
                  )
                }
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
                Экспорт CSV
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Активные пользователи</div>
            <div style={valueStyle}>{totalUsers}</div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Всего операций</div>
            <div style={valueStyle}>{totalOperations}</div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Найдено аномалий</div>
            <div style={{ ...valueStyle, color: colors.danger }}>{mockAnomalies.length}</div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h2 style={sectionTitleStyle}>Временные тренды</h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {activityData.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 120px 120px",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div style={{ color: colors.gray800, fontSize: "14px", fontWeight: "500" }}>
                  {item.label}
                </div>

                <div
                  style={{
                    height: "10px",
                    backgroundColor: colors.gray200,
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min((item.operations / 300) * 100, 100)}%`,
                      height: "100%",
                      backgroundColor: colors.primary,
                    }}
                  />
                </div>

                <div style={{ color: colors.gray600, fontSize: "14px" }}>
                  Юзеры: {item.users}
                </div>

                <div style={{ color: colors.gray600, fontSize: "14px" }}>
                  Операции: {item.operations}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>ТОП-10 активных пользователей</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              {mockTopUsers.map((user, index) => (
                <div
                  key={user.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 120px",
                    gap: "12px",
                    alignItems: "center",
                    paddingBottom: "12px",
                    borderBottom: `1px solid ${colors.gray200}`,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "999px",
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primaryDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "14px",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div style={{ color: colors.gray800, fontSize: "14px", fontWeight: "600" }}>
                      {user.name}
                    </div>
                    <div style={{ color: colors.gray600, fontSize: "13px" }}>
                      {user.email}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: colors.primaryDark, fontWeight: "700", fontSize: "16px" }}>
                      {user.operationsCount}
                    </div>
                    <div style={{ color: colors.gray600, fontSize: "12px" }}>
                      {user.lastSeen}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>CRUD-статистика</h2>

            {[
              { label: "CREATE", value: mockCrudStats.create, color: colors.success },
              { label: "READ", value: mockCrudStats.read, color: colors.primary },
              { label: "UPDATE", value: mockCrudStats.update, color: colors.warning },
              { label: "DELETE", value: mockCrudStats.delete, color: colors.danger },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: colors.gray800, fontWeight: "500" }}>{item.label}</span>
                  <span style={{ color: colors.gray600 }}>{item.value}</span>
                </div>

                <div
                  style={{
                    height: "10px",
                    backgroundColor: colors.gray200,
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.value / crudTotal) * 100}%`,
                      height: "100%",
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Аномалии поведения пользователей</h2>

          <div style={{ display: "grid", gap: "14px" }}>
            {mockAnomalies.map((item) => (
              <div
                key={item.id}
                style={{
                  border: `1px solid ${
                    item.severity === "high"
                      ? colors.danger
                      : item.severity === "medium"
                      ? colors.warning
                      : colors.gray300
                  }`,
                  borderRadius: "10px",
                  padding: "16px",
                  backgroundColor: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ color: colors.gray800, fontWeight: "700", fontSize: "15px" }}>
                    {item.type}
                  </div>
                  <div
                    style={{
                      color:
                        item.severity === "high"
                          ? colors.danger
                          : item.severity === "medium"
                          ? colors.warning
                          : colors.gray600,
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                  >
                    {item.severity.toUpperCase()}
                  </div>
                </div>

                <div style={{ color: colors.gray600, fontSize: "14px", marginBottom: "6px" }}>
                  Пользователь: {item.user}
                </div>

                <div style={{ color: colors.gray600, fontSize: "14px", marginBottom: "6px" }}>
                  {item.description}
                </div>

                <div style={{ color: colors.gray600, fontSize: "12px" }}>
                  Обнаружено: {item.detectedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "24px",
};

const labelStyle: React.CSSProperties = {
  color: colors.gray600,
  fontSize: "13px",
  marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
  color: colors.primaryDark,
  fontSize: "28px",
  fontWeight: "700",
};

const sectionTitleStyle: React.CSSProperties = {
  color: colors.primaryDark,
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "18px",
};