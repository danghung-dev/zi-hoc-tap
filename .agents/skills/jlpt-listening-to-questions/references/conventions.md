# Conventions for JLPT Listening Questions

## Mondai to jlptItemType Mapping

| Mondai | jlptItemType                  | Description                          | UI Template |
| :--- | :--- | :--- | :--- |
| 問題1 | `task_based_comprehension`    | Task-based comprehension (課題理解)  | `listening_player` |
| 問題2 | `comprehension_of_key_points` | Key point comprehension (ポイント理解)| `listening_player` |
| 問題3 | `verbal_expressions`          | Verbal expressions (発話表現)        | `listening_player` |
| 問題4 | `quick_response`              | Quick response (即時応答)            | `listening_player` |

## UI Configuration

1. **Template Name**: Always use `"uiTemplate": "listening_player"`.
2. **Button Mode**:
   - Set `"buttonMode": true` for **問題3** and **問題4** where the choices are read out in the audio.
   - For **問題1** and **問題2**, options are usually written on the paper (so `"buttonMode": false` or omitted).
3. **Images in Listening**:
   - **問題1**: Option images. For each option in the `options` array, include `"imageSrc": "images/listening/{exam}-m1-q{NN}-opt{A|B|C|D}.png"`.
   - **問題3**: Situation image. Under `media`, include an `image` object: `"image": { "src": "images/listening/{exam}-m3-q{NN}-situation.png", "alt": "..." }`.

## File Paths and Identifiers

### Output JSON Packs
- Pack 1: `public/data/levels/n4/listening/task-based-comprehension-001.json`
- Pack 2: `public/data/levels/n4/listening/comprehension-of-key-points-001.json`
- Pack 3: `public/data/levels/n4/listening/verbal-expressions-001.json`
- Pack 4: `public/data/levels/n4/listening/quick-response-001.json`

### Pack IDs (in packs.json)
- Pack 1: `n4_listen_task_001`
- Pack 2: `n4_listen_point_001`
- Pack 3: `n4_listen_verbal_001`
- Pack 4: `n4_listen_quick_001`

### Question IDs
- Pack 1: `n4_listen_task_001`, `n4_listen_task_002`, ...
- Pack 2: `n4_listen_point_001`, `n4_listen_point_002`, ...
- Pack 3: `n4_listen_verbal_001`, `n4_listen_verbal_002`, ...
- Pack 4: `n4_listen_quick_001`, `n4_listen_quick_002`, ...

### Asset Paths (Relative to `public/assets/levels/n4/`)
- Audio files: `audio/listening/{exam}-m{M}-q{NN}.mp3` (e.g. `audio/listening/de3-m1-q01.mp3`)
- Option Images: `images/listening/{exam}-m1-q{NN}-opt{A/B/C/D}.png`
- Situation Images: `images/listening/{exam}-m3-q{NN}-situation.png`
