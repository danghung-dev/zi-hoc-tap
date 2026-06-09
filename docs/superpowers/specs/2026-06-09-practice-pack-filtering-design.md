# Design Spec: Practice Pack Filtering

This design document outlines the changes needed to implement practice pack selection and filtering on the `/practice` page in the `zi-hoc-tap` application.

## 1. Background & Problem Statement
Currently, the `/practice` page displays questions of a chosen skill group (Vocabulary, Grammar, Reading, or Listening) as a single flat list. If a user has completed some questions (e.g., up to question 20) and returns to practice later, they have to click the "Next" (Sau) button 20 times to resume where they left off.

To solve this, we will add a dropdown filter containing the list of packs from `packs.json` corresponding to the selected skill group. When a user selects a pack $n$, the practice list will only include questions from pack $n$ onwards.

## 2. Technical Architecture

### 2.1 Types Modification
We will update [src/lib/practice/types.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/types.ts) to add an optional `packId` property to the `QuestionBase` type.

```typescript
export interface QuestionBase {
  id: string;
  level: string;
  section: string;
  jlptItemType: string;
  uiTemplate: string;
  difficulty: number;
  tags: string[];
  customClassification?: CustomClassification;
  packId?: string; // Newly added
}
```

### 2.2 Data Loader Modification
We will update `loadAllQuestions` in [src/lib/practice/data-loader.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/data-loader.ts) to map the pack's `id` onto each question loaded from that pack:

```typescript
export async function loadAllQuestions(level: string): Promise<Question[]> {
  const packs = await loadPacks(level);
  const questionPromises = packs.map(async (pack) => {
    const questions = await loadPack(level, pack.file);
    return questions.map(q => ({ ...q, packId: pack.id }));
  });
  const questionPacks = await Promise.all(questionPromises);
  return questionPacks.flat();
}
```

### 2.3 Page Component State & Filtering
We will update [src/app/practice/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/practice/page.tsx):
1. **New States**:
   - `packs`: To hold the full list of packs for the level (loaded on page mount).
   - `selectedPackId`: To hold the selected pack ID (defaults to `"all"`).

2. **Fetching Data**:
   Fetch `packs` using `loadPacks("n4")` inside the initial page mount `useEffect` hook.

3. **Active Packs List Filtering**:
   Derive `activePacks` dynamically based on the `activeSkillGroup`:
   - `vocabulary` -> `packs.filter(p => p.section === "vocabulary")`
   - `listening` -> `packs.filter(p => p.section === "listening")`
   - `grammar` -> `packs.filter(p => p.section === "grammar_reading" && (p.jlptItemType.includes("grammar") || p.jlptItemType.includes("composition")))`
   - `reading` -> `packs.filter(p => p.section === "grammar_reading" && (p.jlptItemType.includes("reading") || p.jlptItemType.includes("information") || p.jlptItemType.includes("retrieval")))`

4. **Questions Filter Logic**:
   Inside the filter `useEffect` hook, if `selectedPackId !== "all"`, identify the index of the selected pack in `activePacks`.
   Slice the `activePacks` array from that index to the end, extract their `id`s, and filter questions to only include those whose `packId` is in the sliced array.
   Also reset `selectedPackId` to `"all"` when `activeSkillGroup` changes.

5. **UI Dropdown Selector**:
   Add a dropdown selector (`<select>`) in the Filters Panel when `activeSkillGroup !== "all"`. It will list `activePacks` showing the title of each pack.

## 3. UI/UX Design

The Dropdown selector will be rendered inside the Filter Settings block, spanning full width at the bottom of the filters grid. It uses standard styles matching the existing dropdown selectors (Phân loại, Dạng bài thi).

```jsx
{activeSkillGroup !== "all" && (
  <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-3 border-t border-slate-850 pt-3">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      Bắt đầu luyện tập từ Pack
    </label>
    <select
      value={selectedPackId}
      onChange={(e) => setSelectedPackId(e.target.value)}
      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-600 transition h-[38px]"
    >
      <option value="all">Tất cả các Pack (Từ đầu)</option>
      {activePacks.map((pack) => (
        <option key={pack.id} value={pack.id}>
          {pack.title} ({pack.count} câu)
        </option>
      ))}
    </select>
  </div>
)}
```

## 4. Verification Plan

1. **Static compilation check**: Run `npm run build` or Next.js build command to verify types and React component compilation.
2. **Behavioral check**:
   - Verify that when "Xem tất cả" (All skill groups) is active, no pack dropdown is shown.
   - Select "Từ vựng & Chữ Hán". Verify the dropdown displays pack titles such as "Luyện đọc chữ Kanji - Pack 1", "Luyện chính tả Kanji - Pack 1", etc.
   - Verify that selecting "Luyện từ vựng theo mạch văn - Pack 1" filters the questions count to include only questions from that pack and subsequent packs.
   - Verify that clicking another skill group (e.g. Grammar) resets the selected pack state back to "Tất cả các Pack".
