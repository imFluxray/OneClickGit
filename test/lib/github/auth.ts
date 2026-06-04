import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import type { DeviceFlowState, GitHubUser } from "../types";

interface RustDeviceFlowStart {
  userCode: string;
  verificationUri: string;
  deviceCode: string;
  interval: number;
  expiresIn: number;
}

interface RustPollResult {
  status: "success" | "pending" | "slow_down";
  accessToken?: string;
  message?: string;
}

export async function requestDeviceCode(
  clientId: string,
): Promise<DeviceFlowState> {
  const data = await invoke<RustDeviceFlowStart>("github_request_device_code", {
    clientId,
  });

  return {
    userCode: data.userCode,
    verificationUri: data.verificationUri,
    deviceCode: data.deviceCode,
    interval: data.interval,
    expiresAt: Date.now() + data.expiresIn * 1000,
  };
}

export async function pollForAccessToken(
  clientId: string,
  deviceCode: string,
  intervalSec: number,
  expiresAt: number,
  onStatus?: (message: string) => void,
): Promise<string> {
  let intervalMs = Math.max(intervalSec, 5) * 1000;

  while (Date.now() < expiresAt) {
    await sleep(intervalMs);
    onStatus?.("Waiting for you to authorize in the browser…");

    const result = await invoke<RustPollResult>("github_poll_access_token", {
      clientId,
      deviceCode,
    });

    if (result.status === "success" && result.accessToken) {
      return result.accessToken;
    }

    if (result.status === "slow_down") {
      intervalMs += 5000;
      await sleep(5000);
    }
  }

  throw new Error("Sign-in timed out. Please try again.");
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const response = await githubFetch("/user", token);
  if (!response.ok) {
    throw new Error("Could not load your GitHub profile.");
  }
  return response.json();
}

export async function githubFetch(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<Response> {
  const url = path.startsWith("http")
    ? path
    : `https://api.github.com${path.startsWith("/") ? path : `/${path}`}`;

  try {
    return await fetch(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.toLowerCase().includes("fetch")) {
      throw new Error(
        "Could not reach GitHub API. Run the desktop app with npm run tauri dev (not the browser-only dev server).",
      );
    }
    throw e;
  }
}

export async function openDeviceVerification(uri: string): Promise<void> {
  await openUrl(uri);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
