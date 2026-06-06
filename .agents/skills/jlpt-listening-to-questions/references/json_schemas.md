# JLPT Question JSON Schemas Reference

This document outlines the standard JSON schemas used for the JLPT N5–N1 prep platform. All question types share a common base structure but extend it with specific fields depending on their interactive UI template (`uiTemplate`).

---

## 1. Summary of UI Templates

| Template Name | Used For | Description |
| :--- | :--- | :--- |
| `standard_quiz` | Kanji reading, Orthography, Context, Paraphrase, Usage, Grammar choice | Standard single-choice question with 4 choices. |
| `sentence_scramble` | Sentential grammar 2 (Sắp xếp câu / Câu dấu sao `★`) | Reordering word/phrase fragments to form a coherent sentence. Points are awarded based on finding the fragment at the `★` position. |
| `text_grammar_cloze` | Grammar in context (Ngữ pháp trong đoạn văn) | A passage containing multiple blanks (`blank_1`, `blank_2`, etc.) which are solved inline. |
| `reading_split_screen` | Reading comprehension (Đọc hiểu đoạn ngắn / vừa) | Left side displays the passage text, right side displays one or more comprehension questions. |
| `document_scan` | Info retrieval (Tìm kiếm thông tin trong bảng, poster) | Left side displays a document (text and/or image), right side displays a checklist of conditions and questions. |
| `listening_player` | Listening comprehension (Nghe hiểu, Quick Response) | Integrates an audio player. Transcript and highlight details are hidden until the user submits their answer. |

---

## 2. Base Schema (Common Fields)

Every question JSON object must include these base fields:

```json
{
  "id": "string (unique identifier, e.g., 'n4_vocab_kanji_001')",
  "level": "string ('N1' | 'N2' | 'N3' | 'N4' | 'N5')",
  "section": "string ('vocabulary' | 'grammar_reading' | 'listening')",
  "jlptItemType": "string (standard JLPT categorization, see section 9)",
  "uiTemplate": "string ('standard_quiz' | 'sentence_scramble' | 'text_grammar_cloze' | 'reading_split_screen' | 'document_scan' | 'listening_player')",
  "difficulty": "number (1 = easy, 2 = medium, 3 = hard)",
  "tags": ["string (keywords for filtering)"],
  "customClassification": {
    "source": "string (e.g., 'zi_jlpt_n4_taxonomy_v1')",
    "categoryId": "string",
    "categoryName": "string",
    "subCategoryId": "string (optional)",
    "subCategoryName": "string (optional)",
    "displayLabel": "string (for badges/tagging in cards)",
    "showOnCard": "boolean"
  }
}
```

---

## 3. Template-Specific Schemas

### 3.1 Standard Quiz (`standard_quiz`)

Used for standard multiple-choice questions.

```json
{
  "id": "n4_vocab_kanji_001",
  "level": "N4",
  "section": "vocabulary",
  "jlptItemType": "kanji_reading",
  "uiTemplate": "standard_quiz",
  "difficulty": 2,
  "tags": ["kanji", "travel", "long-vowel"],
  "customClassification": {
    "source": "zi_jlpt_n4_taxonomy_v1",
    "categoryId": "KANJI_READING",
    "categoryName": "Đọc Kanji",
    "displayLabel": "Đọc Kanji: Trường âm",
    "showOnCard": true
  },
  "question": {
    "instruction": "下線の言葉はどう読みますか。",
    "stem": "来週、京都へ旅行します。",
    "underlinedText": "旅行"
  },
  "options": [
    {
      "id": "A",
      "text": "りょこう",
      "isCorrect": true,
      "explanationVi": "Đúng. 「旅行」 đọc là 「りょこう」."
    },
    {
      "id": "B",
      "text": "りょうこう",
      "isCorrect": false,
      "explanationVi": "Sai vì thừa âm dài 「う」 sau 「りょ」."
    },
    {
      "id": "C",
      "text": "りょこ",
      "isCorrect": false,
      "explanationVi": "Sai vì thiếu âm dài ở cuối. Đúng là 「こう」."
    },
    {
      "id": "D",
      "text": "たびこう",
      "isCorrect": false,
      "explanationVi": "Sai vì đây là từ ghép, không đọc từng chữ rời."
    }
  ],
  "answer": {
    "correctOptionId": "A",
    "shortExplanationVi": "旅行 = りょこう.",
    "fullExplanationVi": "Với từ ghép Kanji, nên nhớ cả cụm từ thay vì đọc từng chữ riêng lẻ.",
    "trapVi": "Bẫy trường âm và đọc tách từng Kanji.",
    "translationVi": "Tuần sau tôi sẽ đi du lịch Kyoto."
  }
}
```

---

### 3.2 Sentence Scramble (`sentence_scramble`)

Used to test sentence composition. Users drag and drop or click fragments to order them into the blank lines.

```json
{
  "id": "n4_grammar_scramble_001",
  "level": "N4",
  "section": "grammar_reading",
  "jlptItemType": "sentential_grammar_2_sentence_composition",
  "uiTemplate": "sentence_scramble",
  "difficulty": 3,
  "tags": ["sentence-composition", "ta-koto-ga-aru"],
  "customClassification": {
    "source": "zi_jlpt_n4_taxonomy_v1",
    "categoryId": "EXPERIENCE",
    "categoryName": "Kinh nghiệm",
    "displayLabel": "Ngữ pháp: Đã từng làm",
    "showOnCard": true
  },
  "question": {
    "instruction": "★に入るものはどれですか。",
    "fixedParts": ["私は", "____", "____", "★", "____", "あります。"],
    "fragments": [
      { "id": "A", "text": "日本へ" },
      { "id": "B", "text": "行った" },
      { "id": "C", "text": "ことが" },
      { "id": "D", "text": "一度" }
    ]
  },
  "answer": {
    "correctOrder": ["D", "A", "B", "C"],
    "correctStarFragmentId": "B",
    "completedSentence": "私は一度日本へ行ったことがあります。",
    "translationVi": "Tôi đã từng đi Nhật một lần.",
    "shortExplanationVi": "Cụm đúng là 「行ったことがあります」.",
    "fullExplanationVi": "「Vたことがあります」 dùng để nói đã từng có kinh nghiệm làm gì.",
    "fragmentExplanationsVi": {
      "A": "「日本へ」 chỉ hướng đi, đứng trước động từ.",
      "B": "Đúng vị trí ★ vì 「行ったことが」 là cụm liền nhau.",
      "C": "「ことが」 phải đứng sau động từ quá khứ.",
      "D": "「一度」 là trạng từ chỉ số lần, thường đặt trước cụm hành động."
    },
    "trapVi": "Sai thường gặp là không nhận ra cụm cố định 「Vたことがあります」."
  }
}
```

---

### 3.3 Text Grammar / Cloze (`text_grammar_cloze`)

Used for parsing a text passage containing blanks with multiple-choice items inline.

```json
{
  "id": "n4_text_grammar_001",
  "level": "N4",
  "section": "grammar_reading",
  "jlptItemType": "text_grammar",
  "uiTemplate": "text_grammar_cloze",
  "difficulty": 3,
  "tags": ["connector", "sequence"],
  "customClassification": {
    "source": "zi_jlpt_n4_taxonomy_v1",
    "categoryId": "DISCOURSE_CONNECTOR",
    "categoryName": "Từ nối trong đoạn văn",
    "displayLabel": "Mạch văn: Trình tự",
    "showOnCard": true
  },
  "passage": {
    "title": "週末",
    "text": "昨日、友だちと映画を見に行きました。[blank_1]、レストランでご飯を食べました。",
    "translationVi": "Hôm qua tôi đi xem phim với bạn. Sau đó, chúng tôi ăn cơm ở nhà hàng."
  },
  "questions": [
    {
      "id": "q1",
      "blankId": "blank_1",
      "options": [
        {
          "id": "A",
          "text": "đáo án 1 (đối lập - sai)",
          "isCorrect": false,
          "explanationVi": "Sai. 「`đối lập`」 dùng cho ý đối lập, nhưng hai câu này là trình tự thời gian."
        },
        {
          "id": "B",
          "text": "そのあと",
          "isCorrect": true,
          "explanationVi": "Đúng. Câu sau xảy ra sau việc đi xem phim."
        },
        {
          "id": "C",
          "text": "đáp án 3 (lý do - sai)",
          "isCorrect": false,
          "explanationVi": "Sai. 「`lý do``」 chỉ kết quả/lý do, không hợp mạch câu này."
        },
        {
          "id": "D",
          "text": "đáp án 4 (đối lập - sai)",
          "isCorrect": false,
          "explanationVi": "Sai. 「`đối lập`」 cũng là đối lập, không phù hợp."
        }
      ],
      "answer": {
        "correctOptionId": "B",
        "evidenceBefore": "昨日、友だちと映画を見に行きました。",
        "evidenceAfter": "レストランでご飯を食べました。",
        "logicVi": "Cần đọc cả câu trước và câu sau chỗ trống để xác định quan hệ ý."
      }
    }
  ]
}
```

---

### 3.4 Reading Split Screen (`reading_split_screen`)

Used for reading passages with comprehension questions side-by-side.

```json
{
  "id": "n4_reading_short_001",
  "level": "N4",
  "section": "grammar_reading",
  "jlptItemType": "reading_short_passage",
  "uiTemplate": "reading_split_screen",
  "difficulty": 2,
  "tags": ["email", "time", "classroom"],
  "passage": {
    "title": "メール",
    "text": "田中さんへ\n明日の授業は午後一時からです。教室は二階 của 201です。教科書を忘れないでください。\n山田",
    "translationVi": "Gửi Tanaka,\nBuổi học ngày mai bắt đầu từ 1 giờ chiều. Phòng học là 201 ở tầng 2. Đừng quên sách giáo khoa.\nYamada"
  },
  "questions": [
    {
      "id": "q1",
      "questionText": "明日の授業は何時からですか。",
      "questionTranslationVi": "Buổi học ngày mai bắt đầu từ mấy giờ?",
      "options": [
        {
          "id": "A",
          "text": "午前一時",
          "isCorrect": false,
          "explanationVi": "Sai vì bài viết là 「午後一時」, không phải 「午前一時」."
        },
        {
          "id": "B",
          "text": "午後一時",
          "isCorrect": true,
          "explanationVi": "Đúng. Trong bài có câu 「明日の授業は午後一時からです。」"
        },
        {
          "id": "C",
          "text": "午後二時",
          "isCorrect": false,
          "explanationVi": "Sai. 「二階」 là tầng 2, không phải 2 giờ."
        },
        {
          "id": "D",
          "text": "午前二時",
          "isCorrect": false,
          "explanationVi": "Sai cả buổi và giờ."
        }
      ],
      "answer": {
        "correctOptionId": "B",
        "evidenceText": "明日の授業は午後一時からです。",
        "strategyVi": "Câu hỏi hỏi 「何時」 nên cần tìm thông tin thời gian."
      }
    }
  ]
}
```

---

### 3.5 Document Scan / Info Retrieval (`document_scan`)

Specifically optimized for searching schedules, directories, notices, and pamphlets. Features a checklist of conditions that the student should cross off to narrow down options.

```json
{
  "id": "n4_info_001",
  "level": "N4",
  "section": "grammar_reading",
  "jlptItemType": "information_retrieval",
  "uiTemplate": "document_scan",
  "difficulty": 3,
  "tags": ["notice", "schedule", "conditions"],
  "document": {
    "type": "notice",
    "title": "日本語教室のお知らせ",
    "text": "土曜日のクラスは午後2時から4時までです。料金は800円です。予約はいりません。",
    "image": {
      "src": "images/info/notice_001.png",
      "alt": "日本語教室のお知らせ"
    }
  },
  "question": {
    "text": "土曜日の午後に参加したい人は、どのクラスに行けますか。",
    "translationVi": "Người muốn tham gia vào chiều thứ Bảy có thể đi lớp nào?",
    "conditions": [
      {
        "id": "c1",
        "labelVi": "Ngày học: Thứ Bảy",
        "keywordJa": "土曜日"
      },
      {
        "id": "c2",
        "labelVi": "Khung giờ: Chiều (sau 12h)",
        "keywordJa": "午後"
      },
      {
        "id": "c3",
        "labelVi": "Đăng ký: Không cần đặt trước",
        "keywordJa": "予約はいりません"
      }
    ]
  },
  "options": [
    {
      "id": "A",
      "text": "午前のクラス",
      "isCorrect": false,
      "explanationVi": "Sai vì câu hỏi yêu cầu buổi chiều."
    },
    {
      "id": "B",
      "text": "午後2時のクラス",
      "isCorrect": true,
      "explanationVi": "Đúng vì lớp diễn ra thứ Bảy, từ 2 giờ chiều, không cần đặt trước."
    }
  ],
  "answer": {
    "correctOptionId": "B",
    "evidenceTexts": [
      "土曜日のクラスは午後2時から4時までです。",
      "予約はいりません。"
    ],
    "logicVi": "Đối chiếu từng điều kiện: thứ Bảy, buổi chiều, không cần đặt trước."
  }
}
```

---

### 3.6 Listening Player (`listening_player`)

Used for all listening questions. Supports loading audio streams and optional visuals. Includes two presentation modes: standard comprehension and quick response.

#### 3.6.1 Standard Comprehension Mode
Options are displayed as text choices.

```json
{
  "id": "n4_listening_task_001",
  "level": "N4",
  "section": "listening",
  "jlptItemType": "task_based_comprehension",
  "uiTemplate": "listening_player",
  "difficulty": 2,
  "tags": ["task", "final-decision", "station"],
  "media": {
    "audio": {
      "src": "audio/task/q001.mp3",
      "durationSec": 42
    },
    "image": null
  },
  "question": {
    "instruction": "男の人と女の人が話しています。男の人はこれから何をしますか。",
    "instructionVi": "Một người nam và một người nữ đang nói chuyện. Người nam sau đây sẽ làm gì?",
    "textVisibleBeforeAudio": true
  },
  "options": [
    {
      "id": "A",
      "text": "スーパーへ行きます",
      "isCorrect": false,
      "explanationVi": "Sai. Siêu thị được nhắc lúc đầu nhưng sau đó kế hoạch thay đổi."
    },
    {
      "id": "B",
      "text": "駅へ行きます",
      "isCorrect": true,
      "explanationVi": "Đúng. Cuối đoạn hội thoại người nữ chốt là đi ga trước."
    }
  ],
  "answer": {
    "correctOptionId": "B",
    "transcriptJa": "女：スーパーへ行ってください。\n男：đáp án... \n女：そうですね。じゃあ、駅へ行ってください。",
    "translationVi": "Nữ: Hãy đi siêu thị nhé.\nNam: Nhưng tôi nên đi ga trước phải không?\nNữ: Ừ nhỉ. Vậy hãy đi ga trước.",
    "highlightTranscript": [
      "じゃあ、駅へ行ってください。"
    ],
    "shortExplanationVi": "Đáp án đúng là đi ga.",
    "trapVi": "Bẫy là chọn kế hoạch ban đầu thay vì quyết định cuối cùng.",
    "listeningStrategyVi": "Chú ý các từ đổi hướng như でも, じゃあ, やっぱり."
  },
  "playbackPolicy": {
    "practiceModeReplay": true,
    "examModeReplay": false,
    "showTranscriptBeforeAnswer": false,
    "showTranscriptAfterAnswer": true
  }
}
```

#### 3.6.2 Quick Response Mode (`buttonMode: true`)
Used when choices are spoken aloud in the audio itself. Options are initially rendered as simple numeric buttons (`1`, `2`, `3`) to mirror the exam experience. Text options appear only *after* selection.

```json
{
  "id": "n4_listening_quick_001",
  "level": "N4",
  "section": "listening",
  "jlptItemType": "quick_response",
  "uiTemplate": "listening_player",
  "difficulty": 2,
  "tags": ["quick-response", "permission"],
  "media": {
    "audio": {
      "src": "audio/quick/q001.mp3",
      "durationSec": 8
    }
  },
  "question": {
    "instruction": "返事としていちばんいいものを選んでください。",
    "textVisibleBeforeAudio": false,
    "buttonMode": true
  },
  "options": [
    {
      "id": "1",
      "textAfterAnswer": "はい、どうぞ。",
      "isCorrect": true,
      "explanationVi": "Đúng. Câu hỏi là xin phép, nên trả lời cho phép là tự nhiên."
    },
    {
      "id": "2",
      "textAfterAnswer": "いいえ、行きません。",
      "isCorrect": false,
      "explanationVi": "Sai. Đây không phải câu trả lời phù hợp cho xin phép."
    },
    {
      "id": "3",
      "textAfterAnswer": "ありがとうございます。",
      "isCorrect": false,
      "explanationVi": "Sai. Đây là lời cảm ơn, không trả lời trực tiếp câu xin phép."
    }
  ],
  "answer": {
    "correctOptionId": "1",
    "promptTranscriptJa": "ここで写真を撮ってもいいですか。",
    "promptTranslationVi": "Tôi chụp ảnh ở đây được không?",
    "strategyVi": "Nghe cuối câu 「～てもいいですか」 để nhận ra đây là câu xin phép."
  }
}
```

---

## 5. Item Type Enums (`jlptItemType`)

For correct category tags, map your items to these exact keys:

### 5.1 Vocabulary (`vocabulary`)
- `kanji_reading`: Kanji reading (漢字読み)
- `orthography`: Orthography (表記)
- `contextually_defined_expressions`: Context (文脈規定)
- `paraphrases`: Paraphrases (言い換え類義語)
- `usage`: Usage (用途)

### 5.2 Grammar & Reading (`grammar_reading`)
- `sentential_grammar_1`: Sentential Grammar 1 (文の文法 1 - 選択)
- `sentential_grammar_2_sentence_composition`: Sentential Grammar 2 (文 của 文法 2 - 順序 - Scramble)
- `text_grammar`: Text Grammar (文章の文法)
- `reading_short_passage`: Short Reading (読解 短文)
- `reading_mid_size_passage`: Mid Reading (読解 中文)
- `information_retrieval`: Information Retrieval (情報検索)

### 5.3 Listening (`listening`)
- `task_based_comprehension`: Task-based (課題理解)
- `comprehension_of_key_points`: Point Comprehension (ポイント理解)
- `verbal_expressions`: Verbal Expressions (発話表現)
- `quick_response`: Quick Response (即時応答)
