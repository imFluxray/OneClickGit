interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-9 h-5 rounded-full border transition-colors duration-200 shrink-0 ${
          checked
            ? "bg-[var(--fg)] border-[var(--fg)]"
            : "bg-[var(--muted)] border-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-[var(--bg)] transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-[var(--fg)]">{label}</span>
        {description && (
          <span className="text-xs text-[var(--fg-muted)] leading-relaxed">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
