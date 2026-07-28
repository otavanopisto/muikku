export const muikkuTokens = {
  light: {
    body: "#ffffff",
    text: "#111827",
    dimmed: "#6b7280",
    default: "#ffffff",
    defaultHover: "#f3f4f6",
    defaultBorder: "#e5e7eb",
    surface: "#ffffff",
  },
  dark: {
    body: "#0B1120", // from mockup
    text: "#F8FAFC",
    dimmed: "#94A3B8",
    default: "#1E293B", // elevated panels
    defaultHover: "#334155",
    defaultBorder: "#334155",
    surface: "#1E293B",
  },
  accent: "#3b0a0a", // magenta; same both schemes unless design says otherwise
} as const;
