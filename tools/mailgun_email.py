"""Send emails and manage templates via Mailgun."""
import argparse, json, os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MAILGUN_API_KEY", "")
DOMAIN  = os.getenv("MAILGUN_DOMAIN", "")
BASE    = f"https://api.mailgun.net/v3/{DOMAIN}"

def _auth():
    return ("api", API_KEY)

def send_email(to: str, subject: str, html: str = None, text: str = None,
               from_addr: str = None, reply_to: str = None) -> dict:
    data = {
        "from": from_addr or f"Automation Hub <noreply@{DOMAIN}>",
        "to": to,
        "subject": subject,
    }
    if html:
        data["html"] = html
    if text:
        data["text"] = text
    if reply_to:
        data["h:Reply-To"] = reply_to
    r = requests.post(f"{BASE}/messages", auth=_auth(), data=data)
    r.raise_for_status()
    return r.json()

def send_batch(recipients: list, subject: str, html: str) -> list:
    return [send_email(r, subject, html=html) for r in recipients]

def create_template(name: str, subject: str, html: str) -> dict:
    r = requests.post(f"{BASE}/templates", auth=_auth(),
                      data={"name": name, "description": subject,
                            "template": html, "engine": "handlebars"})
    r.raise_for_status()
    return r.json()

def list_templates() -> dict:
    r = requests.get(f"{BASE}/templates", auth=_auth())
    r.raise_for_status()
    return r.json()

def test_connection() -> dict:
    r = requests.get(f"https://api.mailgun.net/v3/domains/{DOMAIN}", auth=_auth())
    return {"ok": r.status_code == 200, "domain": DOMAIN, "status": r.status_code}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mailgun email tool")
    parser.add_argument("action", choices=["test","send","batch","templates","create-template"])
    parser.add_argument("--to", help="Recipient email(s), comma-separated")
    parser.add_argument("--subject", help="Email subject")
    parser.add_argument("--html", help="HTML body or path to HTML file")
    parser.add_argument("--name", help="Template name")
    args = parser.parse_args()

    html_body = args.html
    if html_body and os.path.isfile(html_body):
        with open(html_body) as f:
            html_body = f.read()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "send":
        print(json.dumps(send_email(args.to, args.subject, html=html_body), indent=2))
    elif args.action == "batch":
        recipients = [r.strip() for r in args.to.split(",")]
        print(json.dumps(send_batch(recipients, args.subject, html_body), indent=2))
    elif args.action == "templates":
        print(json.dumps(list_templates(), indent=2))
    elif args.action == "create-template":
        print(json.dumps(create_template(args.name, args.subject, html_body), indent=2))
