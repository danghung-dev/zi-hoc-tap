# Guidelines for Clip Verification with LLM

You will be given a cut audio clip (e.g., `de3-m1-q01.mp3`). Your task is to listen to it, verify if it is correctly segmented, and provide adjustments if necessary.

## Checklist for Verification

1. **Clarity**: Is the audio clip complete and audible?
2. **Alignment**:
   - **Start**: Does it include the speaker saying the question number (e.g. 「一番」) and the question stem? Does it cut off the beginning?
   - **End**: Does it include the full dialog, options (if read out), and the chime/ending sound? Does it cut off early?
   - **Overlap**: Does it contain any sound/speech from the *previous* question or the *next* question?
3. **Draft Transcript**: Provide a final corrected transcription of the Japanese audio.

## Output Schema

Your response must be a single, valid JSON block matching this structure:

```json
{
  "clip": "de3-m1-q01.mp3",
  "status": "ok",                  // "ok" or "needs_recrop" or "uncertain"
  "issue": null,                   // "missing_beginning", "missing_end", "contains_prev_question", "contains_next_question", or null
  "suggestedAdjustment": {
    "startDeltaSec": 0,            // Negative to start earlier (e.g., -1.5), positive to start later (e.g. 0.5)
    "endDeltaSec": 0               // Negative to end earlier, positive to end later (e.g., 1.0)
  },
  "transcriptJa": "女の子が話しています。毎日、いちばん先に片付けなければならないのはどれですか。...",
  "confidence": "high"            // "high", "medium", "low"
}
```

## Adjustment Rules

- If the clip cuts off the beginning (e.g. we only hear "...なにをしますか" instead of "男の人と女の人が話しています。男の人は..."), suggest a negative `startDeltaSec` (e.g., `-1.5` or `-2.0`) to include the missing part.
- If the clip contains audio from the previous question, suggest a positive `startDeltaSec` to skip the previous question.
- If the clip cuts off early (e.g. it cuts during the final dialog or options), suggest a positive `endDeltaSec` (e.g., `2.0`).
- If the clip contains the start of the next question, suggest a negative `endDeltaSec` to truncate the next question.
- Always be careful with the signs:
  - `startDeltaSec`: `new_start = current_start + startDeltaSec`
  - `endDeltaSec`: `new_end = current_end + endDeltaSec`
