import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ReadingScale = "small" | "normal" | "large";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  readingScale: ReadingScale;
  setReadingScale: (scale: ReadingScale) => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (!switchable) return defaultTheme;
    return (localStorage.getItem("dse-physics-theme") as Theme) || defaultTheme;
  });
  const [readingScale, setReadingScale] = useState<ReadingScale>(() => {
    if (!switchable) return "normal";
    return (localStorage.getItem("dse-physics-reading-scale") as ReadingScale) || "normal";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.readingScale = readingScale;

    if (switchable) {
      localStorage.setItem("dse-physics-theme", theme);
      localStorage.setItem("dse-physics-reading-scale", readingScale);
    }
  }, [theme, readingScale, switchable]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme(previous => (previous === "light" ? "dark" : "light")),
        readingScale,
        setReadingScale,
        switchable,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
