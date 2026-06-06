#!/usr/bin/env python3
"""Slice the main MP3 file into overlapping chunks for model listening."""

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
        print(f"Error getting audio duration for {file_path}: {e}", file=sys.stderr)
        sys.exit(1)


def cut_chunk(input_path, output_path, start_sec, end_sec):
    # Using re-encode (without -c copy) ensures exact cutting points, which is safer
    # since we want precise relative timestamp calculations.
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{start_sec:.3f}",
        "-to", f"{end_sec:.3f}",
        "-i", input_path,
        "-c:a", "libmp3lame",
        "-b:a", "128k",
        output_path
    ]
    try:
        subprocess.check_output(cmd, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg failed: {e.output.decode('utf-8')}", file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="Path to source MP3 file")
    ap.add_argument("--chunk-sec", type=float, default=45.0, help="Chunk duration in seconds")
    ap.add_argument("--overlap-sec", type=float, default=3.0, help="Overlap duration in seconds")
    ap.add_argument("--out", required=True, help="Output directory for chunks")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    duration = get_audio_duration(args.source)
    print(f"Source audio duration: {duration:.2f} seconds")

    chunks = []
    start = 0.0
    chunk_index = 0

    while start < duration:
        end = start + args.chunk_sec
        if end > duration:
            end = duration

        # Edge case: if the remaining chunk is too small, just merge it with the previous or end
        if end - start < 1.0 and chunk_index > 0:
            break

        chunk_id = f"chunk_{chunk_index:03d}"
        chunk_file = os.path.join(args.out, f"{chunk_id}.mp3")

        overlap_prev = args.overlap_sec if start > 0 else 0.0
        overlap_next = args.overlap_sec if end < duration else 0.0

        print(f"Cutting {chunk_id}: {start:.2f}s to {end:.2f}s (duration: {end-start:.2f}s)")
        cut_chunk(args.source, chunk_file, start, end)

        chunks.append({
            "chunkId": chunk_id,
            "src": chunk_file,
            "absoluteStartSec": start,
            "absoluteEndSec": end,
            "overlapPrevSec": overlap_prev,
            "overlapNextSec": overlap_next
        })

        # Advance start position by chunk_sec minus overlap
        start += (args.chunk_sec - args.overlap_sec)
        chunk_index += 1

    manifest_path = os.path.join(args.out, "..", "chunks_manifest.json")
    # Normalize path
    manifest_path = os.path.abspath(manifest_path)
    
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Created {len(chunks)} chunks in {args.out}")
    print(f"Saved chunks manifest to {manifest_path}")


if __name__ == "__main__":
    main()
