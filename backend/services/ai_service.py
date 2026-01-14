import json
import re
import unicodedata
from groq import Groq
from config import Config

groq_client = Groq(api_key=Config.GROQ_API_KEY)

def normalize_text(text):
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = text.replace("–", "-").replace("—", "-").replace("−", "-")
    return text.strip()

SYSTEM_PROMPT = """
You are an AI Meeting Intelligence Engine for a product called 
"AI Smart Meeting Notes & Action Tracker".

Your ONLY job is to extract structured JSON from raw meeting notes.

=======================================================
              STRICT JSON FORMAT
=======================================================

You MUST return JSON in EXACTLY this format:

{
  "summary": "",
  "key_decisions": [],
  "action_items": [
    {
      "task": "",
      "owner": "",
      "deadline": "",
      "priority": ""
    }
  ]
}

NO extra text, NO markdown, NO comments.

=======================================================
              SUMMARY RULES
=======================================================
- Must be 2–4 sentences.
- Capture all major topics.
- No hallucinated information.

=======================================================
              KEY DECISIONS RULES (UPDATED & STRONG)
=======================================================

A "decision" is ANY statement where:
- The team agrees on something
- A direction is chosen
- A responsibility is assigned
- A solution is approved
- A task is confirmed verbally
- A review day or meeting day is confirmed

VERY IMPORTANT:
You MUST extract ALL decisions, not just one.

VALID decision indicators:
- "We agreed to..."
- "We decided..."
- "Decision made:"
- "Let's go with..."
- "Okay so we will..."
- "<Name> will <task>"
- "This will be done by <Name>"
- "Final review is on <weekday>"
- "We will use/patch/refactor..."

FORMAT RULES:
- Short phrases only
- No full sentences
- No dates allowed
- No assumptions
- No hallucinated decisions

VALID EXAMPLES:
- "Aayush will fix login bug"
- "Patch existing middleware"
- "Neha will refactor layout"
- "Rohan will fix notifications"
- "Monday is review day"

=======================================================
              ACTION ITEM RULES
=======================================================

Extract tasks that need action.

Owner:
- Extract name if present
- If missing → "Unassigned"

=======================================================
              DEADLINE RULES (MAXIMUM STRICT)
=======================================================

You must ONLY return a standalone weekday IF AND ONLY IF it appears 
exactly as-is in the notes:

Allowed outputs:
"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"

STRICTLY FORBIDDEN:
- Converting weekdays into calendar dates
- Adding numbers after a weekday
- Guessing or inferring any date
- Returning formats like "Thursday 2024-02-15"
- Returning "Thu", "Fri", or abbreviations
- Returning "Next Thursday", "This Thursday", "Last Thursday"

If a weekday is mentioned with extra text (e.g., "before Thursday"), 
deadline MUST be "".

If the weekday does not appear as a separate word, return "":


Priority:
- High = urgent, ASAP, blocking
- Medium = standard work
- Low = optional, UI, documentation

=======================================================
RETURN ONLY JSON. NO EXPLANATION.
=======================================================
"""

def contains_date_pattern(text):
    if not text:
        return False

    text_lower = text.lower()

    date_patterns = [
        r'\d{4}[-/]\d{1,2}[-/]\d{1,2}',
        r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
        r'\d{1,2}[-/]\d{1,2}',
        r'\d+'
    ]

    for pattern in date_patterns:
        if re.search(pattern, text_lower):
            return True

    return False


def clean_deadline(deadline, notes_text):
    if not deadline:
        return ""

    deadline = deadline.strip()

    if contains_date_pattern(deadline):
        return ""

    notes_lower = notes_text.lower()
    notes_words = notes_lower.split()

    weekdays = [
        "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday", "sunday"
    ]

    dl = deadline.lower()

    if dl in weekdays and dl in notes_words:
        return deadline.capitalize()

    for wd in weekdays:
        if wd in dl and wd in notes_words:
            return wd.capitalize()

    return ""

def run_ai(notes):
    normalized_notes = normalize_text(notes)

    USER_PROMPT = f"""
Meeting Notes:
{normalized_notes}

Follow ALL rules strictly.
Return ONLY valid JSON.
"""

    response = groq_client.chat.completions.create(
        model="llama3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT}
        ]
    )

    ai_output = response.choices[0].message.content.strip()

    # Parse JSON safely
    try:
        parsed = json.loads(ai_output)
    except:
        return {
            "summary": "",
            "key_decisions": [],
            "action_items": []
        }

    parsed.setdefault("summary", "")
    parsed.setdefault("key_decisions", [])
    parsed.setdefault("action_items", [])


    
    cleaned_decisions = []
    for d in parsed["key_decisions"]:
        if isinstance(d, str) and d.strip():
            cleaned_decisions.append(normalize_text(d))

    # If AI missed decisions, infer from action items
    for item in parsed["action_items"]:
        task = item.get("task", "").strip()
        owner = item.get("owner", "").strip()

        if owner and task:
            inferred = f"{owner} will {task}"
            if inferred not in cleaned_decisions:
                cleaned_decisions.append(inferred)

    # Remove duplicates
    cleaned_decisions = list(dict.fromkeys(cleaned_decisions))

    parsed["key_decisions"] = cleaned_decisions

    cleaned_items = []

    for item in parsed["action_items"]:
        task = normalize_text(item.get("task", ""))
        owner = normalize_text(item.get("owner", "Unassigned"))
        priority = normalize_text(item.get("priority", "")).capitalize()

        if priority not in ["High", "Medium", "Low"]:
            priority = "Medium"

        raw_deadline = normalize_text(item.get("deadline", ""))
        final_deadline = clean_deadline(raw_deadline, normalized_notes)

        cleaned_items.append({
            "task": task,
            "owner": owner if owner else "Unassigned",
            "deadline": final_deadline,
            "priority": priority
        })

    parsed["action_items"] = cleaned_items

    return parsed
