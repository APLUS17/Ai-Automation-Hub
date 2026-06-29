"""Run Apify actors and retrieve results. Common actors: google-maps-scraper, zillow-scraper, tripadvisor-scraper."""
import argparse, json, os, time
import requests
from dotenv import load_dotenv

load_dotenv()

API_TOKEN = os.getenv("APIFY_API_TOKEN", "")
BASE = "https://api.apify.com/v2"

COMMON_ACTORS = {
    "google-maps":    "nwua9Gu5YkAVxpyIB",  # Google Maps Scraper
    "zillow":         "BetrV6SJsXcdzGGZf",  # Zillow Scraper
    "tripadvisor":    "maxcopell~tripadvisor-reviews",
    "booking":        "voyager~booking-scraper",
    "instagram":      "apify~instagram-scraper",
    "google-reviews": "compass~google-maps-reviews-scraper",
}

def run_actor(actor_id: str, run_input: dict, timeout_secs: int = 300) -> list:
    """Start an actor run, wait for it to finish, return items."""
    url = f"{BASE}/acts/{actor_id}/runs?token={API_TOKEN}"
    r = requests.post(url, json=run_input)
    r.raise_for_status()
    run_id = r.json()["data"]["id"]
    dataset_id = r.json()["data"]["defaultDatasetId"]

    deadline = time.time() + timeout_secs
    while time.time() < deadline:
        status_r = requests.get(f"{BASE}/actor-runs/{run_id}?token={API_TOKEN}")
        status = status_r.json()["data"]["status"]
        if status == "SUCCEEDED":
            break
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            raise RuntimeError(f"Actor run {run_id} ended with status: {status}")
        time.sleep(5)
    else:
        raise TimeoutError(f"Actor run {run_id} did not complete within {timeout_secs}s")

    items_r = requests.get(f"{BASE}/datasets/{dataset_id}/items?token={API_TOKEN}&format=json")
    items_r.raise_for_status()
    return items_r.json()

def scrape_google_maps(query: str, max_results: int = 50, zip_codes: list = None) -> list:
    locations = zip_codes if zip_codes else [query]
    run_input = {
        "searchStringsArray": [query] * len(locations),
        "locationQuery": locations[0] if locations else "",
        "maxCrawledPlacesPerSearch": max_results,
        "language": "en",
        "outputNameSuffix": "",
    }
    return run_actor(COMMON_ACTORS["google-maps"], run_input)

def scrape_zillow(location: str, max_results: int = 50) -> list:
    run_input = {"searchUrls": [f"https://www.zillow.com/homes/{location.replace(' ', '-')}"],
                 "maxItems": max_results}
    return run_actor(COMMON_ACTORS["zillow"], run_input)

def test_connection() -> dict:
    r = requests.get(f"{BASE}/user?token={API_TOKEN}")
    return {"ok": r.status_code == 200, "plan": r.json().get("data", {}).get("plan", {}).get("name")}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Apify actor runner")
    parser.add_argument("action", choices=["test","google-maps","zillow","run"])
    parser.add_argument("--query", help="Search query / location")
    parser.add_argument("--max", type=int, default=50)
    parser.add_argument("--actor", help="Actor ID for 'run' action")
    parser.add_argument("--input", help="JSON string input for 'run' action")
    parser.add_argument("--out", help="Output file path (default: stdout)")
    args = parser.parse_args()

    result = None
    if args.action == "test":
        result = test_connection()
    elif args.action == "google-maps":
        result = scrape_google_maps(args.query, args.max)
    elif args.action == "zillow":
        result = scrape_zillow(args.query, args.max)
    elif args.action == "run":
        result = run_actor(args.actor, json.loads(args.input or "{}"))

    output = json.dumps(result, indent=2)
    if args.out:
        with open(args.out, "w") as f:
            f.write(output)
        print(f"Saved {len(result)} items to {args.out}")
    else:
        print(output)
