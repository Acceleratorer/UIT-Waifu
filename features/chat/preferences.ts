import { DEFAULT_MODE, isModeId, type ModeId } from "@/data/modes";

const DEFAULT_MODE_KEY = "uit-waifu.default-mode";

export function readDefaultMode(): ModeId {
  if (typeof window === "undefined") return DEFAULT_MODE;

  const value = window.localStorage.getItem(DEFAULT_MODE_KEY);
  return isModeId(value) ? value : DEFAULT_MODE;
}

export function writeDefaultMode(mode: ModeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEFAULT_MODE_KEY, mode);
}
