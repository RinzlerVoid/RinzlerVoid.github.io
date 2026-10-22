# NekroNex Premium: backend blueprint

The site now contains the Premium storefront concept, but checkout is intentionally not connected yet.

## Recommended architecture

User -> Checkout -> Payment provider -> Webhook -> Premium API -> License DB -> NYVEX Dashboard -> Discord-compatible customization

## License record

A future backend can store:

- license_id
- server_id
- purchaser_discord_id
- plan
- status
- starts_at
- expires_at
- provider_customer_id
- provider_subscription_id
- enabled_features

## Plans shown on the site

- Custom: 30 days
- Pro: 90 days
- Elite: 365 days

Final prices and the exact Discord customization fields should only be published after verifying what Discord permits for the application/profile model.

## Important safeguards

1. Never trust the browser for license status. Validate on the backend.
2. Treat payment webhooks as the source of truth for paid state.
3. Make license actions idempotent so repeated webhooks do not create duplicates.
4. Bind a license to a Discord server after checking that the buyer can administer it.
5. Revoke premium access automatically at expiry.
6. Keep all payment secrets server-side and outside Git.

## Current website state

The Premium UI is deliberately marked as coming soon. No fake checkout or fake payment success exists in this build.
