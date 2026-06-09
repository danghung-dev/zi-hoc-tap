# Practice Pack Filtering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dropdown pack selector in the `/practice` page so users can select a specific pack to practice from, showing questions from the selected pack onwards.

**Architecture:** Update types to support `packId` on question objects, retrieve the packs manifest in the data loader to assign `packId` to each loaded question, add React states and render a pack selector dropdown which filters the active question list from the selected pack to the end.

**Tech Stack:** React, Next.js (App Router), Lucide React.

---

### Task 1: Update TypeScript Types and Data Loader

**Files:**
- Modify: [src/lib/practice/types.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/types.ts)
- Modify: [src/lib/practice/data-loader.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/data-loader.ts)

- [ ] **Step 1: Add packId to QuestionBase interface**
  Modify [src/lib/practice/types.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/types.ts) by adding the optional `packId` field to the `QuestionBase` interface.
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
    packId?: string; // New field
  }
  ```

- [ ] **Step 2: Update loadAllQuestions in data-loader.ts**
  Modify [src/lib/practice/data-loader.ts](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/lib/practice/data-loader.ts) to map the pack's `id` onto each question loaded from that pack:
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

- [ ] **Step 3: Run static type check**
  Run: `npx tsc --noEmit` inside `/Users/hung/projects-nosync/family/zi-hoc-tap`
  Expected: Command completes with no TypeScript compilation errors in types/loader.

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/lib/practice/types.ts src/lib/practice/data-loader.ts
  git commit -m "feat: add packId to Question type and load all questions with packId"
  ```

---

### Task 2: Add Pack States and Fetching in Page Component

**Files:**
- Modify: [src/app/practice/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/practice/page.tsx)

- [ ] **Step 1: Update imports to include Pack and loadPacks**
  Modify the imports at the top of [src/app/practice/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/practice/page.tsx):
  ```typescript
  import { 
    loadAllQuestions, 
    loadLevelConfig,
    loadPacks
  } from "@/lib/practice/data-loader";
  ```
  And:
  ```typescript
  import { Question, LevelConfig, Pack } from "@/lib/practice/types";
  ```

- [ ] **Step 2: Declare state variables for packs and selectedPackId**
  Add states inside the `PracticePage` component:
  ```typescript
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string>("all");
  ```

- [ ] **Step 3: Update mount useEffect to fetch packs**
  Modify the `fetchData` function inside the mount `useEffect`:
  ```typescript
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [configData, questionData, packsData] = await Promise.all([
          loadLevelConfig("n4"),
          loadAllQuestions("n4"),
          loadPacks("n4")
        ]);
        setLevelConfig(configData);
        setQuestions(questionData);
        setPacks(packsData);
        setMistakeIds(getWrongIds());
      } catch (err: any) {
        console.error(err);
        setError("Không thể nạp dữ liệu câu hỏi từ hệ thống. Hãy thử tải lại trang.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  ```

- [ ] **Step 4: Add reset state useEffect for selectedPackId**
  Add a `useEffect` hook to reset the pack filter when the skill group changes:
  ```typescript
  // Reset selected pack when active skill group changes
  useEffect(() => {
    setSelectedPackId("all");
  }, [activeSkillGroup]);
  ```

- [ ] **Step 5: Verify page component compiles**
  Run: `npx tsc --noEmit`
  Expected: Compilation succeeds.

- [ ] **Step 6: Commit changes**
  ```bash
  git add src/app/practice/page.tsx
  git commit -m "feat: fetch packs list and manage pack selection states in PracticePage"
  ```

---

### Task 3: Implement Filtering by Pack Sequence

**Files:**
- Modify: [src/app/practice/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/practice/page.tsx)

- [ ] **Step 1: Derive activePacks list**
  Add `activePacks` memo inside `PracticePage` below the state declarations:
  ```typescript
  // Derive active packs for current active skill group
  const activePacks = React.useMemo(() => {
    if (activeSkillGroup === "all") return [];
    return packs.filter((p) => {
      if (activeSkillGroup === "vocabulary") {
        return p.section === "vocabulary";
      }
      if (activeSkillGroup === "listening") {
        return p.section === "listening";
      }
      if (activeSkillGroup === "grammar") {
        return (
          p.section === "grammar_reading" &&
          (p.jlptItemType.includes("grammar") || p.jlptItemType.includes("composition"))
        );
      }
      if (activeSkillGroup === "reading") {
        return (
          p.section === "grammar_reading" &&
          (p.jlptItemType.includes("reading") || p.jlptItemType.includes("information") || p.jlptItemType.includes("retrieval"))
        );
      }
      return false;
    });
  }, [packs, activeSkillGroup]);
  ```

- [ ] **Step 2: Update filtering useEffect logic**
  Modify the filter logic `useEffect` to check if `selectedPackId !== "all"` and filter all packs from that index onwards:
  ```typescript
  // 2. Filter logic: De-coupled from mistakeIds state to prevent deck reset while answering
  useEffect(() => {
    let result = [...questions];

    // Filter out listening questions if disabled
    if (!IS_LISTENING_ENABLED) {
      result = result.filter(q => q.section !== "listening");
    }

    // Filter by active skill group
    if (activeSkillGroup === "vocabulary") {
      result = result.filter(q => q.section === "vocabulary");
    } else if (activeSkillGroup === "grammar") {
      result = result.filter(q => 
        q.section === "grammar_reading" && 
        (q.jlptItemType.includes("grammar") || q.jlptItemType.includes("composition"))
      );
    } else if (activeSkillGroup === "reading") {
      result = result.filter(q => 
        q.section === "grammar_reading" && 
        (q.jlptItemType.includes("reading") || q.jlptItemType.includes("information") || q.jlptItemType.includes("retrieval"))
      );
    } else if (activeSkillGroup === "listening") {
      result = result.filter(q => q.section === "listening");
    }

    // Filter by selected pack and subsequent packs
    if (selectedPackId !== "all") {
      const targetIdx = activePacks.findIndex(p => p.id === selectedPackId);
      if (targetIdx !== -1) {
        const allowedPackIds = activePacks.slice(targetIdx).map(p => p.id);
        result = result.filter(q => q.packId && allowedPackIds.includes(q.packId));
      }
    }

    if (filterCategory !== "all") {
      result = result.filter(
        (q) => q.customClassification?.categoryId === filterCategory
      );
    }

    if (filterItemType !== "all") {
      result = result.filter((q) => q.jlptItemType === filterItemType);
    }

    if (onlyMistakes) {
      const activeMistakes = getWrongIds();
      result = result.filter((q) => activeMistakes.includes(q.id));
    }

    setFilteredQuestions(result);
    setCurrentIndex(0);
  }, [activeSkillGroup, filterCategory, filterItemType, onlyMistakes, questions, selectedPackId, activePacks]);
  ```

- [ ] **Step 3: Update Reset button click handler**
  Reset `selectedPackId` when user clicks the "Đặt lại" button:
  ```typescript
              <button
                onClick={() => {
                  setFilterCategory("all");
                  setFilterItemType("all");
                  setOnlyMistakes(false);
                  setActiveSkillGroup("all");
                  setSelectedPackId("all");
                }}
                className="h-[38px] text-xs font-semibold bg-slate-950 text-slate-400 border border-slate-850 hover:bg-slate-900 rounded-xl flex items-center justify-center transition cursor-pointer w-full"
              >
                Đặt lại
              </button>
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/app/practice/page.tsx
  git commit -m "feat: implement sequential pack filtering logic and reset hook integration"
  ```

---

### Task 4: Add Dropdown Selector UI

**Files:**
- Modify: [src/app/practice/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/practice/page.tsx)

- [ ] **Step 1: Add Dropdown Select component to Filters Panel**
  Insert the dropdown selector within the filters panel grid (under the existing filters grid). Render it only when a skill group is active (`activeSkillGroup !== "all"`):
  ```jsx
            {/* Item Type Filter */}
            <div className="flex flex-col gap-1.5">
              ...
            </div>

            {/* Shuffle & Reset Buttons */}
            <div className="grid grid-cols-2 gap-2 self-end w-full">
              ...
            </div>

            {/* Pack Selector Dropdown */}
            {activeSkillGroup !== "all" && (
              <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-3 border-t border-slate-800/60 pt-3">
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

- [ ] **Step 2: Commit UI updates**
  ```bash
  git add src/app/practice/page.tsx
  git commit -m "feat: render pack select dropdown filter on skill group selection"
  ```

- [ ] **Step 3: Run full build check**
  Run: `npm run build`
  Expected: Complete production build succeeds with no type errors or styling compile failures.
