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

Convert one exam HTML file and its shared MP3 audio into separate audio clips and JSON packs for each Mondai.

## Workflow Summary

1. **Parse HTML (Part 2)**:
   ```bash
   python scripts/parse_exam_html.py temp/dethi3.html --part p2 -o temp/listening/listen_raw.json
   ```
2. **Fetch MP3 and Images**:
   ```bash
   python scripts/fetch_listening_media.py temp/dethi3.html --out temp/listening
   ```
3. **Chunk Audio for LLM Listening**:
   ```bash
   python scripts/prepare_audio_chunks.py temp/listening/source.mp3 --chunk-sec 45 --overlap-sec 3 --out temp/listening/chunks
   ```
4. **LLM Drafts Timestamps**:
   The LLM listens to each chunk (via `view_file` tool) along with `listen_raw.json` and writes observations to `temp/listening/model_chunk_observations/chunk_NNN.json` matching `references/model_timestamp_authoring.md`.
5. **Merge Timestamps**:
   ```bash
   python scripts/merge_model_timestamps.py \
     --observations temp/listening/model_chunk_observations \
     --chunks temp/listening/chunks_manifest.json \
     --raw temp/listening/listen_raw.json \
     --counts 8,7,8,9 \
     --exam de3 \
     -o temp/listening/timestamp_candidates.json
   ```
6. **Cut Clips**:
   Save cut clips to `github-data` repository instead of the source code's `public/` directory:
   ```bash
   python scripts/cut_from_model_timestamps.py \
     temp/listening/source.mp3 \
     temp/listening/timestamp_candidates.json \
     --out-assets github-data/public/assets/levels/n4/audio/listening \
     --exam de3 \
     -o temp/listening/segments.json
   ```
7. **LLM Verifies Clips**:
   The LLM listens to each cut clip in `github-data/public/assets/levels/n4/audio/listening/` (via `view_file`) matching `references/verify_clips_with_model.md` and writes verification feedback to `temp/listening/clip_verification/de3-mX-qYY.json`.
8. **Adjust Clips**:
   ```bash
   python scripts/apply_clip_adjustments.py \
     --source temp/listening/source.mp3 \
     --segments temp/listening/segments.json \
     --verification temp/listening/clip_verification \
     --out-assets github-data/public/assets/levels/n4/audio/listening
   ```
9. **Generate Question JSON**:
   LLM creates final JSON packs for each Mondai using transcripts, correct answers, and durations.
   Ensure all question/option images are copied from `temp/listening/images/raw` to `github-data/public/assets/levels/n4/images/listening`.
   In the JSON files, both audio and images must reference raw GitHub CDN links instead of local paths (branch `main` on repo `danghung-dev/tiengnhat`):
   - Base URL prefix: `https://raw.githubusercontent.com/danghung-dev/tiengnhat/main/public/assets/levels/n4/`
   - Set `"media.audio.src"` to the raw GitHub audio link.
   - For option images (Mondai 1 and Mondai 2 Q3), set `"imageSrc"` on each option to the raw GitHub image link.
   - For situation images (Mondai 2 Q5 and Mondai 3), set `"media.image.src"` to the raw GitHub image link.
10. **Register in `packs.json`**:
    Update the `public/data/levels/n4/packs.json` file.
11. **Commit and Push github-data**:
    Navigate to `github-data` repository, stage all newly added audio and images, commit and push to the `main` branch.
