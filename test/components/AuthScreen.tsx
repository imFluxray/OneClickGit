import { Loader2 } from "lucide-react";
import { GitHubIcon } from "./GitHubIcon";
import { Button } from "./ui/Button";

interface AuthScreenProps {
  onSignIn: () => void;
  loading: boolean;
  error: string | null;
  deviceCode: string | null;
  statusMessage: string | null;
}

export function AuthScreen({
  onSignIn,
  loading,
  error,
  deviceCode,
  statusMessage,
}: AuthScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] px-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-[var(--border)] mb-6 mx-auto">
          <GitHubIcon className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-semibold text-center tracking-tight">
          OneClickGit
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)] text-center leading-relaxed">
          Upload files and folders to GitHub — no Git commands required.
        </p>

        <div className="mt-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
          {deviceCode && (
            <div className="p-4 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--muted)] text-center animate-fade-in">
              <p className="text-xs text-[var(--fg-muted)] mb-1">
                Enter this code on GitHub
              </p>
              <p className="text-2xl font-semibold tracking-widest font-mono">
                {deviceCode}
              </p>
              <p className="mt-2 text-xs text-[var(--fg-muted)]">
                Browser should open automatically
              </p>
            </div>
          )}

          {statusMessage && (
            <p className="text-xs text-center text-[var(--fg-muted)] flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {statusMessage}
            </p>
          )}

          {error && (
            <p className="text-xs text-center text-red-500 leading-relaxed">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
            onClick={onSignIn}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <GitHubIcon className="w-4 h-4" />
                Sign in with GitHub
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
