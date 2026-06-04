import { githubFetch } from "./auth";
import type { Repository } from "../types";

export async function listRepositories(token: string): Promise<Repository[]> {
  const repos: Repository[] = [];
  let page = 1;

  while (page <= 10) {
    const response = await githubFetch(
      `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`,
      token,
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ?? "Failed to load repositories",
      );
    }

    const batch: Repository[] = await response.json();
    repos.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return repos.sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export async function listBranches(
  token: string,
  owner: string,
  repo: string,
): Promise<string[]> {
  const response = await githubFetch(
    `/repos/${owner}/${repo}/branches?per_page=100`,
    token,
  );

  if (!response.ok) {
    throw new Error("Failed to load branches");
  }

  const branches: { name: string }[] = await response.json();
  return branches.map((b) => b.name).sort();
}

