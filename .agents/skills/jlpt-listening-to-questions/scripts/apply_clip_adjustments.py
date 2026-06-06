#!/usr/bin/env python3
"""Apply adjustments to clip boundaries based on model verification and recut clips."""

import argparse
import glob
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
    ap.add_argument("--source", required=True, help="Path to source MP3 file")
    ap.add_argument("--segments", required=True, help="Path to current segments.json")
    ap.add_argument("--verification", required=True, help="Directory containing clip_verification JSON files")
    ap.add_argument("--out-assets", required=True, help="Assets directory for clips")
    args = ap.parse_args()

    # Load current segments
    with open(args.segments, "r", encoding="utf-8") as f:
        segments_data = json.load(f)

    source_duration = get_audio_duration(args.source)

    # Load all verification files
    verifications = {}
    pattern = os.path.join(args.verification, "*.json")
    files = glob.glob(pattern)
    for fpath in files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            clip_name = data.get("clip")
            if clip_name:
                # Store by clip filename (e.g. de3-m1-q01.mp3)
                verifications[clip_name] = data
        except Exception as e:
            print(f"Warning: Failed to parse verification {fpath}: {e}", file=sys.stderr)

    # Walk through segments and adjust if needed
    adjusted_count = 0
    items = segments_data.get("items", [])
    
    for item in items:
        file_path = item["filePath"]
        clip_name = os.path.basename(file_path)
        
        verify_data = verifications.get(clip_name)
        if not verify_data:
            continue

        status = verify_data.get("status")
        if status == "needs_recrop":
            adj = verify_data.get("suggestedAdjustment", {})
            start_delta = adj.get("startDeltaSec", 0.0)
            end_delta = adj.get("endDeltaSec", 0.0)

            if start_delta == 0.0 and end_delta == 0.0:
                continue

            current_start = item["startSec"]
            current_end = item["endSec"]

            new_start = max(0.0, current_start + start_delta)
            new_end = min(source_duration, current_end + end_delta)

            if new_end <= new_start:
                print(f"Warning: Adjusted end ({new_end:.2f}s) is before start ({new_start:.2f}s) for {clip_name}. Skipping adjustment.")
                continue

            print(f"Recutting {clip_name}:")
            print(f"  Old bounds: {current_start:.2f}s - {current_end:.2f}s")
            print(f"  New bounds: {new_start:.2f}s - {new_end:.2f}s (delta: start={start_delta:+.2f}s, end={end_delta:+.2f}s)")
            
            # Recut the clip
            cut_audio(args.source, file_path, new_start, new_end)
            
            # Verify new duration
            actual_dur = get_audio_duration(file_path)

            # Update segment metadata
            item["startSec"] = round(new_start, 2)
            item["endSec"] = round(new_end, 2)
            item["durationSec"] = round(actual_dur, 2)
            
            adjusted_count += 1

    if adjusted_count > 0:
        # Write back updated segments.json
        with open(args.segments, "w", encoding="utf-8") as f:
            json.dump(segments_data, f, ensure_ascii=False, indent=2)
        print(f"Successfully adjusted and recut {adjusted_count} clips. Updated {args.segments}")
    else:
        print("No clips required adjustments.")


if __name__ == "__main__":
    main()
