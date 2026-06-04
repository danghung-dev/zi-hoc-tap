import { Manifest, LevelConfig, Pack, Question } from "./types";

const BASE_PATH = "/data";

export async function loadManifest(): Promise<Manifest> {
  const res = await fetch(`${BASE_PATH}/manifest.json`);
  if (!res.ok) {
    throw new Error(`Failed to load manifest: ${res.statusText}`);
  }
  return res.json();
}

export async function loadLevelConfig(level: string): Promise<LevelConfig> {
  const levelLower = level.toLowerCase();
  const res = await fetch(`${BASE_PATH}/levels/${levelLower}/level-config.json`);
  if (!res.ok) {
    throw new Error(`Failed to load level config for level ${level}: ${res.statusText}`);
  }
  return res.json();
}

export async function loadPacks(level: string): Promise<Pack[]> {
  const levelLower = level.toLowerCase();
  const res = await fetch(`${BASE_PATH}/levels/${levelLower}/packs.json`);
  if (!res.ok) {
    throw new Error(`Failed to load packs for level ${level}: ${res.statusText}`);
  }
  return res.json();
}

export async function loadPack(level: string, file: string): Promise<Question[]> {
  const levelLower = level.toLowerCase();
  const res = await fetch(`${BASE_PATH}/levels/${levelLower}/${file}`);
  if (!res.ok) {
    throw new Error(`Failed to load pack file ${file} for level ${level}: ${res.statusText}`);
  }
  return res.json();
}

export async function loadAllQuestions(level: string): Promise<Question[]> {
  const packs = await loadPacks(level);
  const questionPromises = packs.map(pack => loadPack(level, pack.file));
  const questionPacks = await Promise.all(questionPromises);
  return questionPacks.flat();
}

export function resolveAssetUrl(levelConfig: LevelConfig, src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `${levelConfig.assetBaseUrl}/${src}`;
}
