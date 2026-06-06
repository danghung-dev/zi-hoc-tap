#!/usr/bin/env python3
"""Cut individual question audio clips from source MP3 based on timestamps."""

import argparse
import json
import os
import subprocess
import sys


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
        print(f"Error getting audio duration: {e}", file=sys.stderr)
        sys.exit(1)


def cut_audio(input_path, output_path, start, end):
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{start:.3f}",
        "-to", f"{end:.3f}",
        "-i", input_path,
        "-c:a", "libmp3lame",
        "-b:a", "128k",
        output_path
    ]
    try:
        subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg failed for {output_path}: {e.output.decode('utf-8')}", file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="Path to source MP3 file")
    ap.add_argument("candidates", help="Path to timestamp_candidates.json")
    ap.add_argument("--out-assets", required=True, help="Assets directory (e.g. public/assets/levels/n4/audio/listening)")
    ap.add_argument("--exam", required=True, help="Exam ID (e.g. de3)")
    ap.add_argument("-o", "--out-segments", required=True, help="Output path for segments.json")
    args = ap.parse_args()

    os.makedirs(args.out_assets, exist_ok=True)
    source_duration = get_audio_duration(args.source)

    with open(args.candidates, "r", encoding="utf-8") as f:
        candidates_data = json.load(f)

    items = []

    for q in candidates_data.get("questions", []):
        mondai = q["mondai"]
        q_num = q["questionNo"]
        g_num = q["globalQuestionNo"]

        # Default start and end
        start_sec = q["startSec"]
        end_sec = q["endSec"]

        # Apply margins: subtract 0.5s to 1.0s from start, add 1.0s to 1.5s to end
        # Mondai 4 (quick response) has shorter silences, so we use slightly smaller margins
        start_margin = 0.8
        end_margin = 1.2
        if mondai == 4:
            start_margin = 0.5
            end_margin = 0.8

        adjusted_start = max(0.0, start_sec - start_margin)
        adjusted_end = min(source_duration, end_sec + end_margin)

        # File names
        file_name = f"{args.exam}-m{mondai}-q{q_num:02d}.mp3"
        dest_path = os.path.join(args.out_assets, file_name)

        # Relative audio source path for the frontend (which prepends assetBaseUrl e.g. /assets/levels/n4/)
        # Asset base is /assets/levels/n4/, so audio source should be audio/listening/file_name
        audio_src = f"audio/listening/{file_name}"

        print(f"Cutting Q{g_num} (M{mondai}-Q{q_num}): {adjusted_start:.2f}s to {adjusted_end:.2f}s -> {file_name}")
        cut_audio(args.source, dest_path, adjusted_start, adjusted_end)

        # Verify actual duration of the cut file
        actual_dur = get_audio_duration(dest_path)

        items.append({
            "mondai": mondai,
            "questionNo": q_num,
            "globalQuestionNo": g_num,
            "audioSrc": audio_src,
            "filePath": dest_path,
            "startSec": round(adjusted_start, 2),
            "endSec": round(adjusted_end, 2),
            "durationSec": round(actual_dur, 2),
            "confidence": q["confidence"]
        })

    segments_data = {
        "exam": args.exam,
        "items": items
    }

    os.makedirs(os.path.dirname(args.out_segments), exist_ok=True)
    with open(args.out_segments, "w", encoding="utf-8") as f:
        json.dump(segments_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully cut {len(items)} audio clips. Metadata saved to {args.out_segments}")


if __name__ == "__main__":
    main()
