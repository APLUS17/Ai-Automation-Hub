"""n8n REST API wrapper — list, create, update, activate workflows."""
import argparse, json, os, sys
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("N8N_API_URL", "http://35.238.129.106:5678")
API_KEY  = os.getenv("N8N_API_KEY", "")

def _headers():
    return {"X-N8N-API-KEY": API_KEY, "Content-Type": "application/json"}

def list_workflows():
    r = requests.get(f"{BASE_URL}/api/v1/workflows", headers=_headers())
    r.raise_for_status()
    return r.json()

def get_workflow(workflow_id: str):
    r = requests.get(f"{BASE_URL}/api/v1/workflows/{workflow_id}", headers=_headers())
    r.raise_for_status()
    return r.json()

def create_workflow(workflow_json: dict):
    r = requests.post(f"{BASE_URL}/api/v1/workflows", headers=_headers(), json=workflow_json)
    r.raise_for_status()
    return r.json()

def update_workflow(workflow_id: str, workflow_json: dict):
    r = requests.put(f"{BASE_URL}/api/v1/workflows/{workflow_id}", headers=_headers(), json=workflow_json)
    r.raise_for_status()
    return r.json()

def activate_workflow(workflow_id: str):
    r = requests.patch(f"{BASE_URL}/api/v1/workflows/{workflow_id}/activate", headers=_headers())
    r.raise_for_status()
    return r.json()

def deactivate_workflow(workflow_id: str):
    r = requests.patch(f"{BASE_URL}/api/v1/workflows/{workflow_id}/deactivate", headers=_headers())
    r.raise_for_status()
    return r.json()

def delete_workflow(workflow_id: str):
    r = requests.delete(f"{BASE_URL}/api/v1/workflows/{workflow_id}", headers=_headers())
    r.raise_for_status()
    return {"deleted": workflow_id}

def test_connection():
    r = requests.get(f"{BASE_URL}/api/v1/workflows?limit=1", headers=_headers())
    return {"ok": r.status_code == 200, "status": r.status_code, "url": BASE_URL}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="n8n REST API wrapper")
    parser.add_argument("action", choices=["list","get","create","update","activate","deactivate","delete","test"])
    parser.add_argument("--id", help="Workflow ID")
    parser.add_argument("--file", help="Path to workflow JSON file")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "list":
        print(json.dumps(list_workflows(), indent=2))
    elif args.action == "get":
        print(json.dumps(get_workflow(args.id), indent=2))
    elif args.action == "activate":
        print(json.dumps(activate_workflow(args.id), indent=2))
    elif args.action == "deactivate":
        print(json.dumps(deactivate_workflow(args.id), indent=2))
    elif args.action == "delete":
        print(json.dumps(delete_workflow(args.id), indent=2))
    elif args.action in ("create", "update"):
        if not args.file:
            sys.exit("--file required for create/update")
        with open(args.file) as f:
            wf = json.load(f)
        if args.action == "create":
            print(json.dumps(create_workflow(wf), indent=2))
        else:
            print(json.dumps(update_workflow(args.id, wf), indent=2))
