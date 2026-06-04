import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { UploadProgress as ProgressState } from "../lib/types";
import { formatBytes, formatPercent } from "../lib/format";

interface UploadProgressProps {
  progress: ProgressState;
}

export function UploadProgressPanel({ progress }: UploadProgressProps) {
  if (progress.status === "idle") return null;

  const percent = formatPercent(progress.completed, progress.total);
  const isActive =
    progress.status === "uploading" || progress.status === "scanning";

  return (
    <section className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">
          Progress
        </span>
        <span className="text-xs font-mono text-[var(--fg-muted)]">{percent}%</span>
      </div>

      <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
        <div
          className="h-full bg-[var(--fg)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {isActive && (
        <div className="mt-3 flex items-start gap-2 text-xs text-[var(--fg-muted)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p>
              {progress.status === "scanning"
                ? "Scanning files…"
                : `${progress.completed} of ${progress.total} files`}
            </p>
            {progress.currentFile && (
              <p className="mt-0.5 truncate font-mono text-[10px] opacity-80">
                {progress.currentFile}
              </p>
            )}
            {progress.totalBytes > 0 && (
              <p className="mt-1">
                {formatBytes(progress.bytesUploaded)} /{" "}
                {formatBytes(progress.totalBytes)}
              </p>
            )}
          </div>
        </div>
      )}

      {progress.status === "success" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{progress.message}</span>
        </div>
      )}

      {progress.status === "error" && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{progress.message}</span>
        </div>
      )}
    </section>
  );
}
