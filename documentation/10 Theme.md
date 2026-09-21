# Noodle Junction — Theme & Design System

Applies to: `customer-web` (Next.js), `dashboard` (Next.js), `branch-app` (React Native).
Tokens live in `packages/design-tokens` and are consumed by Tailwind (web) and a `theme.ts` (React Native) so all three stay identical.

> **Palette note:** the hex values below follow a *red / gold / ink* direction (premium Chinese-restaurant feel). If your restaurant website already has a `globals.css` palette, copy those exact hex values into the `brand` tokens below and keep everything else (semantic + status colors, spacing, components) as is.

---

## 1. Brand principles
1. **Appetizing & premium** — deep red, warm gold, ink black on warm paper backgrounds.
2. **Fast to use** — customer flow is one-handed on a phone; dashboard is glanceable from arm's length.
3. **Status is color + text + icon** — never color alone.
4. **Calm by default, loud for alerts** — new-order alerts are the only high-energy moments.

## 2. Color tokens

### 2.1 Brand
| Token | Hex | Use |
|---|---|---|
| `red-900` | `#6E0B19` | Pressed states, dark headers |
| `red-700` | `#8E0F22` | Hover on primary |
| `red-600` | `#B3122A` | **Primary** buttons, links, active nav |
| `red-500` | `#D21F3C` | Highlights, badges |
| `red-100` | `#FBE3E7` | Tinted backgrounds |
| `gold-700` | `#8A6216` | Text on gold tint |
| `gold-500` | `#D4A23A` | **Accent** — premium highlights, price emphasis, borders |
| `gold-300` | `#EACB80` | Decorative |
| `gold-100` | `#F8EDCF` | Tinted backgrounds |
| `ink-950` | `#0F0B0A` | Dark backgrounds (KDS) |
| `ink-900` | `#14100E` | Primary text (light mode), dark surfaces |
| `ink-800` | `#1E1815` | Dark card |
| `ink-700` | `#2B231F` | Dark border |
| `ink-500` | `#5C524B` | Secondary text |
| `ink-300` | `#A69C93` | Placeholder/disabled text |
| `ink-200` | `#D9D3CC` | Borders |
| `paper-50` | `#FBF7F1` | **Page background** (warm cream) |
| `paper-100` | `#F4EDE2` | Subtle sections |
| `white` | `#FFFFFF` | Cards |

### 2.2 Semantic
| Token | Hex | Use |
|---|---|---|
| `success` | `#1F8A4C` | Paid, Ready, Served |
| `success-bg` | `#E4F5EB` | |
| `warning` | `#E08A00` | Pending, attention |
| `warning-bg` | `#FFF1D6` | |
| `danger` | `#D92D20` | Errors, cancelled, delete |
| `danger-bg` | `#FDE7E5` | |
| `info` | `#2563EB` | Informational |
| `info-bg` | `#E6EEFF` | |

### 2.3 Order / item status colors
| Status | Color | Icon (lucide) | Label |
|---|---|---|---|
| `PENDING` / `PLACED` | warning `#E08A00` | `clock` | Pending |
| `AWAITING_CONFIRMATION` | gold `#D4A23A` | `shield-question` | Confirm |
| `ACCEPTED` | info `#2563EB` | `check` | Accepted |
| `PREPARING` | red-500 `#D21F3C` | `flame` | Preparing |
| `READY` | success `#1F8A4C` | `bell-ring` | Ready |
| `SERVED` / `DELIVERED` / `PICKED_UP` | ink-500 `#5C524B` | `utensils` | Served |
| `OUT_FOR_DELIVERY` | info | `bike` | On the way |
| `CANCELLED` / `REJECTED` | danger | `x-circle` | Cancelled |
| Payment `PAID` | success | `badge-check` | Paid |
| Payment `PARTIAL` | warning | `circle-dashed` | Partly paid |
| Payment `UNPAID` | danger | `circle-alert` | Unpaid |

### 2.4 Table tile colors (Live Tables)
| State | Background | Border | Extra |
|---|---|---|---|
| `VACANT` | white | ink-200 | — |
| `OCCUPIED` | success-bg | success | Shows elapsed timer |
| `BILL_REQUESTED` | gold-100 | gold-500 | Pulsing border |
| `RESERVED` | info-bg | info | Shows time |
| `DISABLED` | ink-200 | ink-300 | Hatch pattern |
| Idle > threshold | danger-bg | danger | "Idle 45m" chip |

### 2.5 KDS ticket age colors (thresholds configurable per branch)
`< 10 min` success · `10–20 min` warning · `> 20 min` danger (pulse).

### 2.6 Food type marker (FSSAI-style)
Square outline with center dot: **Veg** = green `#0F8A3D`, **Non-veg** = brown/red `#A4262C`, **Egg** = amber `#C77700`. Always shown on menu items.

## 3. Typography
| Role | Font | Fallback | Where |
|---|---|---|---|
| Display / headings (customer) | **Playfair Display** (or Cormorant Garamond) | `Georgia, serif` | Hero, menu section titles |
| UI / body | **Inter** | `system-ui, sans-serif` | Everything else |
| Numeric (prices, timers) | Inter with `font-variant-numeric: tabular-nums` | | |
| Print (KOT/invoice thermal) | `"Courier New", monospace` | | 58/80 mm |

| Style | Size / line-height | Weight |
|---|---|---|
| `display` | 36/44 (mobile 28/36) | 700 (Playfair) |
| `h1` | 28/36 | 700 |
| `h2` | 22/30 | 600 |
| `h3` | 18/26 | 600 |
| `body` | 16/24 (customer) · 14/20 (dashboard) | 400 |
| `small` | 13/18 | 400 |
| `caption` | 12/16 | 500 |
| `price` | 16/24 tabular | 600 |

Customer minimum body size: 16 px (prevents iOS zoom on inputs).

## 4. Spacing, radius, shadow, motion
- **Spacing scale** (4 px base): `1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64`
- **Radius**: `sm 6 · md 10 · lg 14 · xl 20 · full 999`. Cards `lg`, buttons `md`, chips `full`, bottom sheets `xl` top corners.
- **Shadow**: `sm: 0 1px 2px rgba(20,16,14,.06)` · `md: 0 4px 12px rgba(20,16,14,.08)` · `lg: 0 12px 32px rgba(20,16,14,.14)`
- **Motion**: 150 ms (micro) / 250 ms (sheets) ease-out; respect `prefers-reduced-motion`. New-order pulse: 1.2 s, 3 cycles then steady highlight.
- **Z-index**: content 0 · sticky 10 · drawer 30 · modal 40 · toast 50.

## 5. Layout & breakpoints
| Surface | Design target | Breakpoints |
|---|---|---|
| Customer web | Mobile-first (360–430 px), max content width 640 px on larger screens | `sm 480 · md 768 · lg 1024` |
| Dashboard | Desktop 1280+; tablet landscape 1024 supported (cashier/kitchen) | `md 768 · lg 1024 · xl 1280 · 2xl 1536` |
| Android app | Phone portrait; tablet-friendly lists | — |

Touch targets ≥ 44×44 px (customer & POS). Dashboard density: comfortable/compact toggle (P2).

## 6. Tailwind preset (`packages/design-tokens/tailwind-preset.ts`)

```ts
import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FBE3E7', 500: '#D21F3C', 600: '#B3122A', 700: '#8E0F22', 900: '#6E0B19',
        },
        gold: { 100: '#F8EDCF', 300: '#EACB80', 500: '#D4A23A', 700: '#8A6216' },
        ink:  { 200: '#D9D3CC', 300: '#A69C93', 500: '#5C524B', 700: '#2B231F', 800: '#1E1815', 900: '#14100E', 950: '#0F0B0A' },
        paper: { 50: '#FBF7F1', 100: '#F4EDE2' },
        success: { DEFAULT: '#1F8A4C', bg: '#E4F5EB' },
        warning: { DEFAULT: '#E08A00', bg: '#FFF1D6' },
        danger:  { DEFAULT: '#D92D20', bg: '#FDE7E5' },
        info:    { DEFAULT: '#2563EB', bg: '#E6EEFF' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm: '6px', md: '10px', lg: '14px', xl: '20px' },
      boxShadow: {
        sm: '0 1px 2px rgba(20,16,14,.06)',
        md: '0 4px 12px rgba(20,16,14,.08)',
        lg: '0 12px 32px rgba(20,16,14,.14)',
      },
    },
  },
} satisfies Partial<Config>;
```

## 7. CSS variables (`globals.css`)

```css
:root {
  --bg: #FBF7F1;
  --surface: #FFFFFF;
  --text: #14100E;
  --text-muted: #5C524B;
  --border: #D9D3CC;
  --primary: #B3122A;
  --primary-hover: #8E0F22;
  --accent: #D4A23A;
  --success: #1F8A4C; --warning: #E08A00; --danger: #D92D20; --info: #2563EB;
  --radius-md: 10px; --radius-lg: 14px;
}
[data-theme='dark'] {           /* used by Kitchen (KDS) and optional dashboard dark mode */
  --bg: #0F0B0A;
  --surface: #1E1815;
  --text: #F4EDE2;
  --text-muted: #A69C93;
  --border: #2B231F;
  --primary: #D21F3C;
  --primary-hover: #E8425C;
  --accent: #EACB80;
}
```

## 8. Components

### 8.1 Buttons
| Variant | Style | Use |
|---|---|---|
| Primary | `bg-brand-600 text-white`, hover `brand-700` | Place order, Save, Bill |
| Accent | `bg-gold-500 text-ink-900` | Pay now, Upgrade actions |
| Secondary | white, `border-ink-200`, text ink-900 | Cancel, Back |
| Ghost | transparent, text brand-600 | Tertiary |
| Danger | `bg-danger text-white` | Cancel order/delete |
Sizes: `sm 32 · md 40 · lg 48 (customer CTA, sticky bottom, full width)`. States: hover, focus ring `2px gold-500`, disabled 50 %, loading spinner (keeps width).

### 8.2 Inputs
Height 44 (customer) / 36 (dashboard). Border ink-200, focus ring brand-600 1px + gold glow. Labels above; helper/error text below in danger. Phone input with +91 prefix. Quantity stepper `– 1 +` with 44 px targets.

### 8.3 Cards & lists
- **Menu item card (customer)**: image left (88 px, `md` radius), name, veg marker, short description (2 lines), price (gold-700 or ink-900), **Add** button (outlined red; turns into stepper after add). Out of stock → greyscale + "Unavailable" chip.
- **Order card (dashboard)**: header (order no, type chip, table/branch), items list, footer (total, payment badge, action buttons). Left border color = status.
- **KOT ticket (KDS)**: dark card, big table number, item list with qty in large type, timer badge, action button (Start / Ready).
- **Table tile**: see §2.4; shows table no., capacity, running total, elapsed time.

### 8.4 Navigation
- **Customer**: sticky top bar (logo, table chip "Table T-12", cart icon) + bottom sticky cart bar (`2 items · ₹546  View cart →`) + bottom sheet for cart/item detail. Category chips horizontally scrollable, sticky under header.
- **Dashboard**: left sidebar (collapsible; icons + labels), top bar (branch name, connection dot, sound toggle, notifications bell, profile). Branch pages use `Live Orders · Live Tables · Kitchen · POS · Menu · Tables · Reports`.
- **App**: bottom tabs (Orders · Tables · Kitchen · Menu · More).

### 8.5 Feedback
Toasts (top-right dashboard / bottom mobile), inline alerts, skeleton loaders (never blank spinners on menu), empty states with illustration + CTA, confirmation modals for destructive actions (type reason). Offline/reconnecting banner (warning-bg) at top.

### 8.6 Badges/chips
Pill radius; background = status `*-bg`, text = status color, icon 14 px. Order type chips: Dine-in (ink), Takeaway (gold), Delivery (info).

### 8.7 Tables (data)
Sticky header, zebra off, row hover paper-100, sortable headers, sticky action column, pagination footer, column visibility menu.

### 8.8 Alerts (new order)
Full-width banner slides down: red-600 background, white text, bell icon, order summary, **Open** button; sound loops until acknowledged. In app: full-screen alert style via Notifee.

## 9. Page-level guidelines

### Customer web
- Hero on `/t/[token]`: logo, "Welcome to Noodle Junction", branch + table chip, CTA "View menu".
- Use Playfair for section titles (e.g., "Noodles", "Momos"); gold hairline dividers.
- Photography: 4:3, warm tone, lazy-loaded, blur placeholders. If no image, use a red/gold pattern tile with the item initial.
- Prices: `₹` prefix, no decimals unless needed, tabular numbers; taxes shown at checkout breakdown.
- Cart sheet shows per-item status after ordering (Pending / Preparing / Ready / Served) with lock icon on non-removable items and helper text "Already being prepared".

### Dashboard
- Live Orders: 3–4 column board or list; new orders on the left/top.
- Live Tables: responsive grid of tiles (min 140 px), area tabs.
- Kitchen: dark theme, large type (min 20 px items), one-tap actions.
- POS: split view — menu grid (left, 60 %) / current order (right, 40 %); large tap targets.

## 10. Iconography & imagery
`lucide-react` (web) and `lucide-react-native` (app). 1.75 px stroke. Logo: wordmark "Noodle Junction" (Playfair, red on cream; gold on ink) + optional noodle-bowl glyph; provide SVG light/dark and a square app icon.

## 11. Accessibility
- Contrast ≥ 4.5:1 for text (check `gold-500` on white — use `gold-700` for text on light backgrounds).
- Visible focus rings; full keyboard nav in dashboard/POS.
- Icons + text for statuses; ARIA labels for icon-only buttons; live regions for new-order announcements.
- Respect reduced motion; scalable text; tap target ≥ 44 px.

## 12. Print styles
| Document | Width | Notes |
|---|---|---|
| Invoice A4 | 210 mm | Logo, GSTIN, table of items, tax split, QR for payment (optional) |
| Invoice thermal | 58 / 80 mm (`@page { size: 80mm auto; margin: 2mm }`) | Monospace, 12 px, dashed separators |
| KOT | 58 / 80 mm | Big table no. + KOT no., items with qty (bold), notes, time; no prices |
| QR table sheet | A4, 2 × 3 per page | Table number huge, "Scan to order", logo, branch name, Wi-Fi/help line optional |

## 13. React Native theme (`packages/design-tokens/rn-theme.ts`)
```ts
export const theme = {
  colors: {
    bg: '#FBF7F1', surface: '#FFFFFF', text: '#14100E', muted: '#5C524B', border: '#D9D3CC',
    primary: '#B3122A', primaryDark: '#8E0F22', accent: '#D4A23A',
    success: '#1F8A4C', warning: '#E08A00', danger: '#D92D20', info: '#2563EB',
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  spacing: (n: number) => n * 4,
  font: { display: 'PlayfairDisplay-Bold', regular: 'Inter-Regular', medium: 'Inter-Medium', semibold: 'Inter-SemiBold' },
};
```
Notification sounds and Android channel names: `new_orders` (bell), `table_alerts` (ding), `urgent` (alarm), `payments` (default).

## 14. Content & tone
Friendly, short, food-forward. Examples: "Your order is in the kitchen", "Roti added to your order", "Already being prepared, so we can't remove it", "Scan the code on your table to start". Error messages say what happened + what to do next.

## 15. Design deliverables checklist
- [ ] Logo SVGs + favicon + app icon
- [ ] Figma (or equivalent) library: colors, type, components
- [ ] Customer flow screens (mobile)
- [ ] Dashboard screens (desktop + tablet)
- [ ] App screens
- [ ] Sounds (4) licensed/royalty-free
- [ ] Print templates (invoice, KOT, QR sheet)