# Plan: Skill chuyển đề thi JLPT (HTML) → JSON câu hỏi

## Context

Dự án `zi-hoc-tap` là nền tảng luyện thi JLPT (Next.js). Câu hỏi luyện tập được lưu dưới
dạng JSON theo schema ở `docs/template/json_schemas.md` và được app load qua
`src/lib/practice/data-loader.ts`. Hiện đã có 1 file mẫu được convert tay từ đề thi
(`public/data/levels/n4/vocabulary/kanji-reading-001.json`).

Nguồn đề thi là các file HTML xuất từ gojapan.vn (mẫu: `temp/dethi3.html`). Các đề khác
có nội dung khác nhưng **cấu trúc HTML giống hệt nhau**, nên có thể tự động hóa việc
convert. Mục tiêu: tạo một **skill** (qua skill-creator) để mỗi khi có file HTML đề thi
mới, Claude đọc và sinh ra các file JSON câu hỏi đúng schema, đăng ký vào packs.json,
sẵn sàng cho app dùng.

### Phát hiện quan trọng từ khảo sát (định hình thiết kế skill)

1. **HTML KHÔNG chứa đáp án đúng.** Đáp án được chấm server-side (WordPress
   `admin-ajax.php`, action `set_point`, `post_id=356`). Radio chỉ có `value="0..3"` =
   lựa chọn, không đánh dấu đúng/sai. → **Claude phải tự suy luận đáp án** bằng kiến
   thức tiếng Nhật và **tự viết toàn bộ giải thích tiếng Việt** (explanationVi, trapVi,
   translationVi...), đúng như cách file mẫu đã được tạo. (Quyết định của user.)
2. **Phạm vi: chỉ Part 1** — 言語知識（文字・漢字・文法）- 読解 (mondai 1–11). **Bỏ phần
   nghe (聴解)** vì HTML chỉ có file MP3, không có transcript. (Quyết định của user.)
3. **Tự đăng ký packs.json** sau khi sinh file. (Quyết định của user.)
4. Hiện app **chỉ render `standard_quiz`**; 5 template còn lại rơi vào placeholder
   "chưa hỗ trợ". Skill vẫn sinh JSON đầy đủ cho mọi template trong Part 1 (sẵn cho
   tương lai), nhưng cần nêu rõ giới hạn này trong output.

### Cấu trúc HTML cần parse (tóm tắt selector)

- Part wrapper: `div.part-wrapper.row[data-timer]` (p1 = 100 phút). Part 1 là phần cần xử lý.
- Mondai: `div.mondai` → `h3 > span.me-2` (`問題N:`) + `span` (đề bài).
- Câu hỏi: `div.p-3.d-flex.border-bottom` chứa `h4` (số câu) + `div.question[id="anchor_p1_mN_qM"]`
  → `div.content` (đề câu, có thể chứa `<u>`, `<img>`, dấu cách full-width `　`, `★`, `[n]`).
- Đáp án: `div.answer` → mỗi `div.form-check` có `input[type=radio][value=0..3]` + `label` (nội dung lựa chọn, padding nhiều tab/space → cần trim).
- **Khối passage** (đọc hiểu/cloze/info): `div.p-3.border-bottom` KHÔNG có `.d-flex`,
  KHÔNG có `.question` → là đoạn văn dùng chung, có thể chứa `<img src>`.
- Mapping mondai (đề N4 chuẩn GoJapan):

| Mondai | Loại | section | jlptItemType | uiTemplate |
|---|---|---|---|---|
| 1 | Đọc kanji (kanji→hiragana) | vocabulary | kanji_reading | standard_quiz |
| 2 | Chữ viết (kana→kanji) | vocabulary | orthography | standard_quiz |
| 3 | Điền từ theo ngữ cảnh | vocabulary | contextually_defined_expressions | standard_quiz |
| 4 | Câu đồng nghĩa | vocabulary | paraphrases | standard_quiz |
| 5 | Cách dùng từ | vocabulary | usage | standard_quiz |
| 6 | Chọn ngữ pháp | grammar_reading | sentential_grammar_1 | standard_quiz |
| 7 | Sắp xếp câu (★) | grammar_reading | sentential_grammar_2_sentence_composition | sentence_scramble |
| 8 | Ngữ pháp đoạn văn ([1]-[5]) | grammar_reading | text_grammar | text_grammar_cloze |
| 9 | Đọc hiểu đoạn ngắn | grammar_reading | reading_short_passage | reading_split_screen |
| 10 | Đọc hiểu đoạn vừa | grammar_reading | reading_mid_size_passage | reading_split_screen |
| 11 | Tìm kiếm thông tin (ảnh) | grammar_reading | information_retrieval | document_scan |

> Skill suy ra loại theo **heuristic cấu trúc** (★ → scramble; có khối passage + content là số → cloze; có passage + câu hỏi → reading; có `<img>` notice → document_scan) **kết hợp** bảng mapping mondai chuẩn này; ưu tiên heuristic khi mondai lệch thứ tự.

### Quy ước output (đã quan sát từ dữ liệu thật)

- Thư mục: `public/data/levels/{level-lowercase}/{section}/{kebab-type}-NNN.json`.
- Pack id: `n4_{sectionShort}_{type}_NNN` (snake_case). Question id: `n4_{sectionShort}_{stem}_NNN` (vd `n4_vocab_kanji_001`).
- `stem` của standard_quiz: tiền tố số câu gốc + giữ `<u>...</u>` (vd `"1. <u>歌</u>がじょうずです。"`); `underlinedText` lặp lại từ gạch chân.
- options: đúng 4, id `"A"`–`"D"`, mỗi option có `explanationVi`; đúng 1 `isCorrect:true` khớp `answer.correctOptionId`.
- `customClassification.source = "zi_jlpt_n4_taxonomy_v1"`, `categoryId` SCREAMING_SNAKE_CASE, `showOnCard:true`.
- Mỗi mondai → 1 pack file; phải append entry vào `public/data/levels/{level}/packs.json` (`id, section, jlptItemType, uiTemplate, file, title, count` đúng).

---

## Việc cần làm: dùng skill-creator để tạo skill

Tạo skill tại `~/.claude/skills/jlpt-html-to-questions/` (hoặc thư mục skill của dự án nếu user muốn skill cục bộ — sẽ xác nhận khi thực thi).

### 1. `SKILL.md`
- **name**: `jlpt-html-to-questions`
- **description** (pushy, tiếng Việt + keyword): kích hoạt khi user đưa file HTML đề thi
  JLPT / gojapan / "đề thi", "dethi*.html", yêu cầu convert đề sang JSON câu hỏi luyện tập,
  hoặc nhắc tới schema ở `docs/template/json_schemas.md`.
- **Body workflow**:
  1. Chạy `scripts/parse_exam_html.py <file.html> > /tmp/exam_raw.json` để trích xuất
     **deterministic** toàn bộ Part 1: danh sách mondai, instruction, từng câu (id, content
     thô giữ `<u>`/`★`/`[n]`/`<img src>`, 4 label đáp án đã trim), các khối passage + ảnh.
     → Tránh để Claude chép tay tiếng Nhật (dễ sai full-width space, tab padding).
  2. Đọc raw JSON. Với **mỗi mondai**, xác định section/jlptItemType/uiTemplate theo bảng
     mapping + heuristic.
  3. Với **mỗi câu**: dùng kiến thức tiếng Nhật **tự xác định đáp án đúng**, rồi build
     object theo đúng schema template tương ứng và **tự viết giải thích tiếng Việt** cho
     mọi field giải thích. (scramble: tự suy `correctOrder`, `correctStarFragmentId`,
     `completedSentence`; cloze/reading: tự chọn đáp án + viết evidence/strategy/logic.)
  4. document_scan (mondai 11): nội dung nằm trong `<img>`. Tải ảnh về và dùng Read để
     đọc, sau đó mới tạo conditions/options/answer. Nếu không đọc được ảnh → báo user và
     bỏ qua mondai đó.
  5. Gom câu theo mondai → ghi pack file đúng đường dẫn/naming; **append vào packs.json**;
     đảm bảo `count` khớp số câu, không trùng id (đọc dữ liệu hiện có để tiếp số thứ tự).
  6. Báo cáo: bảng tổng kết (mondai → file → số câu → template), và **cảnh báo** template
     nào app chưa render (chỉ `standard_quiz` render được hiện tại).
- Nhấn mạnh nguyên tắc: parser lo phần trích xuất máy móc; Claude lo phần phán đoán ngôn
  ngữ (đáp án + giải thích) — giải thích vì sao tách như vậy (chính xác + chất lượng).

### 2. `scripts/parse_exam_html.py`
Python (BeautifulSoup hoặc lxml). Input: file HTML. Output: JSON trung gian gồm Part 1,
mảng mondai, mỗi mondai có instruction + mảng questions (anchorId, số câu, contentHtml,
contentText, underlined[], stars, blanks[], images[], options[{index,text}]) + passages[]
(text, images). KHÔNG suy luận đáp án. Xử lý: trim padding, normalize full-width space,
giữ `<u>`/`★`/`[n]`, phân biệt khối passage (`div.p-3.border-bottom:not(.d-flex)`).

### 3. `references/`
- `json_schemas.md` — copy/đồng bộ từ `docs/template/json_schemas.md` (mọi template + enum jlptItemType).
- `conventions.md` — quy ước id/đường dẫn/categoryId, mapping mondai→type, cách append packs.json, ví dụ thật từ `kanji-reading-001.json` làm gold reference.

### 4. Test / đánh giá (skill-creator loop)
- Eval chính: chạy skill trên `temp/dethi3.html`.
  - **Gold đối chiếu**: mondai 1 đã có `kanji-reading-001.json` → so khớp cấu trúc/đáp án.
  - Assertions tự động (script): JSON hợp lệ; đúng 4 options A–D; đúng 1 isCorrect khớp
    correctOptionId; id/đường dẫn đúng quy ước; packs.json count khớp số câu; pass theo
    `types.ts` cho standard_quiz.
  - Phần chủ quan (chất lượng giải thích tiếng Việt, độ đúng đáp án scramble/đọc hiểu) →
    review qua eval-viewer.
- Chạy with-skill vs baseline (không skill) trên vài mondai đại diện (1 standard_quiz,
  mondai 7 scramble, mondai 9 reading), mở `eval-viewer/generate_review.py` cho user xem,
  rồi lặp cải thiện.

### Verification (end-to-end)
1. `python scripts/parse_exam_html.py temp/dethi3.html` → raw JSON có đủ 11 mondai Part 1.
2. Chạy skill → sinh các pack file + cập nhật packs.json.
3. `cd zi-hoc-tap && npm run dev`, mở `/practice`, lọc theo jlptItemType mới → câu hỏi
   standard_quiz hiển thị và chấm đúng (isCorrect ↔ correctOptionId nhất quán).
4. Kiểm tra JSON parse được, không trùng id, count khớp.

## Critical files
- Tạo mới: `~/.claude/skills/jlpt-html-to-questions/{SKILL.md, scripts/parse_exam_html.py, references/json_schemas.md, references/conventions.md}`
- Tham chiếu (đọc, không sửa khi tạo skill): `docs/template/json_schemas.md`,
  `src/lib/practice/types.ts`, `public/data/levels/n4/vocabulary/kanji-reading-001.json`,
  `public/data/levels/n4/packs.json`, `temp/dethi3.html`.
- Khi skill chạy thật sẽ ghi vào: `public/data/levels/n4/{section}/*.json` + `packs.json`.
