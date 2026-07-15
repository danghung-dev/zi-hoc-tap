# Design Specification: Show All N3 Kanji Weeks

This specification details the changes required to revert the week-1 filtering logic for N3 Kanji in the `zi-hoc-tap` application, allowing users to view and select all 6 weeks (36 days) of N3 Kanji.

## Context & Motivation

A previous commit (`c149374895eaf6e91f099e736d2da0efe814b4ee`) restricted the N3 Kanji view to Week 1 only, hiding Weeks 2–6 and setting default selections and indicators to assume a 6-day curriculum. The user wants to revert this change and restore access to all 6 weeks (36 days) by default.

## Proposed Changes

We will modify [src/app/page.tsx](file:///Users/hung/projects-nosync/family/zi-hoc-tap/src/app/page.tsx) to revert the changes introduced in that commit.

### 1. State Initialization
In the mounting `useEffect`, select all days from all 6 weeks instead of only Week 1.

```diff
  useEffect(() => {
    // 1. Initial selection is all days of N3 (default level)
    const initialSets = new Set<string>();
-    for (let d = 1; d <= 6; d++) {
-      initialSets.add(`w1_d${d}`);
-    }
+    for (let w = 1; w <= 6; w++) {
+      for (let d = 1; d <= 6; d++) {
+        initialSets.add(`w${w}_d${d}`);
+      }
+    }
    setSelectedSetIds(initialSets);
```

### 2. Level Switcher Selection
Update `handleLevelChange` to select all days of N3 (Weeks 1-6) when switching to N3.

```diff
  const handleLevelChange = (newLevel: "N3" | "N4") => {
    setLevel(newLevel);

    const newSets = new Set<string>();
    if (newLevel === "N3") {
-      for (let d = 1; d <= 6; d++) {
-        newSets.add(`w1_d${d}`);
-      }
+      for (let w = 1; w <= 6; w++) {
+        for (let d = 1; d <= 6; d++) {
+          newSets.add(`w${w}_d${d}`);
+        }
+      }
    } else {
```

### 3. "Select All" Action
Update `handleSelectAll` to add all days of all 6 weeks when N3 is active.

```diff
  const handleSelectAll = () => {
    const newSets = new Set<string>();
    if (level === "N3") {
-      for (let d = 1; d <= 6; d++) {
-        newSets.add(`w1_d${d}`);
-      }
+      for (let w = 1; w <= 6; w++) {
+        for (let d = 1; d <= 6; d++) {
+          newSets.add(`w${w}_d${d}`);
+        }
+      }
    } else {
```

### 4. "Start Learning" Action
Update the fallback auto-selection in `handleStartLearning` when no sets are currently checked.

```diff
      // Auto select all if none is selected
      const allSets = new Set<string>();
      if (level === "N3") {
-        for (let d = 1; d <= 6; d++) {
-          allSets.add(`w1_d${d}`);
-        }
+        for (let w = 1; w <= 6; w++) {
+          for (let d = 1; d <= 6; d++) {
+            allSets.add(`w${w}_d${d}`);
+          }
+        }
      } else {
```

### 5. UI Badge Count
Update the badge showing selected days over the total. Total N3 days is 36 instead of 6.

```diff
                  <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-mono">
                    {level === "N3" 
-                      ? `${selectedSetIds.size}/6 ngày`
+                      ? `${selectedSetIds.size}/36 ngày`
                       : `${selectedSetIds.size}/40 bộ`}
                  </span>
```

### 6. UI List of Sets
Remove the filter that limits the keys of `setNamesN3` to week 1.

```diff
                {/* List of sets */}
                <div className="max-h-[280px] overflow-y-auto pr-1 flex flex-col gap-2 border border-slate-800 rounded-xl p-2 bg-slate-950/50">
                  {level === "N3" ? (
                    Object.keys(setNamesN3)
-                      .filter((idStr) => parseInt(idStr) === 1)
                      .map((idStr) => {
                        const weekId = parseInt(idStr);
```

## Verification Plan

### Manual Verification
1. Run `npm run dev` to start the local server.
2. Verify that on first load, N3 Kanji shows weeks 1 to 6 in the sidebar.
3. Verify that all 36 days are selected by default, and the badge says `36/36 ngày`.
4. Verify that pressing "Bỏ chọn hết" deselects all.
5. Verify that pressing "Chọn tất cả" selects all 36 days.
6. Switch to N4, then switch back to N3, and check if all 36 days are selected.
7. Click "Bắt đầu học" with no days selected, and check if it automatically selects all 36 days.
