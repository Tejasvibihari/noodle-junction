# Noodle Junction — Sitemap & Screen Inventory

Related: [Theme](10-THEME-DESIGN-SYSTEM.md) · [Modules](06-MODULES.md)

Module tags (M#) show when each screen is built.

---

## 1. Customer web (`order.noodlejunction.in`)

### 1.1 Dine-in (QR, no login)
| Route | Screen | Module |
|---|---|---|
| `/t/[qrToken]` | Landing: welcome, branch + table, "View menu"; starts/joins session | M6/M10 |
| `/menu` | Menu: search, veg filter, category chips, item list | M10 |
| Item sheet (modal) | Variants, add-ons, notes, qty | M10 |
| Cart sheet | Items, notes, coupon field, totals, "Place order", payment preference | M10/M13 |
| `/order` | **Running order**: rounds, item status chips, lock icons, "Add more items", "Request bill", "Pay" | M10 |
| `/pay` | Payment method: Razorpay / Pay at counter; result screens | M11 |
| `/session-ended` | Thank you / scan again | M6 |
| `/closed` | Branch closed / paused | M5 |
| Error states | Invalid/rotated QR, offline, item unavailable | M10 |

### 1.2 Online (takeaway/delivery)
| Route | Screen | Module |
|---|---|---|
| `/` | Home: choose Delivery / Takeaway / Dine-in info; location prompt | M14/15 |
| `/login` | Phone → OTP → name | M14 |
| `/branches` | Nearest branches (takeaway) | M14 |
| `/delivery/address` | Map pin + address form + saved addresses; deliverable check | M15 |
| `/online/menu` | Menu of assigned/selected branch | M14 |
| `/checkout` | Items, coupon, fees, payment (Online/COD), instructions | M14/15 |
| `/orders` | Order history | M14 |
| `/orders/[id]` | Live tracking stepper, invoice, cancel, reorder | M14/15 |
| `/account` | Profile, addresses | M14 |

### 1.3 Reservations
| Route | Screen | Module |
|---|---|---|
| `/book` | Pick branch, date, party size → slots | M17 |
| `/book/confirm` | Details + OTP | M17 |
| `/book/[code]` | Booking status, cancel | M17 |

---

## 2. Dashboard (`admin.noodlejunction.in`)

### 2.1 Common
Login · Forgot/Reset password · Profile · Change password · 403/404.

### 2.2 Admin area `/admin/*`
| Route | Screen | Module |
|---|---|---|
| `/admin` | Overview: today's sales by branch, live branch status | M18 |
| `/admin/restaurant` | Restaurant profile & tax settings | M2 |
| `/admin/branches` | Branch list (status, pause) | M2 |
| `/admin/branches/new`, `/[id]` | Branch form: address+map, timings, services, delivery config | M2/M15 |
| `/admin/staff` | Staff list (filter by branch/role), create/edit | M2 |
| `/admin/menu` | Master menu: categories + items | M3 |
| `/admin/menu/items/[id]` | Item form (variants, add-ons, images) | M3 |
| `/admin/coupons` | Coupon list/form | M13 |
| `/admin/reports/*` | Sales, branch comparison, items, GST, coupons | M18 |
| `/admin/audit-logs` | Audit viewer | M18 |
| `/admin/settings` | Global settings | M2 |

### 2.3 Branch area `/branch/*`
| Route | Screen | Module |
|---|---|---|
| `/branch` | Today's snapshot + shortcuts | M9 |
| `/branch/orders` | **Live Orders** board/list with filters, sound toggle | M9 |
| `/branch/orders/[id]` | Order detail drawer/page: items, KOT rounds, payments, actions | M9 |
| `/branch/search` | Global search by order no / table / phone | M9 |
| `/branch/tables/live` | **Live Tables / Ongoing meals** | M9 |
| `/branch/kitchen` | KDS (dark) | M9 |
| `/branch/pos` | POS: menu grid + order panel | M12 |
| `/branch/invoices` | Invoice list, reprint | M12 |
| `/branch/menu` | Branch menu, availability, custom items | M4 |
| `/branch/tables` | Manage tables/areas, QR download/print/rotate | M5 |
| `/branch/coupons` | Branch coupons (if permitted) | M13 |
| `/branch/delivery` | Delivery orders & rider assignment | M15 |
| `/branch/reservations` | Bookings | M17 |
| `/branch/staff` | Staff of this branch | M2 |
| `/branch/reports` | Sales, items, cancellations, GST, payments | M18 |
| `/branch/settings` | Branch settings, delivery zone, printing, pause | M2/M15 |

Global dashboard UI: connection status dot, sound toggle, unacknowledged-orders counter in tab title, global alert banner.

---

## 3. Android app (branch staff) — M16
| Tab / Screen | Content |
|---|---|
| Login | Email/phone + password, permission onboarding (notifications, battery optimization) |
| Orders | Live list, filters, new-order full-screen alert |
| Order detail | Items, KOT rounds, status buttons, add items, payments, accept/reject |
| Tables | Live tables tiles, open table order |
| Kitchen | Tickets (Kitchen role) |
| Menu | Availability toggles, search |
| Reservations | Today's bookings (Phase 3) |
| More | Profile, sound settings, logout, app version |

---

## 4. Key screen wireframe notes

**Guest running order**
```
Table T-12 · Noodle Junction – Sector 62
─────────────────────────────────────
Round 1                          ● Preparing
  Hakka Noodles (Full) ×2        ₹400   🔒
  Veg Manchurian ×1              ₹220   🔒
Round 2                          ○ Pending
  Butter Roti ×4                 ₹120   [Remove]
─────────────────────────────────────
Subtotal 740 · GST 37 · Total ₹777
Paid ₹0 · Balance ₹777
[ Add more items ]  [ Request bill ]
[ Pay now ₹777 ]  or  Pay at counter
```

**Live Tables tile**
```
┌────────────┐
│ T-12  · 4  │  capacity 4
│ Occupied   │
│ ₹1,240     │
│ 38 min     │  3 items pending
└────────────┘
```

**POS**
```
[Search…][Noodles][Momos][Rice][Roti]…      | Order · Table T-12 (open)
┌────┐┌────┐┌────┐┌────┐                   | Hakka Noodles ×2   ₹400
│item││item││item││item│                   | Butter Roti ×4     ₹120
└────┘└────┘└────┘└────┘                   | Coupon [ NOODLE10 ]
                                            | Total ₹…
                                            | [Send KOT] [Bill] [Pay]
```

---

## 5. Notification touchpoints per screen
Live Orders (sound + banner) · Live Tables (bill request flash) · Kitchen (new KOT chime) · Guest order screen (status chips update live) · Customer tracking (stepper).