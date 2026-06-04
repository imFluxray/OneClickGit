export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

export interface Repository {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  default_branch: string;
  private: boolean;
}

export interface ScannedFile {
  absolutePath: string;
  relativePath: string;
  size: number;
}

export type UploadMode = "files" | "folder";

export interface AppSettings {
  skipHidden: boolean;
  respectGitignore: boolean;
  overwriteExisting: boolean;
  pathPrefix: string;
  theme: "light" | "dark" | "system";
}

export const DEFAULT_SETTINGS: AppSettings = {
  skipHidden: true,
  respectGitignore: true,
  overwriteExisting: false,
  pathPrefix: "",
  theme: "system",
};

export interface UploadProgress {
  status: "idle" | "scanning" | "uploading" | "success" | "error";
  currentFile: string;
  completed: number;
  total: number;
  bytesUploaded: number;
  totalBytes: number;
  message: string;
}

export interface DeviceFlowState {
  userCode: string;
  verificationUri: string;
  deviceCode: string;
  interval: number;
  expiresAt: number;
}
