"""Create Google Docs from templates and export as PDF via service account."""
import argparse, json, os, re
from dotenv import load_dotenv

load_dotenv()

SA_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "./credentials.json")

def _creds():
    from google.oauth2.service_account import Credentials
    return Credentials.from_service_account_file(
        SA_JSON, scopes=[
            "https://www.googleapis.com/auth/documents",
            "https://www.googleapis.com/auth/drive",
        ])

def _docs():
    from googleapiclient.discovery import build
    return build("docs", "v1", credentials=_creds())

def _drive():
    from googleapiclient.discovery import build
    return build("drive", "v3", credentials=_creds())

def create_from_template(template_id: str, replacements: dict, new_title: str) -> dict:
    """Copy a template doc and replace {{placeholder}} markers."""
    copied = _drive().files().copy(
        fileId=template_id, body={"name": new_title}).execute()
    doc_id = copied["id"]

    requests_body = []
    for placeholder, value in replacements.items():
        requests_body.append({
            "replaceAllText": {
                "containsText": {"text": f"{{{{{placeholder}}}}}", "matchCase": True},
                "replaceText": str(value),
            }
        })
    if requests_body:
        _docs().documents().batchUpdate(
            documentId=doc_id, body={"requests": requests_body}).execute()

    return {"doc_id": doc_id, "title": new_title,
            "url": f"https://docs.google.com/document/d/{doc_id}/edit"}

def create_doc(title: str, content: str) -> dict:
    """Create a new blank doc and insert text."""
    doc = _docs().documents().create(body={"title": title}).execute()
    doc_id = doc["documentId"]
    _docs().documents().batchUpdate(documentId=doc_id, body={"requests": [
        {"insertText": {"location": {"index": 1}, "text": content}}
    ]}).execute()
    return {"doc_id": doc_id, "title": title,
            "url": f"https://docs.google.com/document/d/{doc_id}/edit"}

def export_pdf(doc_id: str, output_path: str) -> str:
    """Download a Google Doc as PDF to local file."""
    from googleapiclient.http import MediaIoBaseDownload
    import io
    request = _drive().files().export_media(fileId=doc_id, mimeType="application/pdf")
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    with open(output_path, "wb") as f:
        f.write(fh.getvalue())
    return output_path

def share_doc(doc_id: str, email: str = None, anyone_can_view: bool = False) -> dict:
    if anyone_can_view:
        perm = _drive().permissions().create(
            fileId=doc_id,
            body={"role": "reader", "type": "anyone"}).execute()
    elif email:
        perm = _drive().permissions().create(
            fileId=doc_id,
            body={"role": "reader", "type": "user", "emailAddress": email},
            sendNotificationEmail=True).execute()
    return {"shared": True, "doc_id": doc_id}

def test_connection() -> dict:
    try:
        _creds()
        return {"ok": True, "sa_json": SA_JSON}
    except Exception as e:
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Docs + PDF tool")
    parser.add_argument("action", choices=["test","create","from-template","export-pdf","share"])
    parser.add_argument("--title", help="Document title")
    parser.add_argument("--content", help="Text content")
    parser.add_argument("--template-id", help="Template Google Doc ID")
    parser.add_argument("--replacements", help="JSON dict of placeholder replacements")
    parser.add_argument("--doc-id", help="Google Doc ID")
    parser.add_argument("--out", help="Output path for PDF")
    parser.add_argument("--email", help="Email to share with")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "create":
        print(json.dumps(create_doc(args.title, args.content), indent=2))
    elif args.action == "from-template":
        replacements = json.loads(args.replacements or "{}")
        print(json.dumps(create_from_template(args.template_id, replacements, args.title), indent=2))
    elif args.action == "export-pdf":
        path = export_pdf(args.doc_id, args.out or "output.pdf")
        print(json.dumps({"pdf": path}, indent=2))
    elif args.action == "share":
        print(json.dumps(share_doc(args.doc_id, args.email), indent=2))
