import rawN3Data from "./kanji_n3.json";

export interface KanjiCardN3 {
  id: string;
  kanji: string;
  hiragana: string;
  meaning: string;
  setId: number;
  dayId: number; // Day of the week (1 to 6)
  setName: string;
  level: "N3" | "N4";
  isKanjiCard?: boolean;
  han_viet?: string;
  on_yomi?: string;
  kun_yomi?: string;
  mnemonic?: string;
  image_path?: string;
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

const getWeekAndDay = (index: number): { weekId: number; dayId: number } => {
  let weekId = 1;
  let localIndex = index;

  if (index >= 1 && index <= 58) {
    weekId = 1;
    localIndex = index;
  } else if (index >= 59 && index <= 113) {
    weekId = 2;
    localIndex = index - 58;
  } else if (index >= 114 && index <= 170) {
    weekId = 3;
    localIndex = index - 113;
  } else if (index >= 171 && index <= 226) {
    weekId = 4;
    localIndex = index - 170;
  } else if (index >= 227 && index <= 282) {
    weekId = 5;
    localIndex = index - 226;
  } else {
    weekId = 6;
    localIndex = index - 282;
  }

  const weekTotals: Record<number, number> = {
    1: 58,
    2: 55,
    3: 57,
    4: 56,
    5: 56,
    6: 53
  };
  const totalInWeek = weekTotals[weekId];
  const size = Math.ceil(totalInWeek / 6);
  let dayId = Math.floor((localIndex - 1) / size) + 1;
  if (dayId > 6) dayId = 6;

  return { weekId, dayId };
};

export const n3Flashcards: KanjiCardN3[] = [];

rawN3Data.forEach((item: any) => {
  const { weekId, dayId } = getWeekAndDay(item.index);
  const setName = setNamesN3[weekId];

  // 1. Add main Kanji Card
  const readings = [item.on_yomi, item.kun_yomi].filter(Boolean).join(" / ");
  n3Flashcards.push({
    id: `n3_k${item.index}_main`,
    kanji: item.kanji,
    hiragana: readings || item.kanji,
    meaning: item.han_viet || "",
    setId: weekId,
    dayId,
    setName,
    level: "N3",
    isKanjiCard: true,
    han_viet: item.han_viet || undefined,
    on_yomi: item.on_yomi || undefined,
    kun_yomi: item.kun_yomi || undefined,
    mnemonic: item.mnemonic || undefined,
    image_path: item.image_path || undefined,
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
        dayId,
        setName,
        level: "N3",
        isKanjiCard: false,
      });
    });
  }
});
