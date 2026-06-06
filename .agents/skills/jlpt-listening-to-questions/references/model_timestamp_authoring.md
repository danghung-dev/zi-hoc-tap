# Instructions for Model Chunk Observation & Timestamping

You will be given a 5-minute MP4 video chunk `chunk_NNN.mp4` (which contains the exam audio with a blank black video track). Your task is to listen to the audio track and produce a JSON object summarizing your observations, transcript drafts, and timestamp markers.

## Goals

1. **Identify Key Markers**:
   - `mondai_marker`: When the speaker announces a new Mondai (e.g. 「問題一」、「問題二」).
   - `example_marker`: When the speaker starts or ends an example (e.g. 「例」).
   - `question_start`: When the speaker announces the start of a question (e.g. 「一番」、「二番」).
   - `question_end`: When the question ends (before the next question marker or before silence ends). Note that questions in Mondai 4 might have very short gaps.

2. **Estimate relative timestamps**:
   - Give the time in seconds relative to the start of the current chunk (0.0 means the very beginning of this chunk).

3. **Provide Draft Japanese Transcript**:
   - Transcribe what you hear for each question.

## Output JSON Schema

Your response must be a single, valid JSON block matching this structure:

```json
{
  "chunkId": "chunk_000",
  "observations": [
    {
      "type": "mondai_marker", // or "question_start", "question_end", "example_marker"
      "label": "問題1",        // For mondai_marker
      "mondai": 1,             // For question_start / question_end
      "questionNo": 1,         // For question_start / question_end (1-based index within Mondai)
      "timeInChunkSec": 3.2,
      "confidence": "high",    // "high", "medium", "low"
      "heardTextJa": "問題一"
    },
    {
      "type": "question_start",
      "mondai": 1,
      "questionNo": 1,
      "timeInChunkSec": 15.4,
      "confidence": "high",
      "heardTextJa": "一番"
    }
  ],
  "transcriptJaDraft": [
    {
      "mondai": 1,
      "questionNo": 1,
      "text": "女の子が話しています。毎日、いちばん先に片付けなければならないのはどれですか。"
    }
  ],
  "notes": [
    "Any notes or difficulties with audio clarity."
  ]
}
```

## Guidelines

- If a question starts in this chunk but does not finish, output `question_start` in this chunk, but do NOT output `question_end`. The merge script will handle stitching across chunks.
- If a question was already running at the beginning of the chunk, do not output `question_start`.
- Be precise with `timeInChunkSec`. Listen to the exact start of the words (e.g., the moment they start saying 「一番」 or when the question stem starts).
- Pay close attention to 「例」(examples). They are usually at the beginning of each Mondai and must be marked with `type: "example_marker"` so they can be filtered out during merge.
