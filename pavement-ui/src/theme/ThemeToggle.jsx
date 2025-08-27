import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "modern";
    return localStorage.getItem("theme") || "modern";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const retro = theme === "retro";
  const next = retro ? "modern" : "retro";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-pressed={retro}
      aria-label={retro ? "Switch to modern theme" : "Switch to retro theme"}
      title={retro ? "Switch to modern theme" : "Switch to retro theme"}
    >
      {retro ? "🕹️ Retro ON" : "🕹️ Retro OFF"}
    </button>
  );
}

