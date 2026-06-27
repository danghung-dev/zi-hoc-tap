import rawN3Data from "./kanji_n3.json";

export interface KanjiCardN3 {
  id: string;
  kanji: string;
  hiragana: string;
  meaning: string;
  setId: number;
  setName: string;
  level: "N3" | "N4";
  isKanjiCard?: boolean;
  han_viet?: string;
  on_yomi?: string;
  kun_yomi?: string;
  mnemonic?: string;
  examples?: { word: string; hiragana: string; meaning: string }[];
}

export const setNamesN3: Record<number, string> = {
  1: "Tuần 1 (1-58)",
  2: "Tuần 2 (59-113)",
  3: "Tuần 3 (114-170)",
  4: "Tuần 4 (171-226)",
  5: "Tuần 5 (227-282)",
  6: "Tuần 6 (283-335)",
};

const getWeekId = (index: number): number => {
  if (index >= 1 && index <= 58) return 1;
  if (index >= 59 && index <= 113) return 2;
  if (index >= 114 && index <= 170) return 3;
  if (index >= 171 && index <= 226) return 4;
  if (index >= 227 && index <= 282) return 5;
  return 6; // index 283 - 335
};

export const n3Flashcards: KanjiCardN3[] = [];

rawN3Data.forEach((item: any) => {
  const weekId = getWeekId(item.index);
  const setName = setNamesN3[weekId];

  // 1. Add main Kanji Card
  // Construct a reading representation for TTS/reference
  const readings = [item.on_yomi, item.kun_yomi].filter(Boolean).join(" / ");
  n3Flashcards.push({
    id: `n3_k${item.index}_main`,
    kanji: item.kanji,
    hiragana: readings || item.kanji,
    meaning: item.han_viet || "",
    setId: weekId,
    setName,
    level: "N3",
    isKanjiCard: true,
    han_viet: item.han_viet || undefined,
    on_yomi: item.on_yomi || undefined,
    kun_yomi: item.kun_yomi || undefined,
    mnemonic: item.mnemonic || undefined,
    examples: item.examples && item.examples.length > 0 ? item.examples : undefined,
  });

  // 2. Add example word cards
  if (item.examples && Array.isArray(item.examples)) {
    item.examples.forEach((ex: any, idx: number) => {
      n3Flashcards.push({
        id: `n3_k${item.index}_ex_${idx}`,
        kanji: ex.word,
        hiragana: ex.hiragana,
        meaning: ex.meaning,
        setId: weekId,
        setName,
        level: "N3",
        isKanjiCard: false,
      });
    });
  }
});
