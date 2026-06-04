import { X } from "lucide-react";
import type { AppSettings } from "../lib/types";
import { Button } from "./ui/Button";
import { Toggle } from "./ui/Toggle";

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  const patch = (partial: Partial<AppSettings>) =>
    onChange({ ...settings, ...partial });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
      <div
        className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-slide-up"
        role="dialog"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 id="settings-title" className="text-sm font-semibold">
            Settings
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
              Upload into subfolder (optional)
            </label>
            <input
              value={settings.pathPrefix}
              onChange={(e) => patch({ pathPrefix: e.target.value })}
              placeholder="e.g. uploads/2024"
              className="mt-2 w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm outline-none focus:border-[var(--border-strong)]"
            />
            <p className="mt-1.5 text-xs text-[var(--fg-muted)]">
              Files will be placed inside this folder in the repository.
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-[var(--border)]">
            <Toggle
              checked={settings.skipHidden}
              onChange={(v) => patch({ skipHidden: v })}
              label="Skip hidden files"
              description="Ignore files and folders starting with a dot."
            />
            <Toggle
              checked={settings.respectGitignore}
              onChange={(v) => patch({ respectGitignore: v })}
              label="Skip .gitignore patterns"
              description="Respect .gitignore rules from the selected folder."
            />
            <Toggle
              checked={settings.overwriteExisting}
              onChange={(v) => patch({ overwriteExisting: v })}
              label="Overwrite existing files"
              description="When off, files already in the repo are kept and only new paths are uploaded."
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)]">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
