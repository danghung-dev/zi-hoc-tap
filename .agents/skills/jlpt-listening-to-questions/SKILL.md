---
name: jlpt-listening-to-questions
description: >-
  Convert a gojapan.vn / "thi thử JLPT" mock-exam HTML file and its associated MP3 file
  into the zi-hoc-tap listening practice-question JSON format (the schema in docs/template/json_schemas.md
  with template "listening_player") and audio clips, and register the packs in packs.json.
  Use this whenever the user provides a JLPT exam HTML file (e.g. temp/dethi3.html, "đề thi", "dethiN.html", a gojapan.vn exam page)
  and asks to process the listening part (Part 2 - Chōkai - 聴解), transcribe/parse/slice the listening audio,
  generate listening questions, or cut the MP3 file into individual question clips.
---

# JLPT Listening Exam HTML + MP3 → Listening Question JSON + Audio Clips

Convert one exam HTML file and its shared MP3 audio into separate audio clips and JSON packs for each Mondai using faster-whisper and Gemini refinement.

## Workflow Summary

1. **Parse HTML (Part 2)**:
   Extract raw questions, prompts, options, and images from HTML:
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/parse_exam_html.py temp/dethi3.html --part p2 -o temp/listening/listen_raw.json
   ```

2. **Fetch MP3 and Images**:
   Download the main MP3 file and any question/option images from the web pages:
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/fetch_listening_media.py temp/dethi3.html --out temp/listening
   ```

3. **Transcribe Audio with faster-whisper**:
   Run faster-whisper on the main MP3 to generate segment-level and word-level timestamps:
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/transcribe_whisper.py \
     temp/listening/source.mp3 \
     -o temp/listening/whisper_raw.json \
     --model large-v3-turbo
   ```

4. **Align Timestamps**:
   Align the detected question announcements from the transcript with the expected questions from HTML:
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/align_timestamps.py \
     temp/listening/whisper_raw.json \
     temp/listening/listen_raw.json \
     --exam de3 \
     -o temp/listening/timestamp_candidates.json
   ```

5. **Generate Clean Grouped Transcript**:
   Group the Whisper segments into a compact, human-readable text file organized by question. This is highly token-efficient and avoids passing huge JSON files with word-level details to the LLM:
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/generate_question_transcripts.py \
     -w temp/listening/whisper_raw.json \
     -t temp/listening/timestamp_candidates.json \
     -o temp/listening/whisper_by_question.txt
   ```

6. **Cut Audio Clips**:
   Cut the main MP3 file into individual audio files for each question (saving them into `github-data/`):
   ```bash
   .venv/bin/python .agents/skills/jlpt-listening-to-questions/scripts/cut_from_model_timestamps.py \
     temp/listening/source.mp3 \
     temp/listening/timestamp_candidates.json \
     --out-assets github-data/public/assets/levels/n4/audio/listening \
     --exam de3 \
     -o temp/listening/segments.json
   ```

7. **Gemini Transcript Refinement & JSON Generation**:
   Using `references/gemini_transcript_refinement.md`, read the question-grouped raw text transcripts in `temp/listening/whisper_by_question.txt`, refine the Japanese dialog (typos, speaker tags), determine the correct option by solving the question, write Vietnamese translations and explanations, and generate the final question JSON files.
   
   > [!IMPORTANT]
   > **The HTML file does NOT contain correct answers.** You (Gemini) must analyze the refined Japanese dialogue and solve the question yourself using your Japanese knowledge to identify the correct option, then set it in `correctOptionId` and provide explanations.

   Ensure all question/option images are copied from `temp/listening/images/raw` to `github-data/public/assets/levels/n4/images/listening`.
   In the JSON files, both audio and images must reference raw GitHub CDN links instead of local paths (branch `main` on repo `danghung-dev/tiengnhat`):
   - Base URL prefix: `https://raw.githubusercontent.com/danghung-dev/tiengnhat/main/public/assets/levels/n4/`
   - Set `"media.audio.src"` to the raw GitHub audio link.
   - For option images (Mondai 1 and Mondai 2 Q3), set `"imageSrc"` on each option to the raw GitHub image link.
   - For situation images (Mondai 2 Q5 and Mondai 3), set `"media.image.src"` to the raw GitHub image link.

7. **Register in `packs.json`**:
   Update the `public/data/levels/n4/packs.json` file.

8. **Commit and Push github-data**:
   Navigate to the `github-data` repository, stage all newly added audio and images, commit and push to the `main` branch.

