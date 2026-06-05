<div align="center">

<img src="https://raw.githubusercontent.com/imFluxray/OneClickGit/main/assets/logo.svg" alt="OneClickGit Logo" width="120" height="120" />

<h1>OneClickGit</h1>

<p><strong>Upload files and folders to GitHub with a single click.</strong></p>


<p><em>No Git. No terminal. No stress. Just click.</em></p>

<a href="https://www.producthunt.com/products/focuznow/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-focuznow" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1231966&theme=light" alt="Focuznow - Get&#0032;back&#0032;your&#0032;hours | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

[![Release](https://img.shields.io/github/v/release/imFluxray/OneClickGit?include_prereleases&style=for-the-badge&color=0969da&logo=github)](https://github.com/imFluxray/OneClickGit/releases)
[![Downloads](https://img.shields.io/github/downloads/imFluxray/OneClickGit/total?style=for-the-badge&color=238636&logo=github)](https://github.com/imFluxray/OneClickGit/releases)
[![Stars](https://img.shields.io/github/stars/imFluxray/OneClickGit?style=for-the-badge&color=f0c418&logo=github)](https://github.com/imFluxray/OneClickGit/stargazers)
[![License](https://img.shields.io/badge/license-MIT-da3633?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-0078d4?style=for-the-badge&logo=windows)](https://github.com/imFluxray/OneClickGit/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge&logo=git)](CONTRIBUTING.md)

<br />

[🚀 Download Now](#-installation) · [📖 Documentation](#-usage-walkthrough) · [🐛 Report a Bug](https://github.com/imFluxray/OneClickGit/issues) · [💡 Request a Feature](https://github.com/imFluxray/OneClickGit/issues) 

</div>

---

## 📐 How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OneClickGit Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │  🔐 Log  │────▶│ 📁 Pick  │────▶│ 🎯 Pick  │────▶│ 📤 Drop  │
   │   In     │     │  Repo    │     │  Branch  │     │  Files   │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                            │
   ┌──────────┐     ┌──────────┐     ┌──────────┐          │
   │  ✅ Done │◀────│ 🚀 Push  │◀────│ ✏️ Commit│◀─────────┘
   │  Merged! │     │ to GitHub│     │ Message  │
   └──────────┘     └──────────┘     └──────────┘

   ════════════════════════════════════════════════════════════
   ⚡  Total time from open to merged:  < 30 seconds
   ════════════════════════════════════════════════════════════
```

---

## ✨ Features

| Icon | Feature | Description |
|------|---------|-------------|
| 🔐 | **GitHub OAuth** | Secure single-click GitHub login — no tokens to copy-paste |
| 📦 | **Repository Selector** | Browse and select any repo you have access to |
| 🌿 | **Branch Selector** | Target any branch — `main`, `dev`, feature branches, all of it |
| 📂 | **Folder Upload** | Upload entire folder structures in one go |
| 🗂️ | **Nested Structure Preservation** | Deep folder trees arrive on GitHub exactly as they are on your machine |
| 🖱️ | **Drag & Drop** | Drag files or folders directly into the app window |
| 📊 | **Upload Progress Tracking** | Real-time per-file and overall progress bars |
| ⚡ | **Upload Speed Tracking** | Live speed indicator so you know it's actually doing something |
| 🤖 | **Auto Commit Messages** | Sensible commit messages generated automatically |
| ✏️ | **Custom Commit Messages** | Write your own message when you actually care |
| 👻 | **Skip Hidden Files** | Automatically ignores `.DS_Store`, `Thumbs.db`, and other gremlins |
| 📋 | **`.gitignore` Support** | Respects your project's `.gitignore` rules out of the box |
| 📁 | **Upload Into Subfolders** | Target a specific subdirectory in your repo as the upload destination |
| 🔁 | **Overwrite Existing Files** | Replace existing files without manually deleting them first |
| 🏎️ | **Optimized Upload Engine** | Batched API calls for fast, reliable uploads even on large folders |

---

## 🤔 Why OneClickGit?

> **"Why not just use GitHub's website?"** — someone, probably

Great question. Here's why OneClickGit slaps harder:

| Feature | GitHub Web Upload | OneClickGit |
|--------|:-----------------:|:-----------:|
| Upload individual files | ✅ | ✅ |
| Upload entire folders | ❌ | ✅ |
| Preserve nested folder structure | ❌ | ✅ |
| Drag and drop support | ⚠️ Limited | ✅ |
| Upload more than 100 files at once | ❌ | ✅ |
| Custom commit messages | ✅ | ✅ |
| Auto-generated commit messages | ❌ | ✅ |
| Respect `.gitignore` | ❌ | ✅ |
| Skip hidden files automatically | ❌ | ✅ |
| Upload into a specific subfolder | ❌ | ✅ |
| Upload progress bar | ❌ | ✅ |
| Upload speed indicator | ❌ | ✅ |
| Requires Git installed | ❌ | ❌ |
| Requires terminal knowledge | ❌ | ❌ |

---

## 🗂️ Folder Structure Preservation

OneClickGit keeps your folder hierarchy intact — no flattening, no chaos.

**What you have locally:**
```
my-project/
├── index.html
├── assets/
│   ├── logo.png
│   └── banner.jpg
├── css/
│   ├── main.css
│   └── theme/
│       ├── dark.css
│       └── light.css
└── js/
    ├── app.js
    └── utils/
        └── helpers.js
```

**What lands on GitHub:**
```
your-repo/
└── my-project/               ← uploaded subfolder (if specified)
    ├── index.html
    ├── assets/
    │   ├── logo.png
    │   └── banner.jpg
    ├── css/
    │   ├── main.css
    │   └── theme/
    │       ├── dark.css
    │       └── light.css
    └── js/
        ├── app.js
        └── utils/
            └── helpers.js
```

✅ Every file. Every subfolder. Exactly where it should be. First try.

---

## 💾 Installation

> **⚠️ OneClickGit currently supports Windows only.** macOS and Linux builds are planned — see the [Roadmap](#️-roadmap).

<details>
<summary><strong>🪟 Windows</strong></summary>

<br/>

1. Go to the [Releases](https://github.com/imFluxray/OneClickGit/releases/latest) page
2. Download `OneClickGit-Setup-x.x.x.exe`
3. Run the installer
4. Launch **OneClickGit** from the Start Menu or Desktop shortcut

> **Note:** Windows may show a SmartScreen warning since the app isn't code-signed yet. Click **More Info → Run Anyway** to proceed.

</details>

</details>

<details>
<summary><strong>🛠️ Build From Source</strong></summary>

<br/>

**Prerequisites:** Node.js 18+, npm or yarn

```bash
# Clone the repository
git clone https://github.com/imFluxray/OneClickGit.git
cd OneClickGit

# Install dependencies
npm install

# Start in development mode
npm run tauri dev

# Build for your current platform
npm run tauri build
```

Built binaries will appear in the `dist/` folder.

</details>

---

## 🚀 Usage Walkthrough

Follow these steps to go from zero to committed in under a minute:

**Step 1 — Log In**
> Click **Sign in with GitHub**. OneClickGit will open your browser for OAuth authentication. No passwords stored. No tokens to manage.

**Step 2 — Select a Repository**
> Choose any repository from the dropdown. Public and private repos are both supported based on your GitHub permissions.

**Step 3 — Select a Branch**
> Pick your target branch from the branch selector. Defaults to `main`, but you can target any branch.

**Step 4 — Choose Files or a Folder**
> - Click **Add Files** to select individual files, or
> - Click **Add Folder** to select an entire directory, or
> - Simply **drag and drop** files or folders directly into the app window.

**Step 5 — (Optional) Configure Upload Settings**
> Set a destination subfolder, toggle `.gitignore` respect, or choose whether to overwrite existing files.

**Step 6 — Write or Generate a Commit Message**
> Type your own commit message or let OneClickGit auto-generate one based on the files being uploaded.

**Step 7 — Click Upload**
> Hit the big **Upload** button. Watch the progress bar. That's literally it.

**Step 8 — You're Done**
> Your files are now on GitHub. Go touch grass.

---

## ⚙️ Settings

OneClickGit includes a built-in Settings panel with the following options:

| Setting | Default | Description |
|--------|---------|-------------|
| **Default Branch** | `main` | Pre-select a branch on launch |
| **Auto-generate Commit Message** | `On` | Generate commit messages automatically |
| **Skip Hidden Files** | `On` | Ignore files starting with `.` |
| **Respect `.gitignore`** | `On` | Parse and apply `.gitignore` rules before upload |
| **Overwrite Existing Files** | `Off` | Replace files that already exist in the repo |
| **Default Upload Subfolder** | *(empty)* | Pre-fill the destination subfolder field |
| **Theme** | `System` | Light, Dark, or follow system preference |
| **Launch at Login** | `Off` | Start OneClickGit automatically on system login |
| **Show Upload Speed** | `On` | Display live transfer speed during upload |

---

## ❓ FAQ

<details>
<summary><strong>Does OneClickGit require Git to be installed?</strong></summary>

<br/>

Nope. Not at all. That's the whole point. OneClickGit talks directly to the GitHub API — your machine doesn't need Git, a terminal, or any developer tooling whatsoever.

</details>

<details>
<summary><strong>Is my GitHub token stored securely?</strong></summary>

<br/>

Yes. OAuth tokens are stored in your operating system's secure credential store (Credential Manager on Windows). They are never written to plain text files or sent anywhere other than GitHub's API.

</details>

<details>
<summary><strong>What's the maximum upload size?</strong></summary>

<br/>

OneClickGit uses the GitHub Contents API, which has a **100 MB per-file limit**. For files larger than 100 MB, you'll need to use Git LFS or the standard Git CLI. Total repo size limits are governed by GitHub's standard policies.

</details>

<details>
<summary><strong>Can I upload to private repositories?</strong></summary>

<br/>

Yes. As long as your GitHub account has write access to the repository, OneClickGit can upload to it — public or private.

</details>

<details>
<summary><strong>Does it work with GitHub Enterprise?</strong></summary>

<br/>

GitHub Enterprise support is on the roadmap! It's not available in the current release. Track progress in [#42](https://github.com/imFluxray/OneClickGit/issues/42).

</details>

<details>
<summary><strong>What happens if an upload fails halfway through?</strong></summary>

<br/>

Files that were successfully uploaded before the failure will remain in the repo. OneClickGit will display which files succeeded and which failed. You can retry the failed files without re-uploading everything.

</details>

<details>
<summary><strong>Will macOS and Linux be supported?</strong></summary>

<br/>

Yes, eventually! Cross-platform support is planned. Windows is the focus for now while the core feature set is being built out. Star the repo and watch for release announcements.

</details>

<details>
<summary><strong>Can I use this for CI/CD or automation?</strong></summary>

<br/>

OneClickGit is a desktop GUI app intended for manual use. For automation, scripting, or CI/CD workflows, the [GitHub CLI](https://cli.github.com/) or GitHub Actions are better-suited tools.

</details>

---

## 🗺️ Roadmap

### ✅ Shipped

- [x] GitHub OAuth login
- [x] Repository & branch selector
- [x] Single file upload
- [x] Folder upload with structure preservation
- [x] Drag and drop support
- [x] Auto-generated commit messages
- [x] Custom commit messages
- [x] Upload progress tracking
- [x] Upload speed indicator
- [x] Skip hidden files
- [x] `.gitignore` support
- [x] Upload into subfolders
- [x] Overwrite existing files toggle
- [x] Optimized batched upload engine

### 🚧 In Progress

- [ ] Upload history / recent uploads log
- [ ] Multi-account GitHub support
- [x] Dark/light/system theme toggle

### 📋 Planned

- [ ] macOS support
- [ ] Linux support
- [ ] GitHub Enterprise support
- [ ] GitLab support
- [ ] Gitea / self-hosted support
- [ ] File conflict preview before overwriting
- [ ] Undo last upload (revert commit)
- [ ] Scheduled / automatic uploads
- [ ] CLI companion tool
- [ ] Browser extension
- [ ] Mobile app (iOS / Android)

> 💡 Have an idea? [Open a feature request](https://github.com/imFluxray/OneClickGit/issues/new?template=feature_request.md) — we actually read them.

---

## 🤝 Contributing

Contributions are what make open source worth waking up for. Any contribution you make is genuinely appreciated.

```
Fork it → Branch it → Build it → PR it → Ship it 🚀
```

**Getting started:**

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/OneClickGit.git
cd OneClickGit

# 2. Create a feature branch
git checkout -b feature/your-amazing-feature

# 3. Install dependencies and run in dev mode
npm install
npm run tauri dev

# 4. Make your changes, then commit
git commit -m "feat: add your amazing feature"

# 5. Push to your fork
git push origin feature/your-amazing-feature

# 6. Open a Pull Request on GitHub
```

**Before submitting a PR, please:**

- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm test` and ensure all tests pass
- [ ] Update documentation if you're changing behavior
- [ ] Keep PRs focused — one feature or fix per PR

**Ways to contribute beyond code:**

- 🐛 [Report bugs](https://github.com/imFluxray/OneClickGit/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/imFluxray/OneClickGit/issues/new?template=feature_request.md)
- 📖 Improve documentation
- 🌍 Add or improve translations
- ⭐ Star the repo (the most underrated contribution)

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full details.

```
MIT License — do whatever you want with it.
Just don't remove the license header. That's it. That's the rule.
```

---

## 🙏 Acknowledgements

- [Electron](https://www.electronjs.org/) — for making cross-platform desktop apps with web tech possible
- [Octokit](https://github.com/octokit/octokit.js) — for the excellent GitHub API client
- [GitHub REST API](https://docs.github.com/en/rest) — for existing and being documented well
- Every open-source project that made this one possible

---

<div align="center">

<br />

**If OneClickGit saved you from opening a terminal today, consider leaving a ⭐**

*It takes 2 seconds and it means the world to open-source maintainers.*

[![Star on GitHub](https://img.shields.io/github/stars/imFluxray/OneClickGit?style=social)](https://github.com/imFluxray/OneClickGit)

<br />

Made with ❤️ and a deep personal hatred of typing `git push`

<sub>© 2026 OneClickGit Contributors · <a href="LICENSE">MIT License</a> · <a href="https://github.com/imFluxray/OneClickGit/issues">Issues</a> · <a href="https://github.com/imFluxray/OneClickGit/discussions">Discussions</a></sub>

</div>
