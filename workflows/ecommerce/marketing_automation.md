# E-Commerce — Marketing Automation

## What It Does
New Shopify products trigger Claude to write a product description and social caption, then auto-post to Instagram/Facebook. Abandoned carts get a 3-step SMS/email drip. Post-delivery review requests auto-send 3 days after fulfillment.

## Integrations Required
- `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_STORE_URL` — product + order triggers
- `ANTHROPIC_API_KEY` — description + caption writing
- Meta Business API credentials (Facebook Page token) — social posting
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — abandoned cart SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — email drips
- Gmail OAuth2 — review request email

## n8n Workflow Nodes

### Flow 1: New Product → Content → Post

1. **Webhook Trigger** — Shopify product.create webhook
   - Fields: product_id, title, vendor, product_type, images[0].src, handle

2. **HTTP Request: Claude Product Description** (OpenRouter)
   - Prompt: "Write a compelling 150-word product description for this item: {{title}} by {{vendor}}. Highlight benefits over features. Then write a 1-sentence Instagram caption with 3 relevant hashtags."
   - Parse: {description, caption, hashtags}

3. **HTTP Request: Shopify Update Description** — PATCH product with Claude-generated description

4. **HTTP Request: Post to Instagram** — Meta Graph API
   - POST `/me/photos` with image URL + caption

### Flow 2: Abandoned Cart Drip

5. **Webhook Trigger** — Shopify checkout.create (no order placed after 1 hour)

6. **Wait 1 Hour** (`n8n-nodes-base.wait`)

7. **HTTP Request: Check if Order Placed** — Shopify order search by email

8. **IF: Order Placed?** — True: stop. False: continue drip.

9. **Mailgun: Email Day 1** — "You left something behind..." + cart items + checkout link

10. **Wait 1 Day** → **Mailgun: Email Day 2** — "Your cart expires soon — 10% off inside"

11. **Wait 1 Day** → **Twilio: SMS Day 3** — "Still thinking? Your cart is saved: {{checkout_url}}"

### Flow 3: Post-Delivery Review Request

12. **Webhook Trigger** — Shopify order.fulfilled

13. **Wait 3 Days** (`n8n-nodes-base.wait`)

14. **Gmail: Review Request** (`n8n-nodes-base.gmail`)
    - "Hi {{first_name}}, how is your {{product_name}} treating you? Would you take 60 seconds to leave a review?"
    - Link: product review URL

## Claude AI Tasks
- Product description + social caption generation (step 2)

## Python Tools Needed
- `claude_ai.py --action generate` — test description quality

## Test Plan
1. Add a test product in Shopify dev store — verify Claude description attached within 1 min
2. Create a test checkout, don't complete — wait 1h → verify abandoned cart email
3. Create a fulfilled test order — wait 3 days (or advance n8n) → verify review request
