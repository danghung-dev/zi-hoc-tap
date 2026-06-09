#!/usr/bin/env python3
import os
import sys
import json
import ssl
import urllib.request
import subprocess
import argparse

def main():
    parser = argparse.ArgumentParser(description="Convert japanesetest4you JSON into zi-hoc-tap Listening schemas.")
    parser.add_argument("--input", required=True, help="Path to the source japanesetest4you JSON file")
    parser.add_argument("--type", required=True, choices=["task_based_comprehension", "comprehension_of_key_points", "verbal_expressions", "quick_response"], help="Target listening schema type")
    parser.add_argument("--level", required=True, help="JLPT Level (e.g. n4, n3, n5)")
    parser.add_argument("--workspace", default="/Users/hung/projects-nosync/family/zi-hoc-tap", help="Path to family/zi-hoc-tap workspace")
    args = parser.parse_args()

    input_path = os.path.abspath(args.input)
    if not os.path.exists(input_path):
        print(f"Error: Input file {input_path} does not exist.")
        sys.exit(1)

    level = args.level.lower()
    schema_type = args.type

    # Map schema type to short prefix and category metadata
    type_map = {
        "task_based_comprehension": {
            "short": "task",
            "file_name_prefix": "task-based-comprehension",
            "categoryId": "LISTENING_M1",
            "categoryName": "Nghe hiểu Mondai 1",
            "displayLabel": f"{level.upper()} Nghe: Mondai 1",
            "instruction": "もんだい１では、はじめにしつもんをきいてください。それからはなしをきいて、もんだいようしの１から４のなかから、いちばんいいものをひとつえらんでください。",
            "instructionVi": "Nghe đoạn băng và chọn đáp án chính xác nhất.",
            "textVisibleBeforeAudio": True,
            "buttonMode": False
        },
        "comprehension_of_key_points": {
            "short": "point",
            "file_name_prefix": "comprehension-of-key-points",
            "categoryId": "LISTENING_M2",
            "categoryName": "Nghe hiểu Mondai 2",
            "displayLabel": f"{level.upper()} Nghe: Mondai 2",
            "instruction": "もんだい２では、はじめにしつもんをきいてください。そのあと、もんだいようしをみてください。よむじかんがあります。それからはなしをきいて、もんだいようしの１から４のなかから、いちばんいいものをひとつえらんでください。",
            "instructionVi": "Nghe đoạn băng và chọn đáp án chính xác nhất.",
            "textVisibleBeforeAudio": True,
            "buttonMode": False
        },
        "verbal_expressions": {
            "short": "verbal",
            "file_name_prefix": "verbal-expressions",
            "categoryId": "LISTENING_M3",
            "categoryName": "Nghe hiểu Mondai 3",
            "displayLabel": f"{level.upper()} Nghe: Mondai 3",
            "instruction": "もんだい３では、えを見ながらしつもんを聞いてください。やじるし（→）の人は何と言いますか。１から３の中から、いちばんいいものを一つえらんでください。",
            "instructionVi": "Nhìn tranh, nghe tình huống và chọn lời thoại thích hợp nhất.",
            "textVisibleBeforeAudio": False,
            "buttonMode": True
        },
        "quick_response": {
            "short": "quick",
            "file_name_prefix": "quick-response",
            "categoryId": "LISTENING_M4",
            "categoryName": "Nghe hiểu Mondai 4",
            "displayLabel": f"{level.upper()} Nghe: Mondai 4",
            "instruction": "もんだい４では、えなどがありません。まず、ぶんを聞いてください。それから、そのへんじを聞いて、１から３の中から、いちばんいいものをひとつえらんでください。",
            "instructionVi": "Nghe câu hỏi/phát biểu và chọn phản hồi thích hợp nhất.",
            "textVisibleBeforeAudio": False,
            "buttonMode": True
        }
    }

    t_meta = type_map[schema_type]

    # Directories
    github_assets_audio_dir = os.path.join(args.workspace, f"github-data/public/assets/levels/{level}/audio/listening")
    github_assets_images_dir = os.path.join(args.workspace, f"github-data/public/assets/levels/{level}/images/listening")
    packs_json_path = os.path.join(args.workspace, f"public/data/levels/{level}/packs.json")
    output_dir = os.path.join(args.workspace, f"public/data/levels/{level}/listening")

    # Ensure directories exist
    os.makedirs(github_assets_audio_dir, exist_ok=True)
    os.makedirs(github_assets_images_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    # Bypass SSL and set User-Agent for downloads
    ctx = ssl._create_unverified_context()
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')]
    urllib.request.install_opener(opener)

    def download_file(url, dest_path):
        if not url:
            return False
        print(f"Downloading {url} -> {dest_path}")
        try:
            urllib.request.urlretrieve(url, dest_path)
            return True
        except Exception as e:
            print(f"Warning: Error downloading {url}: {e}")
            return False

    def get_audio_duration(file_path):
        cmd = [
            "ffprobe",
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            file_path
        ]
        try:
            output = subprocess.check_output(cmd).decode("utf-8").strip()
            return float(output)
        except Exception as e:
            print(f"Warning: Could not get duration for {file_path}: {e}. Defaulting to 45.0")
            return 45.0

    # Determine next pack index
    pack_index = 1
    if os.path.exists(packs_json_path):
        try:
            with open(packs_json_path, 'r', encoding='utf-8') as f:
                packs = json.load(f)
            # Find max pack number for this item type
            existing_indices = []
            for p in packs:
                if p.get("jlptItemType") == schema_type:
                    # Parse index from file name e.g., listening/task-based-comprehension-001.json
                    filename = os.path.basename(p.get("file", ""))
                    # Remove prefix and .json
                    prefix = t_meta["file_name_prefix"] + "-"
                    if filename.startswith(prefix) and filename.endswith(".json"):
                        idx_str = filename[len(prefix):-5]
                        try:
                            existing_indices.append(int(idx_str))
                        except ValueError:
                            pass
            if existing_indices:
                pack_index = max(existing_indices) + 1
        except Exception as e:
            print(f"Warning: Error reading packs.json: {e}. Defaulting pack index to 1")

    # Target JSON file path
    output_filename = f"{t_meta['file_name_prefix']}-{pack_index:03d}.json"
    output_json_path = os.path.join(output_dir, output_filename)

    with open(input_path, 'r', encoding='utf-8') as f:
        source_data = json.load(f)

    ex_id = source_data.get("exercise_id", "1")
    questions = source_data.get("questions", [])

    new_questions = []
    for q in questions:
        q_num = q["question_number"]
        
        # Audio download and pathing
        audio_ext = os.path.splitext(q["audio"].split("?")[0])[1] or ".mp3"
        audio_filename = f"jtest4you-ex{ex_id}-q{q_num}{audio_ext}"
        audio_dest_path = os.path.join(github_assets_audio_dir, audio_filename)
        download_file(q["audio"], audio_dest_path)
        duration = get_audio_duration(audio_dest_path)

        # Image download and pathing
        image_info = None
        if q.get("image"):
            img_ext = os.path.splitext(q["image"].split("?")[0])[1] or ".gif"
            image_filename = f"jtest4you-ex{ex_id}-q{q_num}{img_ext}"
            image_dest = os.path.join(github_assets_images_dir, image_filename)
            if download_file(q["image"], image_dest):
                image_info = {
                    "src": f"https://raw.githubusercontent.com/danghung-dev/tiengnhat/main/public/assets/levels/{level}/images/listening/{image_filename}",
                    "alt": f"Japanesetest4you Ex {ex_id} Q{q_num} Image"
                }

        # Build options
        options = []
        is_button_mode = t_meta["buttonMode"]
        
        # Determine options list
        raw_options = q.get("options", ["1", "2", "3", "4"] if not is_button_mode else ["1", "2", "3"])
        correct_ans = str(q.get("answer", "1"))
        
        for idx, opt_val in enumerate(raw_options):
            if is_button_mode:
                opt_id = str(idx + 1)
                options.append({
                    "id": opt_id,
                    "textAfterAnswer": opt_val,
                    "isCorrect": (opt_id == correct_ans),
                    "explanationVi": f"Đáp án {opt_id}. [EXPLANATION_VI]"
                })
            else:
                opt_id = chr(65 + idx) # A, B, C, D
                # Check if correct_ans matches digit or option text
                is_correct = (opt_id == correct_ans) or (str(idx + 1) == correct_ans) or (opt_val == correct_ans)
                options.append({
                    "id": opt_id,
                    "text": opt_val,
                    "isCorrect": is_correct,
                    "explanationVi": f"Đáp án {opt_id}. [EXPLANATION_VI]"
                })

        # Try to extract stem from script (usually the first sentence of script)
        script_text = q.get("script", "")
        stem_ja = "[STEM_JA]"
        if script_text:
            sentences = script_text.strip().split('\n')
            if sentences:
                first_sent = sentences[0].strip()
                if "ますか" in first_sent or "ですか" in first_sent or first_sent.endswith("？") or first_sent.endswith("。"):
                    stem_ja = first_sent

        # Format target question JSON
        question_id = f"{level}_listen_{t_meta['short']}_{pack_index:03d}_{q_num:03d}"
        
        item = {
            "id": question_id,
            "level": level.upper(),
            "section": "listening",
            "jlptItemType": schema_type,
            "uiTemplate": "listening_player",
            "difficulty": 2,
            "tags": [
                "listening",
                "japanesetest4you",
                f"exercise-{ex_id}"
            ],
            "customClassification": {
                "source": f"zi_jlpt_{level}_taxonomy_v1",
                "categoryId": t_meta["categoryId"],
                "categoryName": t_meta["categoryName"],
                "displayLabel": t_meta["displayLabel"],
                "showOnCard": True
            },
            "media": {
                "audio": {
                    "src": f"https://raw.githubusercontent.com/danghung-dev/tiengnhat/main/public/assets/levels/{level}/audio/listening/{audio_filename}",
                    "durationSec": round(duration, 2)
                },
                "image": image_info
            },
            "question": {
                "instruction": t_meta["instruction"],
                "instructionVi": t_meta["instructionVi"],
                "textVisibleBeforeAudio": t_meta["textVisibleBeforeAudio"]
            },
            "options": options,
            "answer": {
                "correctOptionId": "B" if not is_button_mode else correct_ans, # Will be refined by LLM
                "shortExplanationVi": "[SHORT_EXPLANATION_VI]",
                "fullExplanationVi": "[FULL_EXPLANATION_VI]",
                "trapVi": "[TRAP_VI]",
                "listeningStrategyVi": "[LISTENING_STRATEGY_VI]",
                "transcriptJa": script_text,
                "translationVi": "[TRANSLATION_VI]"
            },
            "playbackPolicy": {
                "practiceModeReplay": True,
                "examModeReplay": False,
                "showTranscriptBeforeAnswer": False,
                "showTranscriptAfterAnswer": True
            }
        }

        # Handle specific schema fields
        if is_button_mode:
            item["question"]["buttonMode"] = True
            item["answer"]["promptTranscriptJa"] = stem_ja
            item["answer"]["promptTranslationVi"] = "[PROMPT_TRANSLATION_VI]"
        else:
            item["question"]["stem"] = stem_ja
            item["question"]["stemVi"] = "[STEM_VI]"

        # Set correctOptionId based on isCorrect option
        for opt in options:
            if opt["isCorrect"]:
                item["answer"]["correctOptionId"] = opt["id"]
                break

        new_questions.append(item)

    # Write the output file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(new_questions, f, ensure_ascii=False, indent=2)
    print(f"Generated draft JSON pack at: {output_json_path}")

    # Register in packs.json
    pack_id = f"{level}_listen_{t_meta['short']}_{pack_index:03d}"
    packs = []
    if os.path.exists(packs_json_path):
        with open(packs_json_path, 'r', encoding='utf-8') as f:
            packs = json.load(f)
            
    already_registered = any(p["id"] == pack_id for p in packs)
    if not already_registered:
        new_pack = {
            "id": pack_id,
            "section": "listening",
            "jlptItemType": schema_type,
            "uiTemplate": "listening_player",
            "file": f"listening/{output_filename}",
            "title": f"聴解 問題{t_meta['categoryId'][-1]} - {schema_type.replace('_', ' ').capitalize()} (Japanesetest4you Ex {ex_id})",
            "count": len(new_questions)
        }
        packs.append(new_pack)
        with open(packs_json_path, 'w', encoding='utf-8') as f:
            json.dump(packs, f, ensure_ascii=False, indent=2)
        print(f"Registered pack '{pack_id}' in packs.json")
    else:
        print(f"Pack '{pack_id}' is already registered in packs.json")

if __name__ == "__main__":
    main()
