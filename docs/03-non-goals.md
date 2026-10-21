# [Event]: Non-Goals

**Status:** DRAFT v0.1

Things we are deliberately **not** building. Each one is either handled by Ticketmelon or not worth the cost for v1.

| Not building | Why | Who handles it |
|--------------|-----|----------------|
| Our own checkout / payment processing | PCI scope, payment licences, refunds, fraud. Ticketmelon already does it. | Ticketmelon |
| E-tickets, QR codes, check-in scanning | Core Ticketmelon feature | Ticketmelon |
| Seat maps / reserved seating UI | Festivals are GA; Ticketmelon handles seating if ever needed | Ticketmelon |
| User accounts / login on our site | Fans already have Ticketmelon accounts; login adds friction | Ticketmelon |
| Refund and transfer flows | Policy + money movement live with ticketing provider | Ticketmelon + client |
| Resale / secondary marketplace | Legal + fraud risk | Out of scope |
| Native mobile app | Website is mobile-first; app not justified for 1–2 events/yr | Possible future phase |
| Live-streaming platform | Separate product | Out of scope |
| Merch store (v1) | Can add Shopify Buy Button later as add-on | Future add-on |
| Real-time inventory scraped from Ticketmelon | Fragile, may breach ToS. Only via official API if offered | See [09](09-ticketmelon-integration.md) |
