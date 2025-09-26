"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type props = {
  className?: string;
};

export const ThemeToggle = ({ className }: props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
      return;
    }
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
      return;
    }

    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const changeTheme = () => {
    if (!buttonRef.current) return;
    const dark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={changeTheme}
      className={cn(className)}
      aria-label={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
      title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkMode ? <SunDim /> : <Moon />}
    </button>
  );
};
