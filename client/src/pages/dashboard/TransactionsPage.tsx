import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";

type TransactionType = "INCOME" | "EXPENSE";
type Currency = "BYN" | "USD" | "EUR";

type Transaction = {
  id: string;
  accountId: string;
  title: string;
  description: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  date: string;
  status: "COMPLETED" | "PENDING";
};

const mockTransactions: Transaction[] = [
  {
    id: "t1",
    accountId: "1",
    title: "Зачисление зарплаты",
    description: "ООО Ромашка",
    amount: 1850.0,
    currency: "BYN",
    type: "INCOME",
    date: "2026-04-20 09:15",
    status: "COMPLETED",
  },
  {
    id: "t2",
    accountId: "1",
    title: "Оплата в магазине",
    description: "Green, Минск",
    amount: 47.32,
    currency: "BYN",
    type: "EXPENSE",
    date: "2026-04-19 18:42",
    status: "COMPLETED",
  },
  {
    id: "t3",
    accountId: "1",
    title: "Перевод клиенту банка",
    description: "Перевод по номеру счёта",
    amount: 120.0,
    currency: "BYN",
    type: "EXPENSE",
    date: "2026-04-18 14:05",
    status: "COMPLETED",
  },
  {
    id: "t4",
    accountId: "2",
    title: "Пополнение валютного счёта",
    description: "Внутренний перевод",
    amount: 500.0,
    currency: "USD",
    type: "INCOME",
    date: "2026-04-17 11:20",
    status: "COMPLETED",
  },
  {
    id: "t5",
    accountId: "2",
    title: "Оплата подписки",
    description: "Online service",
    amount: 19.99,
    currency: "USD",
    type: "EXPENSE",
    date: "2026-04-16 08:55",
    status: "COMPLETED",
  },
  {
    id: "t6",
    accountId: "3",
    title: "Погашение задолженности",
    description: "Платёж по кредитной карте",
    amount: 250.0,
    currency: "BYN",
    type: "INCOME",
    date: "2026-04-15 16:10",
    status: "PENDING",
  },
  {
    id: "t7",
    accountId: "3",
    title: "Оплата заказа",
    description: "Интернет-магазин",
    amount: 132.45,
    currency: "BYN",
    type: "EXPENSE",
    date: "2026-04-14 13:30",
    status: "COMPLETED",
  },
];

function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function getStatusLabel(status: Transaction["status"]) {
  if (status === "COMPLETED") return "Проведена";
  return "В обработке";
}

export function TransactionsPage() {
  const [searchParams] = useSearchParams();
  const accountIdFromQuery = searchParams.get("accountId") || "";
  const [selectedAccountId, setSelectedAccountId] = useState(accountIdFromQuery);

  const accountOptions = useMemo(() => {
    return Array.from(new Set(mockTransactions.map((transaction) => transaction.accountId)));
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!selectedAccountId) {
      return mockTransactions;
    }

    return mockTransactions.filter(
      (transaction) => transaction.accountId === selectedAccountId
    );
  }, [selectedAccountId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#edf2f7",
        fontFamily: theme.fontFamily,
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
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
            История транзакций
          </h1>

          <p
            style={{
              color: colors.gray600,
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Здесь отображаются входящие и исходящие операции по вашим счетам.
          </p>

          <div style={{ maxWidth: "260px" }}>
            <label
              htmlFor="accountId"
              style={{
                display: "block",
                color: colors.gray800,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Выберите счёт
            </label>

            <select
              id="accountId"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                border: `1px solid ${colors.gray300}`,
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: "white",
              }}
            >
              <option value="">Все счета</option>
              {accountOptions.map((accountId) => (
                <option key={accountId} value={accountId}>
                  Счёт #{accountId}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {filteredTransactions.length === 0 ? (
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
              По выбранному счёту транзакции не найдены.
            </div>
          ) : (
            filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";

              return (
                <div
                  key={transaction.id}
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
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          marginBottom: "12px",
                          backgroundColor: isIncome
                            ? `${colors.success}15`
                            : `${colors.danger}15`,
                          color: isIncome ? colors.success : colors.danger,
                        }}
                      >
                        {isIncome ? "Входящая операция" : "Исходящая операция"}
                      </div>

                      <h2
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: colors.gray800,
                          marginBottom: "6px",
                        }}
                      >
                        {transaction.title}
                      </h2>

                      <p
                        style={{
                          fontSize: "14px",
                          color: colors.gray600,
                          marginBottom: "6px",
                        }}
                      >
                        {transaction.description}
                      </p>

                      <p
                        style={{
                          fontSize: "13px",
                          color: colors.gray600,
                          marginBottom: "4px",
                        }}
                      >
                        Дата операции: {transaction.date}
                      </p>

                      <p
                        style={{
                          fontSize: "13px",
                          color: colors.gray600,
                        }}
                      >
                        Счёт: #{transaction.accountId}
                      </p>
                    </div>

                    <div
                      style={{
                        minWidth: "220px",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: colors.gray600,
                          marginBottom: "6px",
                        }}
                      >
                        Сумма
                      </div>

                      <div
                        style={{
                          fontSize: "26px",
                          fontWeight: "bold",
                          color: isIncome ? colors.success : colors.danger,
                          marginBottom: "12px",
                        }}
                      >
                        {isIncome ? "+" : "-"}
                        {formatMoney(transaction.amount, transaction.currency)}
                      </div>

                      <div
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            transaction.status === "COMPLETED"
                              ? `${colors.primary}15`
                              : `${colors.warning}20`,
                          color:
                            transaction.status === "COMPLETED"
                              ? colors.primaryDark
                              : colors.warning,
                        }}
                      >
                        {getStatusLabel(transaction.status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}