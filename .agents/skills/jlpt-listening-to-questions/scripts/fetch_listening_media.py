#!/usr/bin/env python3
"""Fetch listening MP3 and images from gojapan.vn HTML page."""

import argparse
import json
import os
import re
import sys
from urllib.request import urlretrieve, Request, build_opener, install_opener
from urllib.error import URLError

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.stderr.write("Missing dependency 'beautifulsoup4'. Install with pip install beautifulsoup4\n")
    sys.exit(2)


def configure_urllib():
    import ssl
    try:
        ctx = ssl._create_unverified_context()
        import urllib.request
        handler = urllib.request.HTTPSHandler(context=ctx)
        opener = build_opener(handler)
    except Exception:
        opener = build_opener()
        
    # Setup custom user agent to avoid 403 Forbidden from some web servers
    opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')]
    install_opener(opener)
    
    try:
        ssl._create_default_https_context = ssl._create_unverified_context
    except AttributeError:
        pass


def fetch_url(url, dest_path):
    print(f"Downloading {url} -> {dest_path}")
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    try:
        urlretrieve(url, dest_path)
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        # Try downloading with a clean URL (stripping query params)
        clean_url = url.split('?')[0]
        if clean_url != url:
            print(f"Retrying with clean URL: {clean_url}")
            urlretrieve(clean_url, dest_path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("html", help="Path to the exam HTML file")
    ap.add_argument("--out", required=True, help="Output directory (e.g. temp/listening)")
    args = ap.parse_args()

    configure_urllib()

    with open(args.html, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Find the audio source url
    audio_tag = soup.find("audio")
    audio_url = None
    if audio_tag:
        source_tag = audio_tag.find("source")
        if source_tag and source_tag.get("src"):
            audio_url = source_tag.get("src")
        elif audio_tag.get("src"):
            audio_url = audio_tag.get("src")

    if not audio_url:
        # Fallback search for a wp-audio-shortcode class or href matching .mp3
        for a in soup.find_all("a", href=True):
            if ".mp3" in a["href"]:
                audio_url = a["href"]
                break

    if not audio_url:
        print("Error: Could not find audio URL in HTML", file=sys.stderr)
        sys.exit(1)

    print(f"Found audio URL: {audio_url}")
    dest_audio = os.path.join(args.out, "source.mp3")
    fetch_url(audio_url, dest_audio)

    # Walk through the HTML part-wrapper that represents the listening part (usually second part-wrapper or contains Mondai 1 for listening)
    # Find all question elements in the HTML for Part 2
    images_to_fetch = []
    
    # We can detect listening part wrapper or search all questions with id/anchor having "p2" or "m1"..."m4"
    # To be extremely safe, we will find all divs with class "question" inside the second half or having p2 in id.
    questions = soup.find_all("div", class_="question")
    
    for q in questions:
        anchor_id = q.get("id", "")
        # Check if this question is part of p2 (listening)
        # Typically the id is anchor_p2_mX_qY
        if "p2_" not in anchor_id:
            # Check parent part wrapper if not in id
            parent_wrapper = q.find_parent("div", class_="part-wrapper")
            if parent_wrapper:
                h2 = parent_wrapper.find("h2")
                if h2 and "聴解" not in h2.get_text():
                    continue
            else:
                continue

        # Extract images in content
        content_div = q.find("div", class_="content")
        if content_div:
            img_tags = content_div.find_all("img")
            for idx, img in enumerate(img_tags):
                src = img.get("src")
                if not src:
                    continue
                
                # Determine kind
                # Mondai 1 has multiple option images, Mondai 3 has 1 situation image
                kind = "option" if "m1_" in anchor_id else "situation"
                
                # Deduce file extension
                ext = ".png"
                if ".jpg" in src.lower() or ".jpeg" in src.lower():
                    ext = ".jpg"
                
                img_name = os.path.basename(src).split('?')[0]
                local_path = os.path.join(args.out, "images", "raw", img_name)
                
                images_to_fetch.append({
                    "questionId": anchor_id,
                    "sourceUrl": src,
                    "localPath": local_path,
                    "kind": kind,
                    "optionIndex": idx if kind == "option" else None
                })

    # Download images and build manifest
    manifest_images = []
    for img_info in images_to_fetch:
        fetch_url(img_info["sourceUrl"], img_info["localPath"])
        # Only add to manifest if download succeeded/file exists
        if os.path.exists(img_info["localPath"]):
            manifest_images.append(img_info)

    manifest = {
        "audio": {
            "sourceUrl": audio_url,
            "localPath": dest_audio
        },
        "images": manifest_images
    }

    manifest_path = os.path.join(args.out, "media_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Saved media manifest to {manifest_path}")


if __name__ == "__main__":
    main()
