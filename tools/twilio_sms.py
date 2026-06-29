"""Send SMS and check message status via Twilio."""
import argparse, json, os
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_SID  = os.getenv("TWILIO_ACCOUNT_SID", "")
AUTH_TOKEN   = os.getenv("TWILIO_AUTH_TOKEN", "")
FROM_NUMBER  = os.getenv("TWILIO_FROM_NUMBER", "")

def _client():
    from twilio.rest import Client
    return Client(ACCOUNT_SID, AUTH_TOKEN)

def send_sms(to: str, body: str, from_number: str = None) -> dict:
    msg = _client().messages.create(body=body, from_=from_number or FROM_NUMBER, to=to)
    return {"sid": msg.sid, "status": msg.status, "to": msg.to}

def get_message_status(sid: str) -> dict:
    msg = _client().messages(sid).fetch()
    return {"sid": msg.sid, "status": msg.status, "error_code": msg.error_code}

def send_bulk(recipients: list, body: str) -> list:
    """recipients: list of phone number strings."""
    return [send_sms(r, body) for r in recipients]

def test_connection() -> dict:
    try:
        account = _client().api.accounts(ACCOUNT_SID).fetch()
        return {"ok": True, "account": account.friendly_name, "status": account.status}
    except Exception as e:
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Twilio SMS tool")
    parser.add_argument("action", choices=["test","send","status","bulk"])
    parser.add_argument("--to", help="Recipient phone number(s), comma-separated")
    parser.add_argument("--body", help="SMS message body")
    parser.add_argument("--sid", help="Message SID for status check")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "send":
        print(json.dumps(send_sms(args.to, args.body), indent=2))
    elif args.action == "status":
        print(json.dumps(get_message_status(args.sid), indent=2))
    elif args.action == "bulk":
        numbers = [n.strip() for n in args.to.split(",")]
        print(json.dumps(send_bulk(numbers, args.body), indent=2))
