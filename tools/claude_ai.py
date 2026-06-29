"""Claude API wrapper — extraction, generation, vision, and classification tasks."""
import argparse, base64, json, os
import anthropic
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
client  = anthropic.Anthropic(api_key=API_KEY) if API_KEY else None

MODEL = "claude-sonnet-4-6"

def _client():
    if not client:
        raise ValueError("ANTHROPIC_API_KEY not set in .env")
    return client

def extract_fields(text: str, schema: dict) -> dict:
    """Extract structured fields from unstructured text."""
    prompt = f"""Extract the following fields from the text below. Return a JSON object matching this schema:
{json.dumps(schema, indent=2)}

Text:
{text}

Return ONLY valid JSON, no explanation."""
    msg = _client().messages.create(
        model=MODEL, max_tokens=1024,
        messages=[{"role": "user", "content": prompt}])
    return json.loads(msg.content[0].text)

def generate_text(prompt: str, system: str = None, max_tokens: int = 2048) -> str:
    """Generate text given a prompt and optional system message."""
    kwargs = {"model": MODEL, "max_tokens": max_tokens,
               "messages": [{"role": "user", "content": prompt}]}
    if system:
        kwargs["system"] = system
    msg = _client().messages.create(**kwargs)
    return msg.content[0].text

def analyze_image(image_path: str, question: str) -> str:
    """Analyze a local image file and answer a question about it."""
    with open(image_path, "rb") as f:
        img_data = base64.standard_b64encode(f.read()).decode("utf-8")
    ext = os.path.splitext(image_path)[1].lower().strip(".")
    media_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg",
                 "png": "image/png", "gif": "image/gif", "webp": "image/webp"}
    media_type = media_map.get(ext, "image/jpeg")
    msg = _client().messages.create(
        model=MODEL, max_tokens=1024,
        messages=[{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": img_data}},
            {"type": "text", "text": question}
        ]}])
    return msg.content[0].text

def classify(text: str, categories: list) -> str:
    """Classify text into one of the given categories."""
    prompt = f"""Classify the following text into exactly ONE of these categories: {', '.join(categories)}.
Return only the category name, nothing else.

Text: {text}"""
    msg = _client().messages.create(
        model=MODEL, max_tokens=50,
        messages=[{"role": "user", "content": prompt}])
    return msg.content[0].text.strip()

def sentiment(text: str) -> dict:
    """Return sentiment analysis: score, label, key_themes."""
    result = extract_fields(text, {
        "sentiment": "positive | negative | neutral | mixed",
        "score": "number from -1.0 (very negative) to 1.0 (very positive)",
        "key_themes": "array of strings"
    })
    return result

def personalize_message(template: str, contact_data: dict) -> str:
    """Generate a personalized outreach message given a template and contact info."""
    prompt = f"""You are writing a personalized outreach message. Use the contact data below to make it specific and relevant.

Template (use as inspiration, not literally):
{template}

Contact data:
{json.dumps(contact_data, indent=2)}

Write a natural, concise message (2-4 sentences). No subject line."""
    return generate_text(prompt)

def test_connection() -> dict:
    try:
        msg = _client().messages.create(
            model=MODEL, max_tokens=10,
            messages=[{"role": "user", "content": "ping"}])
        return {"ok": True, "model": MODEL, "response": msg.content[0].text}
    except Exception as e:
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Claude AI tool")
    parser.add_argument("action", choices=["test","generate","extract","image","classify","sentiment","personalize"])
    parser.add_argument("--prompt", help="Prompt or text input")
    parser.add_argument("--system", help="System prompt")
    parser.add_argument("--schema", help="JSON schema for extraction")
    parser.add_argument("--image", help="Path to image file")
    parser.add_argument("--categories", help="Comma-separated categories for classify")
    parser.add_argument("--template", help="Message template")
    parser.add_argument("--contact", help="JSON string of contact data")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "generate":
        print(generate_text(args.prompt, args.system))
    elif args.action == "extract":
        print(json.dumps(extract_fields(args.prompt, json.loads(args.schema)), indent=2))
    elif args.action == "image":
        print(analyze_image(args.image, args.prompt))
    elif args.action == "classify":
        print(classify(args.prompt, args.categories.split(",")))
    elif args.action == "sentiment":
        print(json.dumps(sentiment(args.prompt), indent=2))
    elif args.action == "personalize":
        print(personalize_message(args.template, json.loads(args.contact)))
