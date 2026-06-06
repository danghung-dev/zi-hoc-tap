# Output conventions for the zi-hoc-tap practice data

These are the de-facto rules observed in the live codebase
(`public/data/levels/n4/...`, `src/lib/practice/types.ts`). The running app does
**no runtime schema validation**, so drift here silently breaks rendering — match
these exactly.

## 1. Where files go

```
public/data/levels/{level-lowercase}/
  packs.json                          # index — app only loads packs listed here
  vocabulary/{kebab-type}-NNN.json    # one file per mondai (a "pack")
  grammar_reading/{kebab-type}-NNN.json
```

- Level directory is **lowercase** (`n4`) even though `level` inside JSON is `"N4"`.
- `section` is the subdirectory: `vocabulary` or `grammar_reading` (listening is out of scope).
- One mondai → one pack file → one entry in `packs.json`.
- `NNN` is a 3-digit zero-padded **pack** number, scoped per `{kebab-type}`. Before
  writing, read `packs.json` and use the next free number for that type (start `001`).

## 2. Mondai → type mapping (standard GoJapan N4 layout)

Decide the type from the parser `signals` first, then fall back to mondai order. The
`signals` win when the mondai order differs from this table.

| 問題 | signal / cue | section | jlptItemType | uiTemplate | file kebab | question-id stem | pack-id stem |
|---|---|---|---|---|---|---|---|
| 1 | kanji underlined, choices=kana | vocabulary | `kanji_reading` | `standard_quiz` | `kanji-reading` | `kanji` | `vocab_kanji_reading` |
| 2 | kana underlined, choices=kanji | vocabulary | `orthography` | `standard_quiz` | `orthography` | `ortho` | `vocab_orthography` |
| 3 | `（　）` blank, vocab choices | vocabulary | `contextually_defined_expressions` | `standard_quiz` | `context` | `context` | `vocab_context` |
| 4 | "same meaning" instruction | vocabulary | `paraphrases` | `standard_quiz` | `paraphrase` | `paraphrase` | `vocab_paraphrase` |
| 5 | "usage" instruction | vocabulary | `usage` | `standard_quiz` | `usage` | `usage` | `vocab_usage` |
| 6 | `（　）` blank, grammar choices | grammar_reading | `sentential_grammar_1` | `standard_quiz` | `grammar-choice` | `grammar_choice` | `grammar_choice` |
| 7 | `signals.hasStar` ★ | grammar_reading | `sentential_grammar_2_sentence_composition` | `sentence_scramble` | `sentence-scramble` | `scramble` | `grammar_scramble` |
| 8 | `signals.hasNumberedBlanks` `[n]` | grammar_reading | `text_grammar` | `text_grammar_cloze` | `text-grammar` | `text_grammar` | `text_grammar` |
| 9 | passage in each question's content | grammar_reading | `reading_short_passage` | `reading_split_screen` | `reading-short` | `reading_short` | `reading_short` |
| 10 | shared passage block | grammar_reading | `reading_mid_size_passage` | `reading_split_screen` | `reading-mid` | `reading_mid` | `reading_mid` |
| 11 | `signals.hasImages` notice image | grammar_reading | `information_retrieval` | `document_scan` | `info-retrieval` | `info` | `info_retrieval` |

- Question id: `{level-lower}_{section-short}_{stem}_NNN` where section-short is `vocab`
  or `grammar`. Examples: `n4_vocab_kanji_001`, `n4_grammar_scramble_001`,
  `n4_grammar_text_grammar_001`, `n4_grammar_info_001`.
- Pack id: `{level-lower}_{pack-id-stem}_NNN`, e.g. `n4_vocab_kanji_reading_001`,
  `n4_grammar_scramble_001`.

## 3. Canonical instruction text (`question.instruction`)

The parser's mondai `instruction` is noisy (`＊`, full-width padding). Do NOT copy it.
Write the clean standard JLPT instruction for the type:

| type | instruction |
|---|---|
| kanji_reading | `下線の言葉はどう読みますか。` |
| orthography | `下線の言葉は漢字でどう書きますか。` |
| contextually_defined_expressions | `（　）に何を入れますか。` |
| paraphrases | `＿の文とだいたい同じ意味の文を選んでください。` |
| usage | `つぎの言葉の使い方として最もよいものを選んでください。` |
| sentential_grammar_1 | `（　）に何を入れますか。` |
| sentence_scramble | `★に入るものはどれですか。` |

## 4. standard_quiz field rules (match `kanji-reading-001.json` exactly)

- `stem`: original question number prefix + keep the `<u>…</u>` from `contentHtml`,
  e.g. `"1. <u>歌</u>がじょうずです。"`. The component renders `stem` with
  `dangerouslySetInnerHTML`, so `<u>` is intentional. Use the parser `contentHtml`
  (it preserves `<u>` and strips images) and prepend `"{number}. "`.
- `underlinedText`: the `underlined[0]` value (duplicated even though unused by the UI).
- `options`: exactly 4, ids `"A" "B" "C" "D"` mapped from parser indexes 0→A … 3→D,
  `text` = parser option text. Exactly one `isCorrect: true`, and it MUST equal
  `answer.correctOptionId`. Every option gets a Vietnamese `explanationVi` (why it is
  right / what the wrong choice actually means).
- `answer`: `correctOptionId`, terse `shortExplanationVi` (e.g. `"歌 = うた"`),
  `fullExplanationVi`, optional `trapVi`, optional `translationVi` (Vietnamese
  translation of the full sentence). Japanese terms are quoted with 「」.
- `difficulty`: judge 1 = easy / 2 = medium / 3 = hard.
- `tags`: lowercase keyword array, e.g. `["kanji","verb","te-form"]`.

### customClassification
- `source`: always `"zi_jlpt_n4_taxonomy_v1"` (swap `n4` per level).
- `categoryId`: SCREAMING_SNAKE_CASE grouping by sub-theme, e.g. `KANJI_READING_VERB`,
  `KANJI_READING_FAMILY`, `GRAMMAR_PARTICLE`, `READING_DETAIL`. Group questions that
  share a theme under the same id; this drives the filter dropdown on `/practice`.
- `categoryName`: Vietnamese name of that category, e.g. `"Đọc Kanji động từ"`.
- `displayLabel`: `"{nhóm}: {tiêu điểm}"`, e.g. `"Động từ nhóm 1: 急ぐ"`.
- `showOnCard`: `true`.

## 5. Other templates (build per `references/json_schemas.md`)

Only `standard_quiz` renders in the app today; the rest fall through to an
"unsupported" placeholder. Still generate valid JSON so the data is ready — but flag
this in the final report. Authoring notes:

- **sentence_scramble** (§3.2): parser gives `contentText` with `____`/`__★__` slots
  and 4 fragment options. Reconstruct the grammatical sentence: set `fixedParts`
  (the fixed words + `____`/`★` skeleton from the content), `fragments` (A–D), then
  reason out `correctOrder`, which fragment lands on `★` (`correctStarFragmentId`),
  the `completedSentence`, `translationVi`, and `fragmentExplanationsVi`.
- **text_grammar_cloze** (§3.3): the shared passage (parser `passages[0].text`) holds
  `[1]…[n]`. Convert `[n]` to `[blank_n]` in `passage.text`. Each question (parser
  `contentText` = the bare blank number) becomes a `questions[]` entry with `blankId`
  `blank_n`, its 4 options, and an `answer` with evidence + `logicVi`.
- **reading_split_screen** (§3.4): 問題9 embeds the passage inside each question's
  content (split the passage from the trailing question sentence — the last sentence is
  the actual question). 問題10 shares one passage block for several questions. Put the
  passage in `passage.text` (+ `translationVi`) and the question prompt in
  `questions[].questionText`.
- **document_scan** (§3.5): the notice is an **image** (`passages[].images[0]`). You
  cannot read it from HTML — download the image and Read it, then author `document`,
  `conditions`, `options`, and `answer.evidenceTexts`. If the image cannot be read,
  skip mondai 11 and say so in the report.

## 6. packs.json registration

After writing each pack file, append an entry (it is a flat array):
```json
{
  "id": "n4_vocab_kanji_reading_001",
  "section": "vocabulary",
  "jlptItemType": "kanji_reading",
  "uiTemplate": "standard_quiz",
  "file": "vocabulary/kanji-reading-001.json",
  "title": "Luyện đọc chữ Kanji - Pack 1",
  "count": 9
}
```
- `file` is relative to the level dir.
- `count` MUST equal the number of question objects in the file.
- `title` is a short Vietnamese label ("Luyện … - Pack N").
- Do not duplicate an existing `id`. If the type already has packs, continue the number.

## 7. Self-check before finishing

- Every pack file is a JSON array that parses.
- standard_quiz: 4 options A–D, exactly one `isCorrect` matching `correctOptionId`.
- No duplicate question ids across files; ids zero-padded and sequential.
- `packs.json` `count` matches each file; `file` path exists.
- The existing `kanji-reading-001.json` (converted 問題1 of dethi3) is the gold sample
  for tone and depth of the Vietnamese explanations — match that quality.
