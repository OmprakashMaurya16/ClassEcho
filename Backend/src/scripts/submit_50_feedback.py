#!/usr/bin/env python3
"""
Bulk-submit 50 feedback entries to ClassEcho backend.

Targets backend endpoint: POST /api/feedback/submit
Payload shape:
  {
    token,
    studentName,
    rollNo,
    rating: {
      conceptClarity,
      lectureStructure,
      subjectMastery,
      practicalUnderstanding,
      studentEngagement,
      lecturePace,
      learningOutcomeImpact
    },
    remark
  }
"""

from __future__ import annotations

import json
import random
import sys
from dataclasses import dataclass
from datetime import datetime
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

DEFAULT_FEEDBACK_URL = "http://localhost:5173/feedback?token=05c177bcf987234ffeaa95b92b2dee10"
DEFAULT_API_BASE = "http://localhost:5000"
SUBMIT_ENDPOINT = "/api/feedback/submit"
TOTAL_SUBMISSIONS = 50
TIMEOUT_SECONDS = 20

FIRST_NAMES = [
    "Aarav", "Vihaan", "Aditya", "Arjun", "Ishaan", "Reyansh", "Krish", "Rohan", "Siddharth", "Nikhil",
    "Ananya", "Diya", "Aisha", "Kavya", "Riya", "Sneha", "Meera", "Pooja", "Ira", "Tanya",
    "Rahul", "Pranav", "Yash", "Harsh", "Aman", "Manav", "Neha", "Priya", "Simran", "Naina",
]

LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Singh", "Khan", "Iyer", "Reddy", "Mehta", "Gupta", "Joshi",
    "Kulkarni", "Chopra", "Mishra", "Naidu", "Bose", "Pillai", "Saxena", "Arora", "Dubey", "Das",
]

REMARKS = [
    "The lecture was clear and helped me understand the topic better.",
    "I liked the practical examples used during the class.",
    "The pace was slightly fast, but overall it was a good session.",
    "Please include a few more problem-solving questions next time.",
    "Good explanation of concepts and useful classroom discussion.",
    "The structure was organized and easy to follow.",
    "Would appreciate a quick recap at the end of class.",
    "The session improved my confidence in this subject.",
    "More real-world applications would make it even better.",
    "Engaging lecture and doubts were addressed clearly.",
]

RATING_KEYS = [
    "conceptClarity",
    "lectureStructure",
    "subjectMastery",
    "practicalUnderstanding",
    "studentEngagement",
    "lecturePace",
    "learningOutcomeImpact",
]


@dataclass
class SubmitResult:
    success: int = 0
    duplicate: int = 0
    failed: int = 0


def parse_token(feedback_url: str) -> str:
    parsed = urlparse(feedback_url)
    token = parse_qs(parsed.query).get("token", [""])[0].strip()
    if not token:
        raise ValueError("Could not find token in feedback URL")
    return token


def make_name(index: int) -> str:
    first = FIRST_NAMES[index % len(FIRST_NAMES)]
    last = LAST_NAMES[(index * 3) % len(LAST_NAMES)]
    return f"{first} {last}"


def make_roll_no(index: int) -> str:
    # Example: CS24B1001, CS24B1002, ...
    return f"CS24B{1001 + index:04d}"


def make_rating() -> dict[str, int]:
    # Bias toward realistic classroom feedback: mostly 3-5, occasional 2.
    rating = {}
    for key in RATING_KEYS:
        rating[key] = random.choices([2, 3, 4, 5], weights=[1, 3, 5, 4], k=1)[0]
    return rating


def post_json(url: str, payload: dict) -> tuple[int, dict]:
    body = json.dumps(payload).encode("utf-8")
    req = Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            text = resp.read().decode("utf-8")
            data = json.loads(text) if text else {}
            return resp.status, data
    except HTTPError as exc:
        text = exc.read().decode("utf-8") if exc.fp else ""
        data = json.loads(text) if text else {}
        return exc.code, data
    except URLError as exc:
        return 0, {"message": f"Connection error: {exc.reason}"}


def run(feedback_url: str, api_base: str) -> int:
    random.seed(42)

    try:
        token = parse_token(feedback_url)
    except ValueError as exc:
        print(f"Error: {exc}")
        return 1

    endpoint = api_base.rstrip("/") + SUBMIT_ENDPOINT
    results = SubmitResult()

    print("=" * 72)
    print("ClassEcho bulk feedback submitter")
    print(f"Time: {datetime.now().isoformat(timespec='seconds')}")
    print(f"Target API: {endpoint}")
    print(f"Token: {token}")
    print(f"Planned submissions: {TOTAL_SUBMISSIONS}")
    print("=" * 72)

    for i in range(TOTAL_SUBMISSIONS):
        student_name = make_name(i)
        roll_no = make_roll_no(i)
        rating = make_rating()
        remark = REMARKS[i % len(REMARKS)]

        payload = {
            "token": token,
            "studentName": student_name,
            "rollNo": roll_no,
            "rating": rating,
            "remark": remark,
        }

        status, data = post_json(endpoint, payload)

        if status == 201:
            results.success += 1
            print(f"[{i+1:02d}] OK   {roll_no}  {student_name}")
        elif status == 409:
            results.duplicate += 1
            msg = data.get("message", "already submitted")
            print(f"[{i+1:02d}] DUP  {roll_no}  {msg}")
        else:
            results.failed += 1
            msg = data.get("message") or data.get("error") or "Unknown error"
            print(f"[{i+1:02d}] ERR  {roll_no}  status={status}  {msg}")

    print("-" * 72)
    print(f"Success : {results.success}")
    print(f"Duplicate: {results.duplicate}")
    print(f"Failed  : {results.failed}")
    print("-" * 72)

    return 0 if results.failed == 0 else 2


def main() -> int:
    feedback_url = DEFAULT_FEEDBACK_URL
    api_base = DEFAULT_API_BASE

    # Optional CLI arguments:
    #   python submit_50_feedback.py <feedback_url> <api_base>
    if len(sys.argv) >= 2:
        feedback_url = sys.argv[1].strip()
    if len(sys.argv) >= 3:
        api_base = sys.argv[2].strip()

    return run(feedback_url, api_base)


if __name__ == "__main__":
    raise SystemExit(main())
