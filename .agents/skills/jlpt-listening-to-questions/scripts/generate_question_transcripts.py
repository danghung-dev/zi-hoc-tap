#!/usr/bin/env python3
"""Group Whisper raw transcript segments by question based on timestamp candidates."""

import argparse
import json
import os
import sys

def generate_transcripts(whisper_path, timestamps_path, output_path):
    if not os.path.isfile(whisper_path):
        print(f"Error: Whisper JSON file not found at {whisper_path}", file=sys.stderr)
        sys.exit(1)
    if not os.path.isfile(timestamps_path):
        print(f"Error: Timestamps file not found at {timestamps_path}", file=sys.stderr)
        sys.exit(1)

    with open(whisper_path, "r", encoding="utf-8") as f:
        whisper_data = json.load(f)
    
    with open(timestamps_path, "r", encoding="utf-8") as f:
        timestamps_data = json.load(f)

    segments = whisper_data.get("segments", [])

    output_lines = []
    output_lines.append("=========================================================================")
    output_lines.append(f"RAW TRANSCRIPT GROUPED BY QUESTION")
    output_lines.append("=========================================================================\n")

    # Parse questions from the list
    questions = timestamps_data.get("questions", [])
    exam = timestamps_data.get("exam", "ex")

    # Sort questions by startSec
    sorted_questions = sorted(
        questions,
        key=lambda q: q.get("startSec", 0)
    )

    for q in sorted_questions:
        mondai = q.get("mondai", 1)
        q_no = q.get("questionNo", 1)
        q_id = f"{exam}-m{mondai}-q{q_no:02d}"
        
        start_sec = q.get("startSec", 0)
        end_sec = q.get("endSec", 999999)

        output_lines.append(f"### QUESTION: {q_id} ({start_sec:.2f}s -> {end_sec:.2f}s)")
        
        # Find segments that fall within bounds
        q_segments = []
        for seg in segments:
            seg_start = seg.get("start", 0)
            seg_end = seg.get("end", 0)
            # Match segment if it overlaps significantly with bounds or starts within it
            if seg_start >= start_sec and seg_start < end_sec:
                q_segments.append(seg)
            elif seg_end > start_sec and seg_end <= end_sec:
                q_segments.append(seg)

        if not q_segments:
            output_lines.append("(No matching transcript segments found in this time range)")
        else:
            for seg in q_segments:
                seg_start = seg.get("start", 0)
                seg_end = seg.get("end", 0)
                text = seg.get("text", "").strip()
                output_lines.append(f"[{seg_start:7.2f}s -> {seg_end:7.2f}s] {text}")
        
        output_lines.append("\n" + "-" * 80 + "\n")

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(output_lines))

    print(f"Successfully generated clean grouped transcript text file: {output_path}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-w", "--whisper", default="temp/listening/whisper_turbo.json", help="Path to whisper JSON file")
    ap.add_argument("-t", "--timestamps", default="temp/listening/timestamp_candidates.json", help="Path to timestamp candidates JSON file")
    ap.add_argument("-o", "--out", default="temp/listening/whisper_by_question.txt", help="Path to save output TXT file")
    args = ap.parse_args()

    generate_transcripts(args.whisper, args.timestamps, args.out)

if __name__ == "__main__":
    main()
