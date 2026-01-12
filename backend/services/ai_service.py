import json
from groq import Groq
from config import Config

groq_client = Groq(api_key=Config.GROQ_API_KEY)

SYSTEM_PROMPT = """
You are an AI Meeting Intelligence Engine for a product called 
"AI Smart Meeting Notes & Action Tracker".

Your job is to convert ANY kind of meeting notes or transcript into clean, structured JSON.

You must ALWAYS return valid JSON in the following format:

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

RULES:

SUMMARY:
- Provide a 2–4 sentence summary of the main discussion.

DECISIONS:
- Extract key decisions. If none, return an empty list.

ACTION ITEMS:
Extract every action item. For each:
- task = what needs to be done
- owner = who is responsible (infer if missing)
- deadline = convert all dates to YYYY-MM-DD
- priority = MUST be High, Medium, or Low (infer if missing)

PRIORITY INFERENCE:
High = urgent, blockers, backend issues, client issues, deadlines ≤ 2 days
Medium = normal tasks, deadlines 3–4 days
Low = enhancements, UI tweaks, deadlines ≥ 5 days

DEADLINE RULES:
If dates like “Monday” or “tomorrow” appear, convert using the meeting date.
If no deadline exists, return an empty string "".

OWNER RULE:
If owner not mentioned, infer from context.
If not possible, set owner to "Unassigned".

OUTPUT RULE:
ONLY return JSON. No commentary. No markdown. No explanation.
"""

def run_ai(notes):
    USER_PROMPT = f"""
Meeting Notes:
{notes}

Return ONLY the JSON structure defined above.
"""

    response = groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT}
        ]
    )

    ai_output = response.choices[0].message.content.strip()

    # Try parsing JSON output
    try:
        parsed = json.loads(ai_output)
    except json.JSONDecodeError:
        # Invalid JSON fallback
        return {
            "summary": "",
            "key_decisions": [],
            "action_items": []
        }

    # Ensure fields always exist
    if not isinstance(parsed, dict):
        # If AI accidentally returns a list or text
        return {
            "summary": "",
            "key_decisions": [],
            "action_items": []
        }

    parsed.setdefault("summary", "")
    parsed.setdefault("key_decisions", [])
    parsed.setdefault("action_items", [])

    # Final safety check
    if not isinstance(parsed["action_items"], list):
        parsed["action_items"] = []

    return parsed
