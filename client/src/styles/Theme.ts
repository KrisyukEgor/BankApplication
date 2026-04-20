import { colors } from "./colors";

export const theme = {
  typography: {
    regular: "1rem",
    medium: "1.125rem",
    large: "1.25rem",
    xl: "1.5rem",
  },
  borderRadius: "0.375rem",     // 6px
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  spacing: "0.75rem",           // 12px
  fontFamily: "system-ui, -apple-system, sans-serif",
};

export const cssClasses = {
  buttonPrimary: `bg-${colors.primary} text-white`,
  buttonSecondary: `bg-gray100 text-${colors.gray800}`,
  input:
    "block w-full rounded border border-gray300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
  card: `bg-white rounded-lg shadow ${theme.boxShadow} p-4`,
  container: "max-w-md mx-auto mt-8 px-4",
};
