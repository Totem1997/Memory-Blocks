# Trial Expiration Messaging Update: Greeting Card Gifting Experience

Updates the messaging displayed to users upon completing their 1-session trial gameplay to emphasize the greeting card gifting value proposition and encourage ordering.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Action Controls**: Retain existing buttons (Share Score, Finish Trial, Reset Testing); do not add extra external checkout buttons for now.
> - **Subheader Copy**: Keep the existing greeting/completion subheader on the final trial expired screen unchanged.

- **Confirmed Decision 1**: Update the trial session alert text in `GameOverModal.tsx` to:
  `"What you just played is the exact gameplay your friend or loved one will experience, Order the card now and instantly unlock a fully personalized game for friends and loved ones."`
- **Confirmed Decision 2**: Update the highlight card in `TrialExpiredScreen.tsx`:
  - Heading: `"Want to gift this experience?"`
  - Body copy: `"Give a gift they'll actually play! Imagine their reaction when it's made from their favorite photos!  Order the greeting card so they can pick their own favorite memory and play."`

---

## 1. Overview & Core Concept

- **What It Does**: Refines the trial conclusion experience when players access the game with `?trial=true` and finish their single allowed session. The updated copy connects their trial gameplay directly to the greeting card product they can purchase for their loved ones.
- **Target Audience / Persona**: Prospective customers and gift givers testing the interactive demo via QR code before ordering greeting cards.
- **Key Value**: Clear conversion messaging explaining that the recipient's card unlocks this exact interactive photo-puzzle game.

---

## 2. User Experience & Visual Design

- **Flow Walkthrough**:
  1. **Trial Game Over Modal (`GameOverModal.tsx`)**: When moves run out in trial mode, the score modal displays the final score alongside an amber callout box featuring the new copy connecting this gameplay to what their recipient will experience.
  2. **Trial Summary Screen (`TrialExpiredScreen.tsx`)**: Tapping "Finish Trial" navigates to the persistent trial summary screen, showing their score, sharing option, and the refined green callout titled *"Want to gift this experience?"* with the updated greeting card gifting pitch.
- **Visual Identity & Theme**:
  - Maintains existing design harmony with rounded cards (`rounded-2xl`, `rounded-3xl`), Apple-clean styling, and high-contrast typography.
  - Callout boxes remain clean and accessible with soft tint backgrounds (amber for session status, soft green for gifting inspiration) and semantic icons (`Sparkles`).
  - Text balance and line spacing configured for optimal mobile readability without awkward word breaks.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Text-only messaging vs. adding an order link**
  - *Chosen Approach*: Update the text copy inside existing callout containers without injecting new buttons or unconfigured external hyperlinks.
  - *Why*: Aligns with the user's explicit preference while keeping the flow simple and ready for future link configuration when store URLs are established.
- **Decision 2: Seamless integration within existing component structure**
  - *Chosen Approach*: Modify the exact string literals in `src/components/GameOverModal.tsx` and `src/components/TrialExpiredScreen.tsx`.
  - *Why*: Zero architectural risk, zero impact on the rest of the game logic, and instant compilation across all platforms (web, iOS, Android).

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                     Trial Mode Flow                         │
│                                                             │
│  User scans QR (?trial=true)                                │
│       │                                                     │
│       ▼                                                     │
│  Plays 1 Full Game                                          │
│       │                                                     │
│       ▼                                                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ GameOverModal (Trial Mode)                            │  │
│  │ - Shows Final Score                                   │  │
│  │ - Amber box: "What you just played is the exact..."   │  │
│  │ - Share Score / Finish Trial                          │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ TrialExpiredScreen                                    │  │
│  │ - 1-Session Trial Completed                           │  │
│  │ - Final Score Showcase                                │  │
│  │ - Green box: "Want to gift this experience?"          │  │
│  │   "Give a gift they'll actually play!..."             │  │
│  │ - Share Score / Reset Trial (Testing)                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component State Mapping:
- **`GameOverModal.tsx`**: Updates line 153 to display the exact gift-experience copy.
- **`TrialExpiredScreen.tsx`**: Updates lines 122–124 with the new heading and body copy.
