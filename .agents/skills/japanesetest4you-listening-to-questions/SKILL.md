---
name: japanesetest4you-listening-to-questions
description: Use when converting a japanesetest4you listening practice exam JSON file into a zi-hoc-tap listening player JSON pack, including downloading media assets and registering it in packs.json.
---

# Importing Japanesetest4you Listening Exercises

This skill outlines the process of importing listening exercises from the `japanesetest4you` format into the target `zi-hoc-tap` listening question formats (`task_based_comprehension`, `comprehension_of_key_points`, `verbal_expressions`, `quick_response`).

## Overview
Automate the download of audio/image files, determine audio duration via `ffprobe`, generate the draft JSON pack, and update `packs.json`. Follow up with a manual/LLM-driven translation, answering, and explanation step in Vietnamese.

## When to Use
- When the user provides a JSON file containing `japanesetest4you` listening questions with URLs for audios/images and transcripts.
- When you need to import, structure, download, and register these listening questions for a specific JLPT level (e.g. N4, N3).

## Implementation

### Step 1: Run the Conversion Script
Use the built-in script to download assets and generate a draft JSON file:

```bash
.venv/bin/python .agents/skills/japanesetest4you-listening-to-questions/scripts/convert_listening.py \
  --input temp/path-to-input.json \
  --type [task_based_comprehension|comprehension_of_key_points|verbal_expressions|quick_response] \
  --level [n5|n4|n3|n2|n1]
```

This script:
1. Downloads audios to `github-data/public/assets/levels/{level}/audio/listening/`
2. Downloads images (if any) to `github-data/public/assets/levels/{level}/images/listening/`
3. Runs `ffprobe` to determine audio duration.
4. Generates a draft JSON file at `public/data/levels/{level}/listening/{schema-type-kebab}-{index}.json`.
5. Automatically increments the pack number and registers the new pack in `public/data/levels/{level}/packs.json`.

### Step 2: Refine Translations and Solve Questions
Since the source JSON only contains Japanese transcripts, raw answers, and no explanations, you must read the generated draft JSON pack and refine the placeholders (`[STEM_JA]`, `[STEM_VI]`, `[EXPLANATION_VI]`, etc.):
1. **Dialog & Translation**: Translate the Japanese dialog (`transcriptJa`) to natural Vietnamese (`translationVi`).
2. **Double Check Correct Answers**: Verify that `correctOptionId` in `answer` matches the correct answer specified in the source. Write the Vietnamese explanations for why each option is correct or incorrect (`explanationVi` inside each option).
3. **Explanations, Traps, and Strategies**: Fill in:
   - `shortExplanationVi`: Short summary of the correct answer.
   - `fullExplanationVi`: Detailed explanation explaining how the dialog leads to the answer.
   - `trapVi`: Explain common listening traps (e.g., plans changing at the end, confusing similar words).
   - `listeningStrategyVi`: Key listening tips (e.g., listening for turning point words like "でも", "やっぱり").
4. **Quick Response / Verbal Expression Mode**: If `verbal_expressions` or `quick_response` is selected:
   - Fill in `promptTranscriptJa` (the spoken question/situation prompt).
   - Fill in `promptTranslationVi` (its Vietnamese translation).
   - Fill in `textAfterAnswer` for the numeric options (1, 2, 3) to show the spoken options' texts after user selection.

## Common Mistakes
- **Hardcoding pack numbers**: Always let the script auto-detect the next pack index by reading `packs.json`.
- **Skipping ffprobe**: Ensure `ffprobe` is installed and run to determine exact duration. If it fails, default to a safe value like 45.0.
- **Incorrect schema mapping**: `verbal_expressions` and `quick_response` use `buttonMode: true` and numeric option IDs (`1`, `2`, `3`), whereas others use `A`, `B`, `C`, `D`.
- **Absolute paths in JSON**: Ensure media source paths in JSON reference the raw GitHub URL (`https://raw.githubusercontent.com/danghung-dev/tiengnhat/...`) rather than local filesystem paths.
