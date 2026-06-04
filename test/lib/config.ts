/**
 * GitHub OAuth Client ID — set VITE_GITHUB_CLIENT_ID in .env before building.
 * Compiled into the app; not editable in Settings.
 */
export const GITHUB_CLIENT_ID: string =
  import.meta.env.VITE_GITHUB_CLIENT_ID ?? "";

export const GITHUB_CLIENT_CONFIGURED = GITHUB_CLIENT_ID.length > 0;
