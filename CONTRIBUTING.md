# 🤝 Contributing to OneClickGit

First off thanks for even considering contributing. OneClickGit is a solo project and every issue filed, suggestion made, or line of code contributed genuinely moves the needle.

This document covers everything you need to know to go from "I want to help" to "my PR just merged."

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Your First Code Contribution](#-your-first-code-contribution)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Coding Standards](#-coding-standards)
- [Commit Message Format](#-commit-message-format)
- [Pull Request Process](#-pull-request-process)
- [What Gets Merged](#-what-gets-merged)

---

## 📜 Code of Conduct

This project follows a simple rule: **be a decent human being.**

- Be respectful in issues, PRs, and discussions
- Assume good intent before assuming bad
- Constructive criticism is welcome; personal attacks are not
- If someone is new, help them don't gatekeep

Violations can result in being blocked from the repository. It's really not complicated.

---

## 💡 Ways to Contribute

You don't have to write code to contribute. All of these are genuinely valuable:

| Type | How |
|------|-----|
| 🐛 **Bug reports** | [Open an issue](https://github.com/imFluxray/oneclickgit/issues/new?template=bug_report.md) with clear reproduction steps |
| 💡 **Feature requests** | [Open an issue](https://github.com/imFluxray/oneclickgit/issues/new?template=feature_request.md) describing the use case |
| 📖 **Documentation** | Fix typos, improve clarity, add examples |
| 🌍 **Translations** | Help make OneClickGit accessible in other languages |
| 🧪 **Testing** | Try beta releases and report what breaks |
| ⭐ **Spreading the word** | Star the repo, share it, tell your friends who hate terminals |
| 💬 **Helping others** | Answer questions in [Discussions](https://github.com/imFluxray/oneclickgit/discussions) |

---

## 🐛 Reporting Bugs

A good bug report saves hours of back-and-forth. Before filing one:

- **Search existing issues** it may already be reported
- **Make sure you're on the latest release** it may already be fixed

When opening a bug report, include:

- **What you were trying to do** clear, step-by-step
- **What you expected to happen**
- **What actually happened** error messages, screenshots, anything
- **Your Windows version** (e.g. Windows 11 22H2)
- **OneClickGit version** (shown in the title bar or About screen)

The more detail, the faster it gets fixed. Vague reports get triaged last.

> Use the [bug report template](https://github.com/imFluxray/oneclickgit/issues/new?template=bug_report.md) it prompts you for all of this automatically.

---

## 💡 Suggesting Features

Feature requests are welcome, especially ones that fit the core mission: **making GitHub uploads simple for non-technical users.**

Before opening a request:

- Check the [Roadmap](README.md#️-roadmap) it might already be planned
- Search [existing issues](https://github.com/imFluxray/oneclickgit/issues) to avoid duplicates

When writing a request, focus on the **use case**, not just the solution:

> ✅ *"I want to be able to see which files already exist in the repo before uploading, so I can decide whether to overwrite them."*
>
> ❌ *"Add a file diff viewer."*

The first tells us the problem. The second assumes a solution. Describe the problem the implementation can be figured out together.

> Use the [feature request template](https://github.com/imFluxray/oneclickgit/issues/new?template=feature_request.md).

---

## 🛠️ Your First Code Contribution

Not sure where to start? Look for issues tagged:

- [`good first issue`](https://github.com/imFluxray/oneclickgit/labels/good%20first%20issue) small, self-contained, well-scoped
- [`help wanted`](https://github.com/imFluxray/oneclickgit/labels/help%20wanted) needs a contributor, open to anyone

If you want to work on something, **leave a comment on the issue first** before writing code. This prevents two people building the same thing simultaneously and lets us align on approach upfront.

---

## 💻 Development Setup

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org/) | 18+ | LTS recommended, for the frontend |
| [Rust](https://rustup.rs/) | stable | Install via rustup |
| Git | Any | Yes, you need Git to contribute to the no-Git app. The irony is noted. |

### Getting Started

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/oneclickgit.git
cd oneclickgit

# 3. Add the upstream remote so you can pull future changes
git remote add upstream https://github.com/imFluxray/oneclickgit.git

# 4. Install frontend dependencies
npm install

# 5. Start the app in development mode (Tauri + frontend together)
npm run tauri dev
```

The app will launch with hot-reload enabled. Changes to source files reflect immediately without restarting.

### Useful Scripts

| Command | What it does |
|---------|-------------|
| `npm run tauri dev` | Start Tauri app in development mode with hot-reload |
| `npm run tauri build` | Build a production binary for your current platform |
| `cargo test` | Run Rust backend tests |
| `npm run lint` | Run ESLint on the frontend |
| `npm run lint fix` | Run ESLint and auto-fix what it can |
| `npm test` | Run frontend tests |

---

## 🗂️ Project Structure

```
oneclickgit/
├── src/
│   ├── main.rs                # Tauri backend (Rust)
│   ├── commands/              # Tauri commands (Rust)
│   │   ├── auth.rs            # GitHub OAuth handler
│   │   ├── uploader.rs        # Core upload engine
│   │   └── mod.rs             # Command registry
│   └── lib.rs                 # Tauri app setup
├── ui/                        # Frontend (web)
│   ├── index.html             # App shell
│   ├── src/
│   │   ├── main.js            # Frontend entry point
│   │   ├── components/        # UI components
│   │   └── styles/            # CSS
│   └── package.json
├── shared/                    # Shared constants and utilities
│   └── constants.js
├── assets/                    # Icons, images
├── tests/                     # Test files
├── dist/                      # Built binaries (gitignored)
├── package.json
└── tauri.conf.json            # Tauri build configuration
```

---

## 🧹 Coding Standards

These aren't arbitrary they keep the codebase readable for everyone.

### General

- **Clarity over cleverness.** Write code that a tired person at midnight can understand.
- **Keep functions small and focused.** If a function does two things, it should probably be two functions.
- **No commented-out code in PRs.** Delete it or don't commit it.
- **No `console.log` left in production paths.** Use the logger utility.

### JavaScript (Frontend)

- ES modules (`import`/`export`) throughout
- `async`/`await` over raw Promises
- Descriptive variable names `selectedFiles` not `sf`, `uploadProgress` not `p`
- Handle errors explicitly don't silently swallow them

### Rust (Backend)

- Follow standard Rust idioms if `clippy` complains, fix it
- Use `Result` and `?` for error propagation no `unwrap()` in production paths
- Keep Tauri commands thin logic belongs in dedicated modules, not command handlers
- Run `cargo clippy` and `cargo fmt` before committing

### CSS

- Follow the existing naming conventions in `src/renderer/styles/`
- No inline styles in HTML/JS unless truly dynamic
- Keep it simple this isn't a design portfolio

### Linting

ESLint (frontend) and Clippy (Rust backend) are both configured and enforced. Run both before every commit. PRs with lint errors won't be merged the CI will catch it anyway.

```bash
# Frontend: check for issues
npm run lint

# Frontend: auto-fix what's fixable
npm run lint:fix

# Rust: lint with Clippy
cargo clippy

# Rust: auto-format
cargo fmt
```

---

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/). This keeps the git history readable and enables automatic changelog generation.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace no logic changes |
| `refactor` | Code restructure no feature or fix |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |

### Examples

```bash
feat(uploader): add support for uploading into subfolders
fix(auth): handle OAuth token expiry gracefully
docs(readme): fix broken badge URLs
chore(deps): bump tauri to 2.x.x
perf(uploader): batch API calls to reduce upload time
```

Keep the subject line under **72 characters**. Use the body for *why*, not *what* the diff shows what changed.

---

## 🔃 Pull Request Process

### Before You Open a PR

- [ ] Your branch is up to date with `upstream/main`
- [ ] `npm run lint` passes with no errors
- [ ] `npm test` passes with no failures
- [ ] Your changes are focused one feature or fix per PR
- [ ] You've tested your changes manually in the app
- [ ] Documentation is updated if you changed any behavior

### Keeping Your Branch Fresh

```bash
# Pull latest changes from upstream
git fetch upstream
git rebase upstream/main

# If there are conflicts, resolve them, then:
git rebase --continue
```

### Opening the PR

1. Push your branch to your fork
2. Open a PR against `imFluxray/oneclickgit:main`
3. Fill out the PR template completely don't delete the sections
4. Link the issue it resolves using `Closes #123` in the description
5. Mark it as **Draft** if it's not ready for review yet

### Review Process

- PRs are reviewed by [@imFluxray](https://github.com/imFluxray)
- Expect feedback within a few days this is a solo project, be patient
- Address review comments by pushing new commits to the same branch (don't force-push during review)
- Once approved, the PR will be squash-merged into `main`

### After Your PR Merges

🎉 You're a contributor! You'll show up in the contributors list automatically. Feel free to add yourself to the Acknowledgements section in the README if you'd like.

---

## ✅ What Gets Merged

To set expectations clearly, PRs are most likely to be merged when they:

- Fix a real, reproducible bug
- Implement something from the [Roadmap](README.md#️-roadmap)
- Improve performance without changing behavior
- Improve documentation meaningfully

PRs that are **less likely** to be merged without prior discussion:

- Large refactors that change the whole architecture
- New dependencies added without justification
- Features that don't align with the core mission (keeping it simple for non-technical users)
- UI redesigns done without prior alignment

**When in doubt, open an issue first** and discuss the approach before writing the code. A 5-minute comment thread can save you hours of work on something that won't land.

---

## ❓ Questions?

If something in this document is unclear, or you're stuck on something:

- Open a [Discussion](https://github.com/imFluxray/oneclickgit/discussions) no question is too small
- Drop a comment on the relevant issue

Thanks again for contributing. It means a lot. 🙏

---

<sub><a href="https://github.com/imFluxray/oneclickgit">OneClickGit</a> · MIT License · <a href="https://github.com/imFluxray/oneclickgit/issues">Issues</a> · <a href="https://github.com/imFluxray/oneclickgit/discussions">Discussions</a></sub>
