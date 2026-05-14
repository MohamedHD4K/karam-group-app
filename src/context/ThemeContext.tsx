import { createContext, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "light" ? v : null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
