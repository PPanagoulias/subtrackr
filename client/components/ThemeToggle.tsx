"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(function () {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground shadow-sm hover:bg-muted-background"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}