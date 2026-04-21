import React from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../styles/colors";
import { theme } from "../../styles/Theme";

type AccountType = "DEBIT" | "CREDIT";
type Currency = "BYN" | "USD" | "EUR";

type Account = {
  id: string;
  type: AccountType;
  title: string;
  balance: number;
  currency: Currency;
  accountNumber: string;
  expiresAt: string;
};

const mockAccounts: Account[] = [
  {
    id: "1",
    type: "DEBIT",
    title: "Основной дебетовый счёт",
    balance: 2480.35,
    currency: "BYN",
    accountNumber: "3012000012345678901",
    expiresAt: "09/28",
  },
  {
    id: "2",
    type: "DEBIT",
    title: "Валютный счёт",
    balance: 1250.0,
    currency: "USD",
    accountNumber: "3012000098765432109",
    expiresAt: "11/27",
  },
  {
    id: "3",
    type: "CREDIT",
    title: "Кредитная карта",
    balance: -820.5,
    currency: "BYN",
    accountNumber: "4319400011122233344",
    expiresAt: "04/27",
  },
];

const exchangeRatesToBYN: Record<Currency, number> = {
  BYN: 1,
  USD: 2.89,
  EUR: 3.12,
};

function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatBYN(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "BYN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function maskAccountNumber(accountNumber: string) {
  if (accountNumber.length <= 8) return accountNumber;
  const start = accountNumber.slice(0, 4);
  const end = accountNumber.slice(-4);
  return `${start} **** **** ${end}`;
}

function convertToBYN(amount: number, currency: Currency) {
  return amount * exchangeRatesToBYN[currency];
}

export function DashboardPage() {
  const navigate = useNavigate();

  const totalDebitBalanceBYN = mockAccounts
    .filter((account) => account.type === "DEBIT")
    .reduce((sum, account) => {
      return sum + convertToBYN(account.balance, account.currency);
    }, 0);

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
            Личный кабинет
          </h1>

          <p
            style={{
              color: colors.gray600,
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            Добро пожаловать в интернет-банк. Ниже отображаются ваши счета.
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: colors.gray100,
              border: `1px solid ${colors.gray200}`,
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: colors.gray600,
                marginBottom: "4px",
              }}
            >
              Суммарный баланс дебетовых счетов
            </div>

            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: colors.primaryDark,
              }}
            >
              {formatBYN(totalDebitBalanceBYN)}
            </div>

            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: colors.gray600,
              }}
            >
              С учётом конвертации валютных счетов в BYN
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {mockAccounts.map((account) => {
            const isCredit = account.type === "CREDIT";

            return (
              <div
                key={account.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "24px",
                  border: `1px solid ${isCredit ? colors.danger : colors.gray200}`,
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
                        backgroundColor: isCredit ? `${colors.danger}15` : `${colors.primary}15`,
                        color: isCredit ? colors.danger : colors.primaryDark,
                      }}
                    >
                      {isCredit ? "Кредитный счёт" : "Дебетовый счёт"}
                    </div>

                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: colors.gray800,
                        marginBottom: "8px",
                      }}
                    >
                      {account.title}
                    </h2>

                    <p
                      style={{
                        fontSize: "14px",
                        color: colors.gray600,
                        marginBottom: "6px",
                      }}
                    >
                      Номер счёта: {maskAccountNumber(account.accountNumber)}
                    </p>

                    <p
                      style={{
                        fontSize: "14px",
                        color: colors.gray600,
                      }}
                    >
                      Активен до: {account.expiresAt}
                    </p>
                  </div>

                  <div
                    style={{
                      minWidth: "260px",
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
                      Текущий баланс
                    </div>

                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: isCredit ? colors.danger : colors.primaryDark,
                        marginBottom: "16px",
                      }}
                    >
                      {formatMoney(account.balance, account.currency)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => navigate("/transfer")}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: isCredit ? colors.danger : colors.primary,
                          color: "white",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Сделать перевод
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/transactions?accountId=${account.id}`)}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: colors.white,
                          color: colors.primaryDark,
                          borderRadius: "6px",
                          border: `1px solid ${colors.gray300}`,
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        История транзакций
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}