# MIRRAI Website

Custom Next.js website for MIRRAI.

## Environment

Use public site variables only for public URLs:

```bash
NEXT_PUBLIC_SITE_ENV=production
NEXT_PUBLIC_SITE_URL=https://homeco-eg.com
```

For local/ngrok testing:

```bash
NEXT_PUBLIC_SITE_ENV=local
NEXT_PUBLIC_SITE_URL=https://your-current-ngrok-url.ngrok-free.app
```

Private keys must stay in server-only variables without the `NEXT_PUBLIC_` prefix, including Shopify Admin tokens, Shopify secrets, Resend keys, Airtable keys, and webhook secrets.

## Shopify URLs

The Shopify OAuth callback and any generated public callback URLs use `NEXT_PUBLIC_SITE_URL`.

Production callback:

```text
https://homeco-eg.com/api/shopify/callback
```

Local/ngrok callback:

```text
${NEXT_PUBLIC_SITE_URL}/api/shopify/callback
```

Shopify webhook endpoints, when configured in Shopify, should use the same public site base:

```text
${NEXT_PUBLIC_SITE_URL}/api/webhooks/shopify/draft-orders-create
${NEXT_PUBLIC_SITE_URL}/api/webhooks/shopify/orders-paid
${NEXT_PUBLIC_SITE_URL}/api/webhooks/shopify/orders-cancelled
${NEXT_PUBLIC_SITE_URL}/api/webhooks/shopify/refunds-create
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```
