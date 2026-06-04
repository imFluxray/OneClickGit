export interface PathValidation {
  ok: boolean;
  path: string;
  error?: string;
}

/** Normalize and validate a path for GitHub Git Trees API. */
export function sanitizeGitHubPath(raw: string): PathValidation {
  if (!raw || !raw.trim()) {
    return { ok: false, path: "", error: "Empty path" };
  }

  let path = raw.replace(/\\/g, "/").trim();
  path = path.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!path) {
    return { ok: false, path: "", error: "Empty path" };
  }

  const parts = path.split("/").filter((segment) => {
    if (!segment || segment === "." || segment === "..") return false;
    if (/[\x00-\x1f\x7f]/.test(segment)) return false;
    if (segment.includes("\\")) return false;
    return true;
  });

  if (parts.length === 0) {
    return { ok: false, path: "", error: "Invalid path segments" };
  }

  const normalized = parts.join("/");

  if (normalized.length > 4096) {
    return { ok: false, path: "", error: "Path too long" };
  }

  return { ok: true, path: normalized };
}

export function joinGitHubPath(prefix: string, relative: string): PathValidation {
  const p = sanitizeGitHubPath(prefix);
  const r = sanitizeGitHubPath(relative);
  if (!r.ok) return r;
  if (!p.ok && prefix.trim()) return p;
  if (!prefix.trim()) return r;
  return sanitizeGitHubPath(`${p.ok ? p.path : prefix}/${r.path}`);
}
