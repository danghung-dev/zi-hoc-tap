const STORAGE_KEY = "n4_practice_mistakes";

export type MistakeRecord = Record<string, { wrong: number; correct: number }>;

export function loadMistakes(): MistakeRecord {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function recordAnswer(id: string, isCorrect: boolean): MistakeRecord {
  const mistakes = loadMistakes();
  if (!mistakes[id]) {
    mistakes[id] = { wrong: 0, correct: 0 };
  }
  if (isCorrect) {
    mistakes[id].correct += 1;
  } else {
    mistakes[id].wrong += 1;
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
  }
  return mistakes;
}

export function clearMistakes(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getWrongIds(): string[] {
  const mistakes = loadMistakes();
  return Object.keys(mistakes).filter(id => mistakes[id].wrong > 0);
}

export function clearSingleMistake(id: string): MistakeRecord {
  const mistakes = loadMistakes();
  if (mistakes[id]) {
    delete mistakes[id];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
  }
  return mistakes;
}

