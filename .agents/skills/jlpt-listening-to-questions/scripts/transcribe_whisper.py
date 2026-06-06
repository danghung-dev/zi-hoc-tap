#!/usr/bin/env python3
"""Transcribe listening MP3 using faster-whisper and output word-level timestamps."""

import argparse
import json
import os
import sys
import time

def safe_round(value, ndigits=2):
    return round(value, ndigits) if value is not None else None

def transcribe(audio_path, output_path, model_size="large-v3-turbo", language="ja"):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.stderr.write(
            "Missing dependency 'faster-whisper'. Install with:\n"
            "    pip install faster-whisper\n"
        )
        sys.exit(2)

    print(f"Loading faster-whisper model '{model_size}' on CPU...")
    # On macOS CPU, int8 is much faster and uses less memory
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    print(f"Transcribing {audio_path} (language: {language}, model: {model_size})...")
    start_time = time.time()
    
    segments, info = model.transcribe(
        audio_path,
        beam_size=5,
        word_timestamps=True,
        language=language,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500),
    )

    print(
        f"Detected language '{info.language}' "
        f"with probability {info.language_probability:.2f}"
    )

    output_segments = []

    for segment in segments:
        words_list = []

        if segment.words:
            for word in segment.words:
                words_list.append({
                    "word": word.word,
                    "start": safe_round(word.start),
                    "end": safe_round(word.end),
                    "probability": safe_round(word.probability, 4),
                })

        output_segments.append({
            "start": safe_round(segment.start),
            "end": safe_round(segment.end),
            "text": segment.text.strip(),
            "words": words_list,
        })

        # Flush output immediately
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text.strip()}", flush=True)

    elapsed = time.time() - start_time
    print(f"Transcription completed in {elapsed:.2f} seconds.")

    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "language": info.language,
            "language_probability": safe_round(info.language_probability, 4),
            "duration": safe_round(info.duration),
            "segments": output_segments,
            "elapsed_seconds": round(elapsed, 2)
        }, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved raw transcript with word-level timestamps to {output_path}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio", help="Path to input audio file, e.g. MP3/WAV")
    ap.add_argument("-o", "--out", required=True, help="Path to save output JSON")
    ap.add_argument("--model", default="large-v3-turbo", help="Model size, e.g. medium, large-v3, large-v3-turbo")
    ap.add_argument("--lang", default="ja", help="Language code, default: ja")
    args = ap.parse_args()

    if not os.path.isfile(args.audio):
        print(f"Error: Audio file {args.audio} not found", file=sys.stderr)
        sys.exit(1)

    transcribe(args.audio, args.out, model_size=args.model, language=args.lang)

if __name__ == "__main__":
    main()
