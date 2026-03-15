"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const setThemeOnDocument = (theme: ThemeMode) => {
  document.documentElement.dataset.theme = theme;
};

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    setThemeOnDocument(initial);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("theme")) return;
      const next = media.matches ? "dark" : "light";
      setTheme(next);
      setThemeOnDocument(next);
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    setThemeOnDocument(nextTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme} type="button">
      <span className="theme-toggle-track">
        <span className={`theme-toggle-thumb ${theme === "dark" ? "is-dark" : ""}`} />
      </span>
      <span className="theme-toggle-label">
        {mounted ? theme : "theme"}
      </span>
    </button>
  );
};

export default ThemeToggle;
