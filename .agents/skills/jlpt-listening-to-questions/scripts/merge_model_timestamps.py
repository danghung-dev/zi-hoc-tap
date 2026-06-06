#!/usr/bin/env python3
"""Merge model chunk observations into absolute timestamps for all questions."""

import argparse
import glob
import json
import os
import sys


def parse_counts(counts_str):
    try:
        return [int(c) for c in counts_str.split(",")]
    except ValueError:
        print("Error: --counts must be a comma-separated list of integers", file=sys.stderr)
        sys.exit(1)


def load_chunks_manifest(manifest_path):
    if not os.path.exists(manifest_path):
        print(f"Error: manifest file {manifest_path} not found", file=sys.stderr)
        sys.exit(1)
    with open(manifest_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    return {c["chunkId"]: c for c in chunks}


def load_observations(obs_dir, chunks_by_id):
    pattern = os.path.join(obs_dir, "*.json")
    files = glob.glob(pattern)
    events = []

    for fpath in files:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to parse {fpath}: {e}", file=sys.stderr)
            continue

        chunk_id = data.get("chunkId")
        if not chunk_id or chunk_id not in chunks_by_id:
            print(f"Warning: Chunk ID {chunk_id} in {fpath} not found in manifest", file=sys.stderr)
            continue

        chunk_meta = chunks_by_id[chunk_id]
        abs_start = chunk_meta["absoluteStartSec"]
        abs_end = chunk_meta["absoluteEndSec"]
        chunk_dur = abs_end - abs_start

        # Parse observations
        for obs in data.get("observations", []):
            rel_time = obs.get("timeInChunkSec")
            if rel_time is None:
                continue

            # Skip hallucinations that go beyond the chunk end
            if rel_time > chunk_dur + 5.0:
                print(f"Warning: Skipping hallucinated event {obs.get('type')} Q{obs.get('questionNo')} in {chunk_id} at {rel_time}s (chunk duration: {chunk_dur}s)")
                continue

            abs_time = abs_start + rel_time
            obs_type = obs.get("type")

            events.append({
                "chunkId": chunk_id,
                "type": obs_type,
                "mondai": obs.get("mondai"),
                "questionNo": obs.get("questionNo"),
                "label": obs.get("label"),
                "absoluteSec": abs_time,
                "confidence": obs.get("confidence", "medium"),
                "heardTextJa": obs.get("heardTextJa", "")
            })

    # Sort all events by absolute timestamp
    events.sort(key=lambda e: e["absoluteSec"])
    return events


def deduplicate_events(events, time_threshold=6.0):
    """Group events of the same type and same mondai/question that are close in time."""
    deduped = []
    for e in events:
        # Find if we already have a similar event close in time
        matched = False
        for d in deduped:
            if d["type"] == e["type"] and d["mondai"] == e["mondai"] and d["questionNo"] == e["questionNo"] and d["label"] == e["label"]:
                if abs(d["absoluteSec"] - e["absoluteSec"]) < time_threshold:
                    # Update with higher confidence, or average the timestamp
                    if e["confidence"] == "high" and d["confidence"] != "high":
                        d["absoluteSec"] = e["absoluteSec"]
                        d["confidence"] = "high"
                    else:
                        # Average the times
                        d["absoluteSec"] = (d["absoluteSec"] + e["absoluteSec"]) / 2.0
                    
                    if e["heardTextJa"] and not d["heardTextJa"]:
                        d["heardTextJa"] = e["heardTextJa"]
                    matched = True
                    break
        if not matched:
            deduped.append(e)
    return deduped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--observations", required=True, help="Directory containing model chunk observations JSON files")
    ap.add_argument("--chunks", required=True, help="Path to chunks_manifest.json")
    ap.add_argument("--raw", required=True, help="Path to raw parse JSON (e.g. listen_raw.json)")
    ap.add_argument("--counts", required=True, help="Expected question counts per Mondai (e.g. 8,7,8,9)")
    ap.add_argument("--exam", required=True, help="Exam identifier (e.g. de3)")
    ap.add_argument("-o", "--out", required=True, help="Output path for timestamp_candidates.json")
    args = ap.parse_args()

    counts = parse_counts(args.counts)
    chunks_by_id = load_chunks_manifest(args.chunks)
    
    # Load raw questions to inspect total numbers
    with open(args.raw, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    raw_questions = []
    for m in raw_data.get("mondai", []):
        m_num = m.get("number")
        for q in m.get("questions", []):
            raw_questions.append({
                "mondai": m_num,
                "questionNo": int(q.get("number", 0))
            })

    raw_count = len(raw_questions)
    expected_count = sum(counts)
    print(f"Raw questions in HTML: {raw_count}, Expected count: {expected_count}")

    raw_events = load_observations(args.observations, chunks_by_id)
    events = deduplicate_events(raw_events)

    print(f"Loaded {len(raw_events)} events, deduplicated to {len(events)}")

    # Extract markers
    mondai_markers = sorted([e for e in events if e["type"] == "mondai_marker"], key=lambda x: x["absoluteSec"])
    q_starts = [e for e in events if e["type"] == "question_start"]
    q_ends = [e for e in events if e["type"] == "question_end"]

    questions_out = []
    global_no = 1

    # Map start/ends by (mondai, questionNo)
    starts_map = {(e["mondai"], e["questionNo"]): e for e in q_starts if e["mondai"] is not None and e["questionNo"] is not None}
    ends_map = {(e["mondai"], e["questionNo"]): e for e in q_ends if e["mondai"] is not None and e["questionNo"] is not None}

    # Find the duration of the whole MP3 from the last chunk
    last_chunk = max(chunks_by_id.values(), key=lambda c: c["absoluteEndSec"])
    max_duration = last_chunk["absoluteEndSec"]

    # We will build timestamps for each expected question
    for m_idx, expected_q_count in enumerate(counts):
        mondai_num = m_idx + 1
        
        # Find start of this Mondai block using mondai_markers
        # Default start is 0 for Mondai 1, or end of previous Mondai
        mondai_start_sec = 0.0
        for marker in mondai_markers:
            if marker["mondai"] == mondai_num:
                mondai_start_sec = marker["absoluteSec"]
                break
            elif marker["label"] == f"問題{mondai_num}":
                mondai_start_sec = marker["absoluteSec"]
                break

        for q_idx in range(expected_q_count):
            q_num = q_idx + 1
            key = (mondai_num, q_num)
            
            start_obs = starts_map.get(key)
            end_obs = ends_map.get(key)

            # Determine start timestamp
            if start_obs:
                start_sec = start_obs["absoluteSec"]
                confidence = start_obs["confidence"]
            else:
                # Fallback: estimate start based on previous question or mondai start
                confidence = "low"
                if q_idx > 0:
                    prev_key = (mondai_num, q_num - 1)
                    prev_end = ends_map.get(prev_key)
                    if prev_end:
                        start_sec = prev_end["absoluteSec"] + 2.0
                    else:
                        # Guess: 60s per question
                        start_sec = questions_out[-1]["endSec"] + 2.0
                else:
                    # First question of Mondai: usually starts ~30s after Mondai marker due to instructions/example
                    start_sec = mondai_start_sec + 35.0

            # Determine end timestamp
            if end_obs:
                end_sec = end_obs["absoluteSec"]
            else:
                # Fallback: estimate end based on start of next question
                next_key = (mondai_num, q_num + 1)
                next_start = starts_map.get(next_key)
                if next_start:
                    end_sec = next_start["absoluteSec"] - 2.0
                else:
                    # Guess: if there is a next Mondai, it must end before that Mondai
                    next_mondai_start = None
                    for marker in mondai_markers:
                        if marker["mondai"] == mondai_num + 1 or marker["label"] == f"問題{mondai_num + 1}":
                            next_mondai_start = marker["absoluteSec"]
                            break
                    if next_mondai_start:
                        end_sec = next_mondai_start - 2.0
                    else:
                        # Last question of last Mondai
                        end_sec = min(start_sec + 60.0, max_duration)

            # Cap end_sec to prevent overlap with the next question's start
            next_key = (mondai_num, q_num + 1)
            next_start = starts_map.get(next_key)
            if next_start:
                end_sec = min(end_sec, next_start["absoluteSec"] - 1.5)

            # Sanity checks
            if end_sec <= start_sec:
                end_sec = start_sec + 10.0 # Force minimum duration

            questions_out.append({
                "mondai": mondai_num,
                "questionNo": q_num,
                "globalQuestionNo": global_no,
                "startSec": round(start_sec, 2),
                "endSec": round(end_sec, 2),
                "confidence": confidence,
                "needsReview": start_obs is None or end_obs is None
            })
            global_no += 1

    # Write output candidates
    output_data = {
        "exam": args.exam,
        "counts": counts,
        "questions": questions_out
    }

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Wrote merged timestamp candidates to {args.out}")


if __name__ == "__main__":
    main()
