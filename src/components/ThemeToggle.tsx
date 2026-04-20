import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary transition-all duration-200 ease-spring"
    >
      {mounted ? (
        isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />
      ) : (
        <Sun size={18} strokeWidth={1.75} className="opacity-0" />
      )}
    </button>
  );
};
