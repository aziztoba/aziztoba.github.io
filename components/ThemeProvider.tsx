"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultTheme, themes, type Theme } from "../lib/themes";
const Context = createContext<{ theme: Theme; setTheme: (id: string) => void }>(
  { theme: defaultTheme, setTheme: () => {} },
);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, set] = useState(defaultTheme);
  const apply = (id: string) => {
    const next = themes.find((t) => t.id === id);
    if (next) {
      set(next);
      try {
        localStorage.setItem("aziz-theme", id);
      } catch {}
    }
  };
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aziz-theme");
      if (saved) set(themes.find((t) => t.id === saved) || defaultTheme);
    } catch {}
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.style.colorScheme = theme.light ? "light" : "dark";
    Object.entries({
      bg: theme.bg,
      ink: theme.fg,
      accent: theme.accent,
      dim: theme.dim,
      line: theme.line,
      kw: theme.keyword,
      str: theme.string,
      num: theme.number,
    }).forEach(([k, v]) => root.style.setProperty("--" + k, v));
  }, [theme]);
  return (
    <Context.Provider value={{ theme, setTheme: apply }}>
      {children}
    </Context.Provider>
  );
}
export const useTheme = () => useContext(Context);
export function useReducedMotion() {
  const [reduced, set] = useState(false);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    set(m.matches);
    const update = () => set(m.matches);
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}
