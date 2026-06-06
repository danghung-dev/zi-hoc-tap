#!/usr/bin/env python3
"""Slice the main MP3 file and convert chunks to low-res MP4 for model listening."""

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


def create_mp4_chunk(input_path, output_path, start_sec, end_sec):
    # Using ffmpeg to slice the input audio and merge with a black video track.
    # We use low resolution (100x100) and low frame rate (1 fps) to keep file sizes and tokens minimal.
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=black:s=100x100:r=1",
        "-ss", f"{start_sec:.3f}",
        "-to", f"{end_sec:.3f}",
        "-i", input_path,
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "96k",
        "-shortest",
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
    ap.add_argument("--chunk-sec", type=float, default=300.0, help="Chunk duration in seconds (default: 300s / 5min)")
    ap.add_argument("--overlap-sec", type=float, default=10.0, help="Overlap duration in seconds")
    ap.add_argument("--out", required=True, help="Output directory for MP4 chunks")
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

        if end - start < 1.0 and chunk_index > 0:
            break

        chunk_id = f"chunk_{chunk_index:03d}"
        chunk_file = os.path.join(args.out, f"{chunk_id}.mp4")

        overlap_prev = args.overlap_sec if start > 0 else 0.0
        overlap_next = args.overlap_sec if end < duration else 0.0

        print(f"Cutting and encoding {chunk_id}: {start:.2f}s to {end:.2f}s (duration: {end-start:.2f}s)")
        create_mp4_chunk(args.source, chunk_file, start, end)

        chunks.append({
            "chunkId": chunk_id,
            "src": chunk_file,
            "absoluteStartSec": start,
            "absoluteEndSec": end,
            "overlapPrevSec": overlap_prev,
            "overlapNextSec": overlap_next
        })

        start += (args.chunk_sec - args.overlap_sec)
        chunk_index += 1

    manifest_path = os.path.join(args.out, "..", "chunks_manifest.json")
    manifest_path = os.path.abspath(manifest_path)
    
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Created {len(chunks)} MP4 chunks in {args.out}")
    print(f"Saved chunks manifest to {manifest_path}")


if __name__ == "__main__":
    main()
