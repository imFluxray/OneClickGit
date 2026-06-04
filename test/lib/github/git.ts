import { githubFetch } from "./auth";

export interface RepoHead {
  commitSha: string;
  treeSha: string;
}

export async function getBranchHead(
  token: string,
  owner: string,
  repo: string,
  branch: string,
): Promise<RepoHead> {
  const refRes = await githubFetch(
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`,
    token,
  );
  if (!refRes.ok) {
    const err = await refRes.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Could not read branch",
    );
  }
  const ref = (await refRes.json()) as { object: { sha: string } };
  const commitSha = ref.object.sha;

  const commitRes = await githubFetch(
    `/repos/${owner}/${repo}/git/commits/${commitSha}`,
    token,
  );
  if (!commitRes.ok) {
    throw new Error("Could not read latest commit");
  }
  const commit = (await commitRes.json()) as { tree: { sha: string } };
  return { commitSha, treeSha: commit.tree.sha };
}

/** Paths of existing files on the branch (best-effort; may be incomplete if truncated). */
export async function getExistingFilePaths(
  token: string,
  owner: string,
  repo: string,
  treeSha: string,
): Promise<Set<string>> {
  const paths = new Set<string>();
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`,
    token,
  );
  if (!res.ok) return paths;

  const data = (await res.json()) as {
    tree?: { path?: string; type?: string }[];
    truncated?: boolean;
  };

  for (const entry of data.tree ?? []) {
    if (entry.type === "blob" && entry.path) {
      paths.add(entry.path);
    }
  }
  return paths;
}

export async function createBlob(
  token: string,
  owner: string,
  repo: string,
  contentBase64: string,
): Promise<string> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/blobs`,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: contentBase64, encoding: "base64" }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to create blob",
    );
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

export async function createTree(
  token: string,
  owner: string,
  repo: string,
  baseTreeSha: string,
  entries: { path: string; sha: string }[],
): Promise<string> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/trees`,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: entries.map((e) => ({
          path: e.path,
          mode: "100644",
          type: "blob",
          sha: e.sha,
        })),
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to create tree",
    );
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

export async function createCommit(
  token: string,
  owner: string,
  repo: string,
  message: string,
  treeSha: string,
  parentSha: string,
): Promise<string> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/commits`,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to create commit",
    );
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

export async function updateBranchRef(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  commitSha: string,
  expectedParentSha: string,
): Promise<void> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`,
    token,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: commitSha, force: false }),
    },
  );

  if (res.ok) return;

  const err = await res.json().catch(() => ({}));
  const message = (err as { message?: string }).message ?? "";

  if (message.toLowerCase().includes("fast forward") || res.status === 422) {
    const head = await getBranchHead(token, owner, repo, branch);
    if (head.commitSha !== expectedParentSha) {
      throw new Error(
        "Branch changed while uploading. Please try again.",
      );
    }
  }

  throw new Error(message || `Failed to update branch (${res.status})`);
}
