#!/usr/bin/env python3
"""Align whisper raw word-level timestamps with expected questions from HTML."""

import argparse
import json
import os
import re
import sys

# Japanese number mappings
KANJI_NUMS = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10}
HIRA_NUMS = {
    "いち": 1, "に": 2, "さん": 3, "よん": 4, "し": 4, "ご": 5,
    "ろく": 6, "なな": 7, "しち": 7, "はち": 8, "きゅう": 9, "く": 9, "じゅう": 10
}

def parse_japanese_num(text):
    text = text.strip()
    if not text:
        return None
    
    # Check if text is just digits
    m = re.match(r"^([0-9０-９]+)", text)
    if m:
        num_str = m.group(1).translate(str.maketrans("０１２３４５６７８９", "0123456789"))
        return int(num_str)
    
    if text in KANJI_NUMS:
        return KANJI_NUMS[text]
    
    if text in HIRA_NUMS:
        return HIRA_NUMS[text]
    
    return None

def detect_markers(whisper_data):
    segments = whisper_data.get("segments", [])
    events = []

    # Regex patterns
    mondai_pat = re.compile(r"(問題|もんだい|モンダイ)\s*([0-9０-９一二三四五六七八九十]|いち|に|さん|よん|し|ご)")
    example_pat = re.compile(r"\b(例|れい|レイ)\b|^(例|れい|レイ)$|^(例|れい|レイ)です")
    
    # Question announcement matching "[Number]番" or "[Number]ばん"
    q_pat = re.compile(r"([0-9０-９一二三四五六七八九十]+|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう|く|じゅう)\s*(番|ばん)")

    last_q_time = -100.0

    for seg_idx, seg in enumerate(segments):
        text = seg.get("text", "").strip()
        start = seg.get("start", 0.0)
        end = seg.get("end", 0.0)
        words = seg.get("words", [])

        # 1. Mondai marker check
        m_mondai = mondai_pat.search(text)
        if m_mondai:
            val = parse_japanese_num(m_mondai.group(2))
            if val:
                word_start = start
                for w in words:
                    if m_mondai.group(0) in w.get("word", "") or m_mondai.group(2) in w.get("word", ""):
                        word_start = w.get("start", start)
                        break
                events.append({
                    "type": "mondai_marker",
                    "number": val,
                    "time": word_start,
                    "text": text,
                    "segment_idx": seg_idx
                })
                continue

        # 2. Example marker check
        if example_pat.search(text) and len(text) < 15:
            word_start = start
            for w in words:
                if any(k in w.get("word", "") for k in ["例", "れい", "レイ"]):
                    word_start = w.get("start", start)
                    break
            events.append({
                "type": "example_marker",
                "time": word_start,
                "text": text,
                "segment_idx": seg_idx
            })
            continue

        # 3. Question marker check
        # Match "1番", "一番", "いちばん"
        m_q = q_pat.search(text)
        if m_q:
            val = parse_japanese_num(m_q.group(1))
            if val:
                word_start = start
                for w in words:
                    cleaned_w = w.get("word", "")
                    if m_q.group(0) in cleaned_w or m_q.group(1) in cleaned_w or "番" in cleaned_w or "ばん" in cleaned_w:
                        word_start = w.get("start", start)
                        break
                events.append({
                    "type": "question_start",
                    "number": val,
                    "time": word_start,
                    "text": text,
                    "segment_idx": seg_idx
                })
                last_q_time = word_start
                continue

    return events

def align_timeline(events, counts, max_duration):
    """Align detected events to expected Mondais and questions by partitioning the timeline."""
    questions_out = []
    global_no = 1

    # Group events
    mondai_events = [e for e in events if e["type"] == "mondai_marker"]
    example_events = [e for e in events if e["type"] == "example_marker"]
    q_starts = [e for e in events if e["type"] == "question_start"]

    # 1. Establish Mondai start times
    mondai_starts = {}
    for m_idx in range(len(counts)):
        mondai_num = m_idx + 1
        
        # Find the first mondai marker for this number
        m_start = None
        for me in mondai_events:
            if me["number"] == mondai_num:
                m_start = me["time"]
                break
        
        if m_start is not None:
            mondai_starts[mondai_num] = m_start
        else:
            # Fallback estimation
            if mondai_num == 1:
                mondai_starts[mondai_num] = 0.0
            else:
                # 60s per expected question of previous Mondai + previous start
                prev_count = counts[mondai_num - 2]
                mondai_starts[mondai_num] = mondai_starts[mondai_num - 1] + (prev_count * 60.0) + 30.0
                # Cap at max duration
                mondai_starts[mondai_num] = min(mondai_starts[mondai_num], max_duration)

    print(f"Mondai partition starts: { {k: round(v, 2) for k, v in mondai_starts.items()} }")

    # 2. Map questions inside each Mondai partition
    for m_idx, expected_q_count in enumerate(counts):
        mondai_num = m_idx + 1
        
        win_start = mondai_starts[mondai_num]
        win_end = mondai_starts[mondai_num + 1] if (mondai_num + 1) in mondai_starts else max_duration

        # Find all question starts falling inside this Mondai's window
        m_qs = [qs for qs in q_starts if win_start <= qs["time"] < win_end]
        
        # Sort them chronologically
        m_qs.sort(key=lambda x: x["time"])
        
        # Deduplicate question starts that are too close (e.g. within 10 seconds of each other)
        dedup_qs = []
        for qs in m_qs:
            if not dedup_qs or (qs["time"] - dedup_qs[-1]["time"] > 10.0):
                dedup_qs.append(qs)

        print(f"Mondai {mondai_num} window [{win_start:.2f}s -> {win_end:.2f}s]: found {len(dedup_qs)} question markers, expected {expected_q_count}")

        # Map markers to expected questions
        for q_idx in range(expected_q_count):
            q_num = q_idx + 1
            
            # If we have a marker for this index, use it
            if q_idx < len(dedup_qs):
                q_marker = dedup_qs[q_idx]
                q_start_sec = q_marker["time"]
                confidence = "high"
                print(f"  M{mondai_num} Q{q_num} matched to marker at {q_start_sec:.2f}s (text: '{q_marker['text']}')")
            else:
                # Estimate start time if we ran out of markers
                confidence = "low"
                if q_num == 1:
                    # Find example marker in this window
                    m_ex = [ex for ex in example_events if win_start <= ex["time"] < win_start + 45.0]
                    if m_ex:
                        q_start_sec = m_ex[0]["time"] + 30.0  # Usually starts ~30s after example starts
                    else:
                        q_start_sec = win_start + 35.0
                else:
                    q_start_sec = questions_out[-1]["startSec"] + 65.0
                
                # Ensure it doesn't overshoot window end
                q_start_sec = min(q_start_sec, win_end - 10.0)
                print(f"  M{mondai_num} Q{q_num} NOT matched. Estimated start at {q_start_sec:.2f}s")

            questions_out.append({
                "mondai": mondai_num,
                "questionNo": q_num,
                "globalQuestionNo": global_no,
                "startSec": round(q_start_sec, 2),
                "endSec": None, # Will fill next
                "confidence": confidence,
                "needsReview": confidence == "low"
            })
            global_no += 1

    # 3. Fill in endSec for all questions
    for i, q in enumerate(questions_out):
        m = q["mondai"]
        start_sec = q["startSec"]

        # Default end is the start of the next question
        if i < len(questions_out) - 1:
            next_q = questions_out[i + 1]
            if next_q["mondai"] == m:
                end_sec = next_q["startSec"] - 2.0
            else:
                # Next question is in a new mondai.
                # So this question ends before the next Mondai start.
                next_m_start = mondai_starts[next_q["mondai"]]
                end_sec = next_m_start - 2.0
        else:
            end_sec = max_duration

        # Sanity check margins
        if end_sec <= start_sec:
            end_sec = start_sec + 40.0
        
        # Ensure it doesn't exceed next question start
        if i < len(questions_out) - 1:
            end_sec = min(end_sec, questions_out[i + 1]["startSec"] - 1.5)

        q["endSec"] = round(end_sec, 2)

    return questions_out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("whisper_raw", help="Path to whisper_raw.json")
    ap.add_argument("listen_raw", help="Path to HTML parsed listen_raw.json")
    ap.add_argument("-o", "--out", required=True, help="Output path for timestamp_candidates.json")
    ap.add_argument("--exam", required=True, help="Exam ID (e.g. de3)")
    args = ap.parse_args()

    with open(args.whisper_raw, encoding="utf-8") as f:
        whisper_data = json.load(f)
    
    with open(args.listen_raw, encoding="utf-8") as f:
        listen_data = json.load(f)

    # Question counts per Mondai
    counts = [len(m.get("questions", [])) for m in listen_data.get("mondai", [])]
    
    print(f"Parsed expected question counts per Mondai: {counts}")
    max_duration = whisper_data.get("duration", 0.0)
    print(f"Total audio duration: {max_duration:.2f}s")

    # Detect events
    events = detect_markers(whisper_data)
    print(f"Detected {len(events)} marker candidates in whisper transcript")

    # Align
    questions = align_timeline(events, counts, max_duration)

    output_data = {
        "exam": args.exam,
        "counts": counts,
        "questions": questions
    }

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully aligned and wrote candidates to {args.out}")

if __name__ == "__main__":
    main()
