import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  loading,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.hint?.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-left transition-colors hover:border-[var(--border-strong)] disabled:opacity-50"
      >
        <span className={selected ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>
          {loading ? "Loading…" : selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--fg-muted)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg animate-fade-in overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
            <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--fg-muted)]"
            />
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-[var(--fg-muted)]">
                No matches
              </li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--muted)] transition-colors ${
                      opt.value === value ? "bg-[var(--muted)] font-medium" : ""
                    }`}
                  >
                    <span className="block truncate">{opt.label}</span>
                    {opt.hint && (
                      <span className="block text-xs text-[var(--fg-muted)] truncate">
                        {opt.hint}
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
