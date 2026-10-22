# Trial Session Ended: Copy, Justification & Visual Refinements

Refines the trial conclusion experience across the Game Over modal and the Trial Ended screen with updated headers ("Trial Session Ended" / "Trial Ended"), justified text alignment, "greeting card" product phrasing, and the removal of the sparkle icon.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following adjustments reflect your requested changes:
> - **Header Wording**: Changed all trial expiration headings from "Expired" to "Ended" ("TRIAL SESSION ENDED" on the Game Over modal, and "Trial Ended" on the summary screen).
> - **Text Alignment**: Paragraph text inside the modal callout is set to justified alignment (`text-justify`) for clean edge-to-edge alignment while preserving the centered heading (`text-center`).
> - **Product Nomenclature**: Updated "card" to "greeting card" and eliminated redundant phrasing by referencing "them".
> - **Sparkle Icon Removal**: Removed the sparkle/star icon from the gifting callout card on the second page for a clean, minimalist card aesthetic.

- **Confirmed Decision 1**: Modal Amber Callout (`GameOverModal.tsx`):
  - Heading: `"TRIAL SESSION ENDED"` (centered)
  - Paragraph (justified): `"What you just played is the exact gameplay your friend or loved one will experience. Order the greeting card now and instantly unlock a fully personalized game for them."`
- **Confirmed Decision 2**: Trial Ended Screen (`TrialExpiredScreen.tsx`):
  - Screen Header: `"Trial Ended"` (replacing "Trial Expired")
  - Gifting Callout: Remove `<Sparkles />` icon and keep the clean two-line layout.

---

## 1. Overview & Core Concept

- **What It Does**: Polishes the post-trial experience when players finish their one-game demo session (`?trial=true`). It ensures terminology is consistently framed around "Trial Ended" rather than "Expired", makes the modal body typography neatly justified, and streamlines the visual presentation of the greeting card gift pitch.
- **Target Audience / Persona**: Prospective customers and recipients testing the memory game before gifting or purchasing greeting cards.
- **Key Value**: Professional, clean typography and clear conversion copy describing the personalized greeting card experience.

---

## 2. User Experience & Visual Design

- **Flow Walkthrough**:
  1. **Game Over Modal (`GameOverModal.tsx`)**:
     - Modal title: `"TRIAL SESSION ENDED"` centered at the top of the amber notification banner.
     - Description: Justified text body (`text-justify text-xs text-amber-800 leading-relaxed`) stating that ordering the greeting card unlocks a fully personalized game for them.
  2. **Trial Ended Screen (`TrialExpiredScreen.tsx`)**:
     - Main heading updated to `"Trial Ended"` with its completion pill above it.
     - Score card remains front and center for sharing.
     - The green gifting callout displays without the sparkle icon, providing a clean, uncluttered card with heading `"Want to gift this experience?"` and the full greeting card gifting message.
- **Visual Identity & Theme**:
  - Consistent Apple-inspired design with soft rounded corners (`rounded-2xl`, `rounded-3xl`).
  - Justified text with balanced line-height prevents uneven jagged edges while retaining legible kerning.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Text Justification Styling**
  - *Chosen Approach*: Apply Tailwind's `text-justify` alongside relaxed line-height (`leading-relaxed`) to ensure words distribute evenly on mobile viewports without awkward spacing.
  - *Why*: Delivers the clean, aligned edge requested while keeping the uppercase banner heading centered.
- **Decision 2: Sparkle Icon Removal**
  - *Chosen Approach*: Remove the `<Sparkles />` SVG component and its import from `TrialExpiredScreen.tsx`, letting the green card background and bold header carry the visual hierarchy cleanly.
  - *Why*: Directly aligns with user feedback to simplify the layout.

---

## 4. Technical Architecture & Component Changes

```
┌─────────────────────────────────────────────────────────────┐
│                    Trial Flow & Components                  │
│                                                             │
│  User plays 1 Game (?trial=true)                            │
│       │                                                     │
│       ▼                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ GameOverModal (Trial Mode)                            │  │
│  │ ───────────────────────────────────────────────────── │  │
│  │ [TRIAL SESSION ENDED] (Centered)                      │  │
│  │ "What you just played is the exact gameplay...        │  │
│  │  Order the greeting card now and instantly unlock a   │  │
│  │  fully personalized game for them." (Justified)       │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ TrialExpiredScreen                                    │  │
│  │ ───────────────────────────────────────────────────── │  │
│  │ Heading: "Trial Ended"                                │  │
│  │ Clean Gifting Box (No sparkle icon):                  │  │
│  │ "Want to gift this experience?"                       │  │
│  │ "Give a gift they'll actually play!..."               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Updates:
1. **`src/components/GameOverModal.tsx`**:
   - Update heading to `"TRIAL SESSION ENDED"` with `text-center`.
   - Update body paragraph to `text-justify text-xs text-amber-800 leading-relaxed`.
   - Update text: `"What you just played is the exact gameplay your friend or loved one will experience. Order the greeting card now and instantly unlock a fully personalized game for them."`
2. **`src/components/TrialExpiredScreen.tsx`**:
   - Update `<h2>` text from `"Trial Expired"` to `"Trial Ended"`.
   - Remove `<Sparkles />` icon and clean up `lucide-react` import.
   - Ensure spacing of the gifting callout text aligns cleanly to the full card width.
