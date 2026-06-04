import { invoke } from "@tauri-apps/api/core";
import { sanitizeGitHubPath, type PathValidation } from "../paths";
import {
  createBlob,
  createCommit,
  createTree,
  getBranchHead,
  getExistingFilePaths,
  updateBranchRef,
} from "./git";
import type { ScannedFile } from "../types";

export interface UploadContext {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  overwrite: boolean;
  commitMessage: string;
}

export interface UploadCallbacks {
  onProgress: (
    completed: number,
    total: number,
    currentFile: string,
    bytesDone: number,
    totalBytes: number,
  ) => void;
  onFileError?: (file: ScannedFile, error: string) => void;
  shouldCancel?: () => boolean;
}

export interface UploadResult {
  succeeded: number;
  failed: { file: ScannedFile; error: string }[];
  skipped: number;
}

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const BATCH_SIZE = 100;
const BLOB_CONCURRENCY = 16;

type BlobResult =
  | { ok: true; path: string; sha: string; size: number }
  | { ok: false; file: ScannedFile; error: string };

async function runPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<void>,
): Promise<void> {
  let next = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length || 1) },
    async () => {
      while (next < items.length) {
        const i = next++;
        await fn(items[i], i);
      }
    },
  );
  await Promise.all(workers);
}

async function readFileBase64(path: string): Promise<string> {
  return invoke<string>("read_file_base64", { path });
}

function resolveUploadPath(file: ScannedFile): PathValidation {
  return sanitizeGitHubPath(file.relativePath);
}

export async function uploadFiles(
  ctx: UploadContext,
  files: ScannedFile[],
  callbacks: UploadCallbacks,
): Promise<UploadResult> {
  const message = ctx.commitMessage.trim() || "Upload via OneClickGit";
  const failed: { file: ScannedFile; error: string }[] = [];
  let skipped = 0;
  const totalBytes = files.reduce((s, f) => s + f.size, 0);

  let head = await getBranchHead(ctx.token, ctx.owner, ctx.repo, ctx.branch);

  let toUpload: ScannedFile[] = [];

  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) {
      failed.push({ file: f, error: "Exceeds GitHub's 100 MB limit" });
      continue;
    }
    const pathCheck = resolveUploadPath(f);
    if (!pathCheck.ok) {
      failed.push({
        file: f,
        error: pathCheck.error ?? "Invalid file path for GitHub",
      });
      continue;
    }
    toUpload.push({ ...f, relativePath: pathCheck.path });
  }

  if (!ctx.overwrite && toUpload.length > 0) {
    callbacks.onProgress(0, files.length, "Checking existing files…", 0, totalBytes);
    const existing = await getExistingFilePaths(
      ctx.token,
      ctx.owner,
      ctx.repo,
      head.treeSha,
    );
    toUpload = toUpload.filter((f) => {
      if (existing.has(f.relativePath)) {
        skipped += 1;
        return false;
      }
      return true;
    });
  }

  if (toUpload.length === 0) {
    return { succeeded: 0, failed, skipped };
  }

  const batches: ScannedFile[][] = [];
  for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
    batches.push(toUpload.slice(i, i + BATCH_SIZE));
  }

  let completed = skipped + failed.length;
  let bytesDone = 0;
  let succeeded = 0;

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    if (callbacks.shouldCancel?.()) break;

    const batch = batches[batchIndex];
    const batchLabel =
      batches.length > 1
        ? `Committing batch ${batchIndex + 1}/${batches.length}…`
        : "Creating commit…";

    callbacks.onProgress(completed, files.length, batchLabel, bytesDone, totalBytes);

    head = await getBranchHead(ctx.token, ctx.owner, ctx.repo, ctx.branch);

    const results: (BlobResult | undefined)[] = new Array(batch.length);

    await runPool(batch, BLOB_CONCURRENCY, async (file, index) => {
      if (callbacks.shouldCancel?.()) return;
      const pathCheck = resolveUploadPath(file);
      if (!pathCheck.ok) {
        results[index] = {
          ok: false,
          file,
          error: pathCheck.error ?? "Invalid path",
        };
        return;
      }
      try {
        const content = await readFileBase64(file.absolutePath);
        const blobSha = await createBlob(
          ctx.token,
          ctx.owner,
          ctx.repo,
          content,
        );
        results[index] = {
          ok: true,
          path: pathCheck.path,
          sha: blobSha,
          size: file.size,
        };
      } catch (e) {
        const error = e instanceof Error ? e.message : String(e);
        results[index] = { ok: false, file, error };
        callbacks.onFileError?.(file, error);
      }
    });

    const blobEntries: { path: string; sha: string }[] = [];
    const seenPaths = new Set<string>();

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (!r) continue;
      if (!r.ok) {
        failed.push({ file: r.file, error: r.error });
        completed += 1;
        continue;
      }
      if (seenPaths.has(r.path)) {
        failed.push({
          file: batch[i],
          error: `Duplicate path: ${r.path}`,
        });
        completed += 1;
        continue;
      }
      seenPaths.add(r.path);
      blobEntries.push({ path: r.path, sha: r.sha });
      bytesDone += r.size;
    }

    if (blobEntries.length === 0) continue;

    try {
      const treeSha = await createTree(
        ctx.token,
        ctx.owner,
        ctx.repo,
        head.treeSha,
        blobEntries,
      );
      const commitSha = await createCommit(
        ctx.token,
        ctx.owner,
        ctx.repo,
        batches.length > 1
          ? `${message} (${batchIndex + 1}/${batches.length})`
          : message,
        treeSha,
        head.commitSha,
      );
      await updateBranchRef(
        ctx.token,
        ctx.owner,
        ctx.repo,
        ctx.branch,
        commitSha,
        head.commitSha,
      );

      succeeded += blobEntries.length;
      completed += blobEntries.length;
      callbacks.onProgress(completed, files.length, batchLabel, bytesDone, totalBytes);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      const fallback = await commitEntriesIndividually(
        ctx,
        blobEntries,
        batch,
        message,
        batchIndex,
        batches.length,
      );
      succeeded += fallback.succeeded;
      failed.push(...fallback.failed);
      completed += blobEntries.length;

      if (fallback.succeeded === 0 && fallback.failed.length === 0) {
        for (const entry of blobEntries) {
          const file = batch.find(
            (f) => sanitizeGitHubPath(f.relativePath).path === entry.path,
          );
          if (file) {
            failed.push({ file, error });
            callbacks.onFileError?.(file, error);
          }
        }
      }
    }
  }

  return { succeeded, failed, skipped };
}

async function commitEntriesIndividually(
  ctx: UploadContext,
  entries: { path: string; sha: string }[],
  batch: ScannedFile[],
  message: string,
  batchIndex: number,
  batchCount: number,
): Promise<{
  succeeded: number;
  failed: { file: ScannedFile; error: string }[];
}> {
  const failed: { file: ScannedFile; error: string }[] = [];
  let succeeded = 0;
  const batchMsg =
    batchCount > 1 ? `${message} (${batchIndex + 1}/${batchCount})` : message;

  for (const entry of entries) {
    const file = batch.find(
      (f) => sanitizeGitHubPath(f.relativePath).path === entry.path,
    );
    try {
      const currentHead = await getBranchHead(
        ctx.token,
        ctx.owner,
        ctx.repo,
        ctx.branch,
      );
      const treeSha = await createTree(
        ctx.token,
        ctx.owner,
        ctx.repo,
        currentHead.treeSha,
        [entry],
      );
      const commitSha = await createCommit(
        ctx.token,
        ctx.owner,
        ctx.repo,
        `${batchMsg}: ${entry.path}`,
        treeSha,
        currentHead.commitSha,
      );
      await updateBranchRef(
        ctx.token,
        ctx.owner,
        ctx.repo,
        ctx.branch,
        commitSha,
        currentHead.commitSha,
      );
      succeeded += 1;
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      if (file) {
        failed.push({ file, error });
      }
    }
  }

  return { succeeded, failed };
}
