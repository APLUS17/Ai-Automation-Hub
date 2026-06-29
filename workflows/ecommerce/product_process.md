# E-Commerce — Product Process Automation

## What It Does
Low-stock webhook drafts a supplier reorder email. Inventory syncs bidirectionally between Shopify and Google Sheet. A Claude Code tool lets the team search the internal product catalog instantly.

## Integrations Required
- `SHOPIFY_API_KEY`, `SHOPIFY_STORE_URL` — inventory source
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Sheets sync
- Gmail OAuth2 — supplier reorder emails

## n8n Workflow Nodes

### Flow 1: Low Stock → Reorder Email

1. **Schedule Trigger** — Every day 7am (check inventory levels)

2. **HTTP Request: Shopify Inventory** — GET `/admin/api/2024-01/inventory_levels.json`
   - Filter: quantity < reorder_threshold (configurable per product)

3. **IF: Low Stock Items?** (`n8n-nodes-base.if`)
   - True: proceed. False: stop.

4. **Gmail: Draft Supplier Reorder** (`n8n-nodes-base.gmail`)
   - Creates a DRAFT (not sent) — lets human review before sending
   - Subject: "Reorder Request — {{product_list}}"
   - Body: table of SKUs, current qty, suggested reorder qty

### Flow 2: Shopify ↔ Google Sheet Sync

5. **Schedule Trigger** — Every 4 hours

6. **HTTP Request: Shopify Products** — GET all products + variants + inventory

7. **Google Sheets: Write Inventory** (`n8n-nodes-base.googleSheets`)
   - Overwrite "Inventory" sheet: [SKU, Product Name, Variant, Qty, Price, Status]

8. **Google Sheets Trigger** (separate flow) — watch for manual qty edits in sheet

9. **HTTP Request: Shopify Update Inventory** — PATCH inventory level when sheet changes

## Claude Code App
Build `workflows/ecommerce/product_catalog.html`:
- Search box: type product name or SKU
- Results table: title, SKU, qty, price, status (In Stock / Low / Out)
- Data source: n8n GET webhook reads Shopify live
- Click product → open Shopify admin URL in new tab
- No authentication needed (internal tool)

## Python Tools Needed
- `google_sheets.py` — manual sync or backfill

## Test Plan
1. Set one Shopify test product to qty = 2 (below threshold)
2. Trigger daily check — verify Gmail draft created
3. Trigger sync — verify Google Sheet populated with all products
4. Edit qty in Google Sheet — verify Shopify inventory updated via API
5. Open product_catalog.html — search for a product — verify instant results
