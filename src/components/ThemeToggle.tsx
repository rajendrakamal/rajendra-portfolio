import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useStrings } from "../i18n/strings";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const s = useStrings();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? s.theme.toLight : s.theme.toDark}
      aria-pressed={isDark}
      className="icon-btn"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
