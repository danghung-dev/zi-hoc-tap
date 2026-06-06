#!/usr/bin/env python3
"""Extract Part 1 or Part 2 of a gojapan.vn JLPT mock-exam HTML into an
intermediate JSON structure.
"""

import argparse
import json
import re
import sys

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.stderr.write(
        "Missing dependency 'beautifulsoup4'. Install with:\n"
        "    pip install beautifulsoup4\n"
    )
    sys.exit(2)


_WS = re.compile(r"[ \t\r\n\f\v]+")
_BLANK = re.compile(r"\[(\d+)\]")
_RADIO_PART = re.compile(r"answer\[(p\d+)\]")


def norm(s):
    if not s:
        return ""
    return _WS.sub(" ", s).strip()


def classes(tag):
    return tag.get("class", []) if tag else []


def part_of_question_row(row):
    radio = row.find("input", attrs={"name": _RADIO_PART})
    if radio:
        m = _RADIO_PART.search(radio.get("name", ""))
        if m:
            return m.group(1)
    return None


def extract_options(answer_div):
    options = []
    for fc in answer_div.find_all("div", class_="form-check"):
        radio = fc.find("input", attrs={"type": "radio"})
        label = fc.find("label")
        if radio is None or label is None:
            continue
        try:
            index = int(radio.get("value"))
        except (TypeError, ValueError):
            index = len(options)
        options.append({"index": index, "text": norm(label.get_text())})
    options.sort(key=lambda o: o["index"])
    return options


def extract_question(row):
    qdiv = row.find("div", class_="question")
    content = qdiv.find("div", class_="content") if qdiv else None
    answer = qdiv.find("div", class_="answer") if qdiv else None

    number = None
    h4 = row.find("h4")
    if h4:
        number = norm(h4.get_text()).rstrip(".")

    images, underlined, content_html, content_text = [], [], "", ""
    if content is not None:
        images = [img.get("src") for img in content.find_all("img") if img.get("src")]
        underlined = [norm(u.get_text()) for u in content.find_all("u")]
        work = BeautifulSoup(str(content), "html.parser")
        for img in work.find_all("img"):
            img.decompose()
        inner = work.find("div", class_="content")
        content_html = norm((inner or work).decode_contents())
        content_text = norm(content.get_text())

    blanks = _BLANK.findall(content_text)

    return {
        "anchorId": qdiv.get("id") if qdiv else None,
        "number": number,
        "contentHtml": content_html,
        "contentText": content_text,
        "underlined": underlined,
        "images": images,
        "hasStar": "★" in content_text,
        "blankMarkers": blanks,
        "options": extract_options(answer) if answer else [],
    }


def extract_passage(div):
    images = [img.get("src") for img in div.find_all("img") if img.get("src")]
    return {"text": norm(div.get_text()), "images": images}


def is_question_row(div):
    cls = classes(div)
    return "d-flex" in cls and div.find("div", class_="question") is not None


def is_passage_block(div):
    cls = classes(div)
    return (
        "p-3" in cls
        and "border-bottom" in cls
        and "d-flex" not in cls
        and div.find("div", class_="question") is None
    )


def extract_mondai(mondai_div, want_part="p1"):
    h3 = mondai_div.find("h3")
    number, instruction = None, ""
    if h3:
        spans = h3.find_all("span")
        if spans:
            m = re.search(r"(\d+)", norm(spans[0].get_text()))
            if m:
                number = int(m.group(1))
        if len(spans) > 1:
            instruction = norm(spans[1].get_text())
        elif spans:
            instruction = norm(h3.get_text())

    passages, questions = [], []
    for child in mondai_div.find_all("div", recursive=False):
        if is_question_row(child):
            if part_of_question_row(child) != want_part:
                return None
            questions.append(extract_question(child))
        elif is_passage_block(child):
            passages.append(extract_passage(child))

    if not questions:
        return None

    bare_number_contents = sum(
        1 for q in questions if re.fullmatch(r"\d+", q["contentText"])
    )
    signals = {
        "hasStar": any(q["hasStar"] for q in questions),
        "hasNumberedBlanks": any(_BLANK.search(p["text"]) for p in passages)
        or bare_number_contents >= 2,
        "hasPassageBlocks": len(passages) > 0,
        "hasImages": any(p["images"] for p in passages)
        or any(q["images"] for q in questions),
    }

    return {
        "number": number,
        "instruction": instruction,
        "passages": passages,
        "signals": signals,
        "questions": questions,
    }


def detect_level(soup):
    title = soup.find("title")
    text = norm(title.get_text()) if title else ""
    m = re.search(r"\bN([1-5])\b", text)
    level = f"N{m.group(1)}" if m else None
    de = re.search(r"[ĐĐ]ề\s*(\d+)", text)
    exam = de.group(0) if de else None
    return level, exam, text


def parse(html, want_part="p1"):
    soup = BeautifulSoup(html, "html.parser")
    level, exam, title = detect_level(soup)

    section_title = None
    mondais = []
    for mondai_div in soup.find_all("div", class_="mondai"):
        parsed = extract_mondai(mondai_div, want_part=want_part)
        if parsed is None:
            continue
        if section_title is None:
            wrapper = mondai_div.find_parent("div", class_="part-wrapper")
            if wrapper:
                h2 = wrapper.find("h2")
                if h2:
                    section_title = norm(h2.get_text())
        mondais.append(parsed)

    return {
        "examTitle": title,
        "level": level,
        "exam": exam,
        "part": want_part,
        "sectionTitle": section_title,
        "mondaiCount": len(mondais),
        "questionCount": sum(len(m["questions"]) for m in mondais),
        "mondai": mondais,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("html", help="Path to the exam HTML file")
    ap.add_argument("-o", "--out", help="Write JSON here instead of stdout")
    ap.add_argument(
        "--part",
        default="p1",
        help="Which part to extract (default p1 = language knowledge, p2 = listening)",
    )
    args = ap.parse_args()

    with open(args.html, encoding="utf-8") as f:
        html = f.read()

    result = parse(html, want_part=args.part)
    out = json.dumps(result, ensure_ascii=False, indent=2)
    if args.out:
        import os
        os.makedirs(os.path.dirname(args.out), exist_ok=True)
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(out)
        sys.stderr.write(
            f"Wrote {result['mondaiCount']} mondai / {result['questionCount']} "
            f"questions to {args.out}\n"
        )
    else:
        print(out)


if __name__ == "__main__":
    main()
