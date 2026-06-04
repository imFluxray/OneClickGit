import { load } from "@tauri-apps/plugin-store";
import type { AppSettings, GitHubUser } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const STORE_PATH = "oneclickgit-store.json";

let storePromise: ReturnType<typeof load> | null = null;

async function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_PATH, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function getAccessToken(): Promise<string | null> {
  const store = await getStore();
  return (await store.get<string>("accessToken")) ?? null;
}

export async function setAccessToken(token: string | null): Promise<void> {
  const store = await getStore();
  if (token) {
    await store.set("accessToken", token);
  } else {
    await store.delete("accessToken");
  }
  await store.save();
}

export async function getStoredUser(): Promise<GitHubUser | null> {
  const store = await getStore();
  return (await store.get<GitHubUser>("user")) ?? null;
}

export async function setStoredUser(user: GitHubUser | null): Promise<void> {
  const store = await getStore();
  if (user) {
    await store.set("user", user);
  } else {
    await store.delete("user");
  }
  await store.save();
}

export async function getSettings(): Promise<AppSettings> {
  const store = await getStore();
  const saved = await store.get<Partial<AppSettings>>("settings");
  return { ...DEFAULT_SETTINGS, ...saved };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const store = await getStore();
  await store.set("settings", settings);
  await store.save();
}

export async function clearAuth(): Promise<void> {
  await setAccessToken(null);
  await setStoredUser(null);
}
