import React, { useMemo, useState } from "react";
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
};

const mockAccounts: Account[] = [
  {
    id: "1",
    type: "DEBIT",
    title: "Основной дебетовый счёт",
    balance: 2480.35,
    currency: "BYN",
    accountNumber: "3012000012345678901",
  },
  {
    id: "2",
    type: "DEBIT",
    title: "Валютный счёт",
    balance: 1250.0,
    currency: "USD",
    accountNumber: "3012000098765432109",
  },
  {
    id: "3",
    type: "CREDIT",
    title: "Кредитная карта",
    balance: 900.0,
    currency: "BYN",
    accountNumber: "4319400011122233344",
  },
];

function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function maskAccountNumber(accountNumber: string) {
  if (accountNumber.length <= 8) return accountNumber;
  const start = accountNumber.slice(0, 4);
  const end = accountNumber.slice(-4);
  return `${start} **** **** ${end}`;
}

export function TransferPage() {
  const [fromAccountId, setFromAccountId] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("BYN");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedAccount = useMemo(() => {
    return mockAccounts.find((account) => account.id === fromAccountId) || null;
  }, [fromAccountId]);

  const availableCurrencies = useMemo(() => {
    if (!selectedAccount) return ["BYN", "USD", "EUR"] as Currency[];
    return [selectedAccount.currency];
  }, [selectedAccount]);

  const validateForm = () => {
    if (!fromAccountId) {
      return "Выберите счёт списания.";
    }

    if (!recipientAccount.trim()) {
      return "Введите номер карты или счёта получателя.";
    }

    const normalizedRecipient = recipientAccount.replace(/\s/g, "");
    if (normalizedRecipient.length < 8) {
      return "Номер карты или счёта получателя слишком короткий.";
    }

    if (!amount.trim()) {
      return "Введите сумму перевода.";
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return "Сумма перевода должна быть больше нуля.";
    }

    if (!selectedAccount) {
      return "Счёт списания не найден.";
    }

    if (currency !== selectedAccount.currency) {
      return "Валюта перевода должна совпадать с валютой выбранного счёта.";
    }

    if (parsedAmount > selectedAccount.balance) {
      return "На счёте недостаточно средств для перевода.";
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSuccess(true);
    setRecipientAccount("");
    setAmount("");
    setNote("");
  };

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
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "32px",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: colors.primaryDark,
                marginBottom: "8px",
              }}
            >
              Перевод с карты на карту
            </h1>

            <p
              style={{
                color: colors.gray600,
                fontSize: "14px",
              }}
            >
              Заполните данные перевода и проверьте сумму перед отправкой.
            </p>
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
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: colors.success + "10",
                border: `1px solid ${colors.success}`,
                color: colors.success,
                textAlign: "center",
                fontSize: "13px",
                borderRadius: "6px",
              }}
            >
              Перевод успешно создан. Позже здесь можно будет подключить реальную отправку на backend.
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="fromAccount"
              style={{
                display: "block",
                color: colors.gray800,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Счёт списания
            </label>

            <select
              id="fromAccount"
              value={fromAccountId}
              onChange={(e) => {
                const nextId = e.target.value;
                setFromAccountId(nextId);
                const nextAccount =
                  mockAccounts.find((account) => account.id === nextId) || null;
                setCurrency(nextAccount?.currency ?? "BYN");
              }}
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
              <option value="">Выберите счёт</option>
              {mockAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.title} — {maskAccountNumber(account.accountNumber)} —{" "}
                  {formatMoney(account.balance, account.currency)}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && (
            <div
              style={{
                marginBottom: "20px",
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
                Доступно для перевода
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color:
                    selectedAccount.type === "CREDIT"
                      ? colors.danger
                      : colors.primaryDark,
                }}
              >
                {formatMoney(selectedAccount.balance, selectedAccount.currency)}
              </div>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="recipientAccount"
              style={{
                display: "block",
                color: colors.gray800,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Номер карты или счёта получателя
            </label>
            <input
              id="recipientAccount"
              type="text"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              placeholder="Например, 4319 0000 1234 5678"
              style={{
                display: "block",
                width: "100%",
                padding: "12px 12px",
                border: `1px solid ${colors.gray300}`,
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                boxShadow: "0 0 0 3px rgba(0, 102, 204, 0.1)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 180px",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                htmlFor="amount"
                style={{
                  display: "block",
                  color: colors.gray800,
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Сумма
              </label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 12px",
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(0, 102, 204, 0.1)",
                }}
              />
            </div>

            <div >
              <label
                htmlFor="currency"
                style={{
                  display: "inline",
                  color: colors.gray800,
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Валюта
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                style={{
                  display: "float",
                  width: "70%",
                  padding: "12px",
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "white",
                }}
              >
                {availableCurrencies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="note"
              style={{
                display: "block",
                color: colors.gray800,
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Примечание
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Назначение платежа"
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                border: `1px solid ${colors.gray300}`,
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                boxShadow: "0 0 0 3px rgba(0, 102, 204, 0.1)",
              }}
            />
          </div>

          <button
            type="submit"
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
            Перевести
          </button>
        </form>
      </div>
    </div>
  );
}