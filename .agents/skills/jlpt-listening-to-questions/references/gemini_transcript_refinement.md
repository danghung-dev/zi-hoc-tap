# Guidelines for Gemini Transcript Refinement & Question JSON Generation

Using the raw output of `faster-whisper` and the parsed HTML questions, you will refine the transcripts, determine the correct answers, write explanations in Vietnamese, and generate the final JSON files.

## Inputs

1. **HTML Parsed Questions (`temp/listening/listen_raw.json`)**: Contains instructions, question stems, and option text (if present in HTML).
2. **Whisper Raw Transcripts (`temp/listening/whisper_raw.json`)**: Segment-level and word-level raw Japanese transcripts and timestamps.
3. **Question Timestamps (`temp/listening/timestamp_candidates.json`)**: Start and end timestamps for each question.

---

## Refinement Steps

For each question (e.g., Mondai 1 Question 1):

### 1. Extract Raw Transcript
- Look up the question's `startSec` and `endSec` from `timestamp_candidates.json`.
- Extract all segments from `whisper_raw.json` that fall within this time range.
- Concatenate them to form the raw text of the question.

### 2. Clean and Format Japanese Transcript
- **Correct Typos/Mishearings**: Use Japanese knowledge and context to fix any homophone errors, particle mistakes, or transcription inaccuracies in the raw Whisper output.
- **Formating Speakers**: Format the dialogue clearly with speaker tags:
  - `男の留学生 (Nam du học sinh)`, `女の人 (Người phụ nữ)`, `男 (Nam)`, `女 (Nữ)`, etc.
  - Separate lines for each speaker turn.
  - Keep the question prompt at the start/end as spoken in the audio.
- **Match HTML Content**: Ensure key words in the dialogue align with the question stem and option text from `listen_raw.json`.

### 3. Determine Correct Option and Write Explanations
> [!IMPORTANT]
> **The HTML file does NOT contain the correct answers.** You must listen to/read the corrected Japanese dialogue, apply your Japanese knowledge, and solve the question yourself to identify which option is correct.

- **Compare Dialogue with Options**: Using Japanese comprehension, solve the question to find the correct answer.
- **Options Formats**:
  - **Mondai 1 & 2** (Standard Quiz): Options are labeled `"A"`, `"B"`, `"C"`, `"D"` corresponding to indexes `0`, `1`, `2`, `3` in `listen_raw.json`.
  - **Mondai 3 & 4** (Quick Response): Set `"buttonMode": true`. Options are `"1"`, `"2"`, `"3"`. For these, transcribe the options spoken at the end of the audio and set them as `"textAfterAnswer"` in the `options` array.
- **Vietnamese Explanations**:
  - Translate the question stem (`stemVi`).
  - Write concise but clear explanations for each option (`explanationVi`).
  - Write `shortExplanationVi`, `fullExplanationVi`, `trapVi` (bẫy), and `listeningStrategyVi` (chiến thuật nghe).
  - Provide a high-quality Vietnamese translation of the entire dialogue (`translationVi`).

### 4. Construct Final Question JSON
Combine all fields matching the `listening_player` template schema in `references/json_schemas.md`.
Ensure the `"media.audio.src"` points to the raw GitHub URL for the cut audio clip:
- Prefix: `https://raw.githubusercontent.com/danghung-dev/tiengnhat/main/public/assets/levels/n4/`
- Audio: `audio/listening/{exam}-m{M}-q{NN}.mp3`
- Option Images (if any): `images/listening/{exam}-m1-q{NN}-opt{A/B/C/D}.png`
- Situation Images (if any): `images/listening/{exam}-m3-q{NN}-situation.png`

---

## Output Naming & Paths

Save the question packs to:
- Mondai 1: `public/data/levels/n4/listening/task-based-comprehension-XXX.json`
- Mondai 2: `public/data/levels/n4/listening/comprehension-of-key-points-XXX.json`
- Mondai 3: `public/data/levels/n4/listening/verbal-expressions-XXX.json`
- Mondai 4: `public/data/levels/n4/listening/quick-response-XXX.json`

(Where `XXX` is the next sequential pack number, e.g., `002` if `001` exists. Check `public/data/levels/n4/listening/` to determine `XXX`).
