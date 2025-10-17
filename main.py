# main.py
import os
import re
import sys
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

# ----------------------------
# 1. RECONSTRUCTION
# ----------------------------
def reconstruct(fragment: str) -> str:
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
You are an AI archaeologist specializing in early internet culture (2000s–2010s).  
Reconstruct the following fragmented message into a single, fluent sentence in modern English that a thoughtful person might say today to express the same idea with full context.

Your reconstruction must:
- Expand all slang and acronyms into their full meanings (e.g., “smh” → “shaking my head”, “g2g” → “got to go”).
- Name specific platforms, features, or cultural phenomena when relevant.
- Use natural, human-like phrasing with appropriate emotional nuance (e.g., disappointment, urgency, nostalgia).
- Maintain the original speaker’s intent and conversational flow.
- Be written as one cohesive sentence or closely linked clause (use semicolons or conjunctions if needed).
- Avoid robotic phrasing, dictionary-style definitions, or meta-commentary like “This means…” or “The user is referring to…”.

Output ONLY the reconstructed sentence. No labels, no extra text.

Fragment: "{fragment}"
Reconstructed:
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.lower().startswith("reconstructed:"):
        text = text[len("reconstructed:"):].strip()
    return text

# ----------------------------
# 2. TERM EXTRACTION
# ----------------------------
def extract_terms(reconstructed: str, fragment: str) -> list:
    terms = set()

    # A. Extract acronyms/slang from ORIGINAL fragment (more reliable for patterns like g2g, smh)
    acronym_candidates = re.findall(r'\b(?:[a-z]\d[a-z]|[a-z]{2,4})\b', fragment.lower())
    common_slang = {
        "smh", "lol", "brb", "g2g", "ttyl", "afk", "imo", "tbh",
        "wtf", "omg", "ily", "nvm", "idk", "rofl", "lmao"
    }
    for ac in acronym_candidates:
        if ac in common_slang:
            terms.add(ac)

    # B. Use Gemini to extract named cultural references from RECONSTRUCTED text
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"""
You are an expert in digital anthropology and early internet history (2000s–2010s).
From the following reconstructed sentence, extract every distinct term that refers to:
- Specific platform features (e.g., Top 8, Friendster profile),
- Named services or tools (e.g., AIM, IRC, MySpace),
- Cultural phenomena tied to online behavior.

Return each term as a short phrase on its own line.
Preserve original capitalization and spacing (e.g., "Top 8", not "top8").
Do NOT include generic words like "drama", "people", "chill", or common verbs.
Output ONLY the terms, one per line. No numbers, bullets, quotes, or extra text.

Reconstructed: "{reconstructed}"
Terms:
"""
    try:
        response = model.generate_content(prompt)
        for line in response.text.strip().splitlines():
            term = line.strip()
            if term and len(term) <= 30 and any(c.isalpha() for c in term):
                # Allow spaces and digits (e.g., "Top 8")
                if all(c.isalnum() or c.isspace() for c in term):
                    terms.add(term)
    except Exception as e:
        print(f"⚠️ Gemini term extraction failed: {e}", file=sys.stderr)

    return list(terms) if terms else [reconstructed[:50]]

# ----------------------------
# 3. WEB SEARCH
# ----------------------------
def search_term(term: str) -> dict:
    # Prioritize definition sources for slang, cultural sources for named features
    if re.fullmatch(r'[a-z0-9]{2,4}', term.lower()):
        sites = "site:dictionary.com OR site:urbandictionary.com OR site:knowyourmeme.com"
        query = f'"{term}" internet slang meaning'
    else:
        sites = "site:en.wikipedia.org OR site:britannica.com OR site:knowyourmeme.com"
        query = f'"{term}" internet culture history 2000s'

    full_query = f"{query} {sites}"
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {"q": full_query, "num": 3}

    try:
        response = requests.post(
            "https://google.serper.dev/search",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        results = response.json().get("organic", [])
        return results[0] if results else None
    except Exception as e:
        print(f"⚠️ Search failed for '{term}': {e}", file=sys.stderr)
        return None

# ----------------------------
# 4. SNIPPET GENERATION
# ----------------------------
def make_snippet(title: str, snippet: str) -> str:
    text = (title + " " + snippet).replace("\n", " ").strip()
    words = [w.strip(".,;:!?\"'()[]") for w in text.split() if w]
    selected = words[:8]
    desc = " ".join(selected)
    if len(selected) > 5:
        desc = " ".join(selected[:5]) + "..."
    return desc if desc else "Contextual reference"

# ----------------------------
# 5. MAIN
# ----------------------------
def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py \"your fragmented text here\"")
        sys.exit(1)

    fragment = sys.argv[1]
    print("Reconstructing...")
    reconstructed = reconstruct(fragment)
    terms = extract_terms(reconstructed, fragment)

    print("\n--- RECONSTRUCTION REPORT ---")
    print(f"[Original Fragment]\n> \"{fragment}\"\n")
    print(f"[AI-Reconstructed Text]\n> \"{reconstructed}\"")
    print("\n[Contextual Sources]")

    seen_links = set()
    sources = []

    for term in terms:
        result = search_term(term)
        if result:
            link = result["link"].strip()
            if link not in seen_links:
                seen_links.add(link)
                title = result.get("title", "")
                snippet_text = result.get("snippet", "")
                brief = make_snippet(title, snippet_text)
                sources.append((link, brief))
        if len(sources) >= 5:
            break

    if not sources:
        print("* No relevant sources found.")
    else:
        for link, desc in sources:
            print(f"* {link} ({desc})")

if __name__ == "__main__":
    main()