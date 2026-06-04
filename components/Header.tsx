import { LogOut, Moon, Settings, Sun } from "lucide-react";
import type { GitHubUser } from "../lib/types";
import { Button } from "./ui/Button";

interface HeaderProps {
  user: GitHubUser;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
}

export function Header({
  user,
  theme,
  onToggleTheme,
  onOpenSettings,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={user.avatar_url}
          alt=""
          className="w-9 h-9 rounded-full border border-[var(--border)]"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user.login}</p>
          <p className="text-xs text-[var(--fg-muted)]">Signed in with GitHub</p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={onOpenSettings} aria-label="Settings">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onSignOut} aria-label="Sign out">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
