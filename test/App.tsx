import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
  FileStack,
  FolderOpen,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { Header } from "./components/Header";
import { SearchableSelect } from "./components/SearchableSelect";
import { SettingsPanel } from "./components/SettingsPanel";
import { UploadProgressPanel } from "./components/UploadProgress";
import { Button } from "./components/ui/Button";
import { useTheme } from "./hooks/useTheme";
import { listBranches, listRepositories } from "./lib/github/api";
import {
  fetchGitHubUser,
  openDeviceVerification,
  pollForAccessToken,
  requestDeviceCode,
} from "./lib/github/auth";
import { uploadFiles } from "./lib/github/upload";
import { formatBytes } from "./lib/format";
import { GITHUB_CLIENT_CONFIGURED, GITHUB_CLIENT_ID } from "./lib/config";
import {
  clearAuth,
  getAccessToken,
  getSettings,
  getStoredUser,
  saveSettings,
  setAccessToken,
  setStoredUser,
} from "./lib/storage";
import type {
  AppSettings,
  GitHubUser,
  Repository,
  ScannedFile,
  UploadMode,
  UploadProgress,
} from "./lib/types";
import { DEFAULT_SETTINGS } from "./lib/types";

const idleProgress: UploadProgress = {
  status: "idle",
  currentFile: "",
  completed: 0,
  total: 0,
  bytesUploaded: 0,
  totalBytes: 0,
  message: "",
};

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [deviceCode, setDeviceCode] = useState<string | null>(null);

  const [repos, setRepos] = useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [uploadMode, setUploadMode] = useState<UploadMode>("files");
  const [selectionRoots, setSelectionRoots] = useState<
    { path: string; isFolder: boolean }[]
  >([]);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [scanning, setScanning] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [commitMessage, setCommitMessage] = useState("Upload via OneClickGit");
  const [progress, setProgress] = useState<UploadProgress>(idleProgress);

  const resolvedTheme = useTheme(settings.theme);

  const totalSize = useMemo(
    () => scannedFiles.reduce((s, f) => s + f.size, 0),
    [scannedFiles],
  );

  const repo = repos.find((r) => r.full_name === selectedRepo);

  useEffect(() => {
    (async () => {
      const [storedToken, storedUser, storedSettings] = await Promise.all([
        getAccessToken(),
        getStoredUser(),
        getSettings(),
      ]);
      setSettings(storedSettings);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    })();
  }, []);

  useEffect(() => {
    if (!token) return;
    setReposLoading(true);
    listRepositories(token)
      .then(setRepos)
      .catch((e) =>
        setProgress({
          ...idleProgress,
          status: "error",
          message: e instanceof Error ? e.message : "Failed to load repos",
        }),
      )
      .finally(() => setReposLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !repo) {
      setBranches([]);
      return;
    }
    setBranchesLoading(true);
    listBranches(token, repo.owner.login, repo.name)
      .then((names) => {
        setBranches(names);
        setSelectedBranch((prev) =>
          prev && names.includes(prev) ? prev : repo.default_branch,
        );
      })
      .catch(() => setBranches([repo.default_branch]))
      .finally(() => setBranchesLoading(false));
  }, [token, repo?.full_name]);

  const rescan = useCallback(async () => {
    if (selectionRoots.length === 0) {
      setScannedFiles([]);
      return;
    }
    setScanning(true);
    try {
      const files = await invoke<ScannedFile[]>("scan_selection", {
        roots: selectionRoots,
        skipHidden: settings.skipHidden,
        respectGitignore: settings.respectGitignore,
        pathPrefix: settings.pathPrefix.trim() || null,
      });
      setScannedFiles(files);
    } catch (e) {
      setScannedFiles([]);
      setProgress({
        ...idleProgress,
        status: "error",
        message: e instanceof Error ? e.message : "Scan failed",
      });
    } finally {
      setScanning(false);
    }
  }, [selectionRoots, settings.skipHidden, settings.respectGitignore, settings.pathPrefix]);

  useEffect(() => {
    rescan();
  }, [rescan]);

  const handleSignIn = async () => {
    if (!GITHUB_CLIENT_CONFIGURED) {
      setAuthError(
        "This build has no GitHub Client ID. Set VITE_GITHUB_CLIENT_ID in .env and rebuild.",
      );
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    setDeviceCode(null);

    try {
      const flow = await requestDeviceCode(GITHUB_CLIENT_ID);
      setDeviceCode(flow.userCode);
      setAuthStatus("Opening GitHub in your browser…");
      await openDeviceVerification(flow.verificationUri);

      const accessToken = await pollForAccessToken(
        GITHUB_CLIENT_ID,
        flow.deviceCode,
        flow.interval,
        flow.expiresAt,
        setAuthStatus,
      );

      const ghUser = await fetchGitHubUser(accessToken);
      await setAccessToken(accessToken);
      await setStoredUser(ghUser);
      setToken(accessToken);
      setUser(ghUser);
      setDeviceCode(null);
      setAuthStatus(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed";
      if (msg.includes("Could not find") || msg.toLowerCase().includes("invoke")) {
        setAuthError(
          "Run the desktop app with: npm run tauri dev — not npm run dev in the browser.",
        );
      } else {
        setAuthError(msg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
    setRepos([]);
    setSelectedRepo("");
    setSelectionRoots([]);
    setScannedFiles([]);
    setProgress(idleProgress);
  };

  const handleSelectItems = async () => {
    if (uploadMode === "folder") {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Choose a folder to upload",
      });
      if (!selected) return;
      const path = typeof selected === "string" ? selected : selected;
      setSelectionRoots([{ path, isFolder: true }]);
    } else {
      const selected = await open({
        multiple: true,
        title: "Choose files to upload",
      });
      if (!selected) return;
      const paths = Array.isArray(selected) ? selected : [selected];
      setSelectionRoots(paths.map((path) => ({ path, isFolder: false })));
    }
    setProgress(idleProgress);
  };

  const handleClearSelection = () => {
    setSelectionRoots([]);
    setScannedFiles([]);
    setProgress(idleProgress);
  };

  const handleUpload = async () => {
    if (!token || !repo || !selectedBranch || scannedFiles.length === 0) return;

    setUploading(true);
    setProgress({
      status: "uploading",
      currentFile: "",
      completed: 0,
      total: scannedFiles.length,
      bytesUploaded: 0,
      totalBytes: totalSize,
      message: "",
    });

    try {
      const result = await uploadFiles(
        {
          token,
          owner: repo.owner.login,
          repo: repo.name,
          branch: selectedBranch,
          overwrite: settings.overwriteExisting,
          commitMessage,
        },
        scannedFiles,
        {
          onProgress: (completed, total, currentFile, bytesDone, totalBytes) => {
            setProgress({
              status: "uploading",
              completed,
              total,
              currentFile,
              bytesUploaded: bytesDone,
              totalBytes,
              message: "",
            });
          },
        },
      );

      const skipNote =
        result.skipped > 0
          ? ` Skipped ${result.skipped} file${result.skipped === 1 ? "" : "s"} already on GitHub.`
          : "";

      if (result.failed.length > 0 && result.succeeded === 0) {
        const first = result.failed[0];
        setProgress({
          status: "error",
          completed: result.succeeded,
          total: scannedFiles.length,
          currentFile: "",
          bytesUploaded: 0,
          totalBytes: totalSize,
          message: `Uploaded ${result.succeeded} files. ${result.failed.length} failed. First error: ${first.error}${skipNote}`,
        });
      } else if (result.failed.length > 0) {
        setProgress({
          status: "success",
          completed: result.succeeded,
          total: scannedFiles.length,
          currentFile: "",
          bytesUploaded: totalSize,
          totalBytes: totalSize,
          message: `Uploaded ${result.succeeded} files to ${repo.full_name}. ${result.failed.length} failed.${skipNote}`,
        });
      } else {
        setProgress({
          status: "success",
          completed: scannedFiles.length,
          total: scannedFiles.length,
          currentFile: "",
          bytesUploaded: totalSize,
          totalBytes: totalSize,
          message: `Successfully uploaded ${result.succeeded} file${result.succeeded === 1 ? "" : "s"} to ${repo.full_name}.${skipNote}`,
        });
      }
    } catch (e) {
      setProgress({
        status: "error",
        completed: 0,
        total: scannedFiles.length,
        currentFile: "",
        bytesUploaded: 0,
        totalBytes: totalSize,
        message: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSettingsChange = async (next: AppSettings) => {
    setSettings(next);
    await saveSettings(next);
  };

  const repoOptions = repos.map((r) => ({
    value: r.full_name,
    label: r.full_name,
    hint: r.private ? "Private" : "Public",
  }));

  const branchOptions = branches.map((b) => ({
    value: b,
    label: b,
    hint: b === repo?.default_branch ? "Default branch" : undefined,
  }));

  if (!token || !user) {
    return (
      <AuthScreen
        onSignIn={handleSignIn}
        loading={authLoading}
        error={authError}
        deviceCode={deviceCode}
        statusMessage={authStatus}
      />
    );
  }

  const canUpload =
    !!selectedRepo &&
    !!selectedBranch &&
    commitMessage.trim().length > 0 &&
    scannedFiles.length > 0 &&
    !uploading &&
    !scanning;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <main className="max-w-xl mx-auto px-6 py-8">
        <Header
          user={user}
          theme={resolvedTheme}
          onToggleTheme={() =>
            handleSettingsChange({
              ...settings,
              theme: resolvedTheme === "dark" ? "light" : "dark",
            })
          }
          onOpenSettings={() => setSettingsOpen(true)}
          onSignOut={handleSignOut}
        />

        <section className="space-y-4 animate-fade-in">
          <div>
            <label className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
              Repository
            </label>
            <div className="mt-2">
              <SearchableSelect
                options={repoOptions}
                value={selectedRepo}
                onChange={setSelectedRepo}
                placeholder="Select a repository"
                loading={reposLoading}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
              Branch
            </label>
            <div className="mt-2">
              <SearchableSelect
                options={branchOptions}
                value={selectedBranch}
                onChange={setSelectedBranch}
                placeholder="Select a branch"
                disabled={!selectedRepo}
                loading={branchesLoading}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
              Upload type
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 p-1 rounded-lg border border-[var(--border)] bg-[var(--muted)]">
              {(
                [
                  { id: "files" as const, label: "Files", icon: FileStack },
                  { id: "folder" as const, label: "Folder", icon: FolderOpen },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setUploadMode(id);
                    handleClearSelection();
                  }}
                  className={`flex items-center justify-center gap-2 h-10 rounded-md text-sm font-medium transition-all duration-200 ${
                    uploadMode === id
                      ? "bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] shadow-sm"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
              Commit message
            </label>
            <input
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe this upload"
              disabled={uploading}
              className="mt-2 w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm outline-none focus:border-[var(--border-strong)] transition-colors disabled:opacity-50"
            />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSelectItems}
            disabled={uploading}
          >
            {uploadMode === "folder" ? (
              <>
                <FolderOpen className="w-4 h-4" />
                Choose folder
              </>
            ) : (
              <>
                <FileStack className="w-4 h-4" />
                Choose files
              </>
            )}
          </Button>

          {(selectionRoots.length > 0 || scanning) && (
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3 animate-fade-in">
              <div className="min-w-0">
                {scanning ? (
                  <p className="text-sm flex items-center gap-2 text-[var(--fg-muted)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning…
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      {scannedFiles.length} file
                      {scannedFiles.length === 1 ? "" : "s"} selected
                    </p>
                    <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                      Estimated size: {formatBytes(totalSize)}
                    </p>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                disabled={uploading || scanning}
                aria-label="Clear selection"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={!canUpload}
            onClick={handleUpload}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload to GitHub
              </>
            )}
          </Button>
        </section>

        <UploadProgressPanel progress={progress} />
      </main>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={handleSettingsChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
