---
name: jlpt-html-to-questions
description: >-
  Convert a gojapan.vn / "thi thử JLPT" mock-exam HTML file into the zi-hoc-tap
  practice-question JSON format (the schema in docs/template/json_schemas.md) and
  register the packs in packs.json. Use this whenever the user provides a JLPT exam
  HTML file (e.g. temp/dethi3.html, "đề thi", "dethiN.html", a gojapan.vn exam page),
  asks to convert/import/parse an exam into questions, to generate câu hỏi luyện tập
  from an exam, or to produce practice JSON for N1–N5 — even if they don't name the
  schema. Handles all Part-1 question types (kanji reading, orthography, context,
  paraphrase, usage, grammar choice, sentence scramble ★, text-grammar cloze, reading,
  information retrieval).
---

# JLPT exam HTML → practice question JSON

Convert one exam HTML file into the per-mondai JSON packs that the zi-hoc-tap app
loads. The exam source is a gojapan.vn page; **every exam shares the same HTML
structure**, so a parser does the mechanical extraction and you supply the language
judgement.

## Why the work is split this way

The exam HTML **contains no answer key** — scoring happens server-side, so the
correct option and all explanations are not in the file. The radio `value="0..3"` is
just the choice index. So:

- **`scripts/parse_exam_html.py` does extraction** (questions, stems with `<u>`/`★`/
  `[n]` markers, the four choices, passages, image srcs). This avoids hand-copying
  Japanese text, where full-width spaces and tab padding are easy to corrupt.
- **You do the judgement**: determine the correct answer with your Japanese
  knowledge, and author every Vietnamese explanation (`explanationVi`, `trapVi`,
  `translationVi`, scramble ordering, reading evidence, …).

## Scope

Only **Part 1** — 言語知識（文字・漢字・文法）- 読解 (mondai 1–11). The listening
part (聴解) is skipped: the HTML has only an MP3, no transcript.

## Workflow

1. **Parse.** Run the extractor:
   ```bash
   python3 <skill>/scripts/parse_exam_html.py <exam.html> -o /tmp/exam_raw.json
   ```
   It prints how many mondai/questions it found. Read `/tmp/exam_raw.json`. Each
   mondai has `number`, `instruction`, `signals` (`hasStar`, `hasNumberedBlanks`,
   `hasPassageBlocks`, `hasImages`), `passages[]`, and `questions[]` (with
   `anchorId`, `number`, `contentHtml`, `contentText`, `underlined`, `images`,
   `blankMarkers`, `options[{index,text}]`). It also reports `level` and `exam`.

2. **Classify each mondai.** Map it to `section` / `jlptItemType` / `uiTemplate`
   using the table in `references/conventions.md` — prefer the `signals` over mondai
   order when they disagree.

3. **Build questions.** For each question, determine the correct answer and produce
   the object for its template. Follow `references/conventions.md` §4–5 for
   `standard_quiz` field rules and the per-template notes; consult
   `references/json_schemas.md` for the exact shape of scramble / cloze / reading /
   document_scan. Author Vietnamese explanations matching the depth of the gold
   sample (`public/data/levels/n4/vocabulary/kanji-reading-001.json`). For mondai 11
   (document_scan), the notice is an image — download it and Read it before authoring;
   if unreadable, skip that mondai and note it.

4. **Write packs.** Group each mondai's questions into one pack file at
   `public/data/levels/{level-lower}/{section}/{kebab-type}-NNN.json` (a JSON array).
   Use the next free `NNN` for that type by reading the existing `packs.json`. Keep
   question ids zero-padded and sequential.

5. **Register.** Append one entry per new pack to
   `public/data/levels/{level-lower}/packs.json` with correct `id`, `section`,
   `jlptItemType`, `uiTemplate`, `file`, `title`, and `count` (= number of questions
   in the file). The app will not load a pack that is not listed here.

6. **Self-check & report.** Verify each file (conventions.md §7): valid JSON, 4
   options A–D for standard_quiz with exactly one `isCorrect` matching
   `correctOptionId`, no duplicate ids, `count` matches. Then report a table of
   mondai → file → count → uiTemplate, and **warn** that only `standard_quiz` renders
   in the app today (the other templates produce valid data but currently show an
   "unsupported" placeholder).

## Notes

- An exam may have already been partially converted (e.g. mondai 1 of dethi3 exists as
  `kanji-reading-001.json`). Don't overwrite or duplicate it — continue numbering and
  skip mondai that are already done unless the user asks to redo them.
- Default level/section short codes and id stems live in `references/conventions.md`.
  When extending a type that already has files, match the existing ids in that file.
