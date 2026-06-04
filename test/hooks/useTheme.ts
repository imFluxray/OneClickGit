import { useEffect, useState } from "react";
import type { AppSettings } from "../lib/types";

export function useTheme(theme: AppSettings["theme"]) {
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const next =
        theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : theme;
      setResolved(next);
      document.documentElement.setAttribute("data-theme", next);
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return resolved;
}
