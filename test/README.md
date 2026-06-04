# OneClickGit

Upload files and entire folder structures to GitHub — no Git commands, no cloning, no pull requests. Built for beginners who just want to put files in an existing repository.

![OneClickGit](public/oneclickgit.svg)

## Features

- **GitHub sign-in** via OAuth Device Flow (secure, desktop-friendly)
- **Repository & branch** pickers with search
- **Files or folder** upload — preserves full nested structure
- **Fast scanning** — Rust-powered recursive scan for thousands of files
- **Reliable uploads** — parallel uploads with automatic retries
- **Optional settings** — skip hidden files, respect `.gitignore`, overwrite, subfolder prefix
- **Modern UI** — light/dark mode, minimal Linear/Vercel-inspired design

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri)
- Windows: [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually preinstalled on Windows 11)

## GitHub OAuth setup (one-time)

OneClickGit uses **OAuth Device Flow** — the same flow used by `gh` CLI and VS Code. You do **not** need a custom URL scheme (`oneclickgit://`) and the callback URL is **not** used during sign-in.

1. Go to [GitHub → Settings → Developer settings → **OAuth Apps** → New](https://github.com/settings/applications/new).
   - Create an **OAuth App**, not a "GitHub App" (those are different).
2. Fill in the form (values below are placeholders GitHub requires; Device Flow ignores the callback):
   - **Application name:** `OneClickGit`
   - **Homepage URL:** `http://localhost`
   - **Authorization callback URL:** `http://localhost`
3. Click **Register application**, then open the app’s settings.
4. Enable **Device Flow** (checkbox). Without this, sign-in will fail.
5. Copy the **Client ID** only (no client secret required for Device Flow).
6. Create a `.env` file from the example:

```bash
cp .env.example .env
```

7. Create `.env` from `.env.example` and set your Client ID (baked in at build time):

```
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

Rebuild after changing this value.

## Development

```bash
npm install
npm run tauri dev
```

## Production build (`.exe` / installer)

### 1. Configure OAuth (required before build)

Your GitHub Client ID is baked in at compile time. Create `.env` in the project root:

```
VITE_GITHUB_CLIENT_ID=your_oauth_client_id_here
```

### 2. Custom app icon (optional)

Prepare **one square PNG** (recommended **1024×1024**, minimum 512×512) with your logo on a solid or transparent background.

From the project root, generate all Windows/macOS/Linux icon files:

```bash
npm run tauri icon path/to/your-icon.png
```

That overwrites `src-tauri/icons/` (`icon.ico`, `icon.icns`, PNG sizes, etc.). Tauri uses these automatically via `tauri.conf.json`.

To only change the window/taskbar icon on Windows, `src-tauri/icons/icon.ico` is the important file (the command above creates it).

### 3. Build

```bash
npm install
npm run tauri build
```

First build can take several minutes (Rust compile). Later builds are faster.

### 4. Where to find the output (Windows)

| What | Path |
|------|------|
| **Portable `.exe`** | `src-tauri\target\release\oneclickgit.exe` |
| **NSIS installer** (recommended for sharing) | `src-tauri\target\release\bundle\nsis\OneClickGit_*_x64-setup.exe` |
| **MSI installer** | `src-tauri\target\release\bundle\msi\OneClickGit_*_x64_en-US.msi` |

Ship the **setup `.exe`** from `bundle\nsis\` for most users (installs shortcuts + uninstaller). Ship **`oneclickgit.exe`** alone if you want a portable app (WebView2 must be installed on the PC).

### 5. Distributing

- Test the built app on a machine that did **not** have the dev environment (clean Windows 11 usually works; older Windows may need [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)).
- Do **not** commit `.env` — only the built app contains the Client ID.
- If you change the icon or Client ID, run `npm run tauri build` again.

## Workflow

1. Sign in with GitHub
2. Select a repository and branch
3. Choose **Files** or **Folder**
4. Pick what to upload
5. Set a **commit message**
6. Click **Upload to GitHub**

Uploads use GitHub's **Git Data API** — up to 100 files per commit, 16 parallel blob uploads — instead of one commit per file.

## Limits

- Individual files must be under GitHub's **100 MB** limit per file
- Very large batches may take time due to GitHub API rate limits; the app retries failed files automatically

## Tech stack

- **Tauri 2** — desktop shell, native file dialogs, secure token storage
- **React + TypeScript + Vite** — UI
- **Tailwind CSS 4** — styling
- **Rust** — file scanning and base64 encoding

## License

MIT
