# Implementation Plan - 1-Session Trial Run Mode (?trial=true)

Enable a tailored demonstration experience for potential buyers scanning a promotional QR code. Visitors entering via `?trial=true` experience the full genuine gameplay loop (selecting/cropping their own photo and playing a real session), but are limited to exactly 1 game session, followed by a clear "Trial Expired" notification that locks further play.

---

## 1. URL & Trial Mode Detection
- **Param parsing**: Update `src/utils/config.ts` to detect `?trial=true` (or `?trial=1`).
- **Persistent trial flag**: Persist `isTrialMode` in session/local storage so navigating across screens or reloading during the session retains trial mode status.
- **Trial Completion Check**:
  - Key: `mb_trial_completed: 'true'` in `localStorage`.
  - If a user opens the app in trial mode and `mb_trial_completed` is already set, immediately present the **Trial Expired** screen instead of starting a new photo/game flow.

---

## 2. Onboarding & Photo Selection Experience
- As requested, trial users follow the **exact same experience** as standard players:
  - Welcome / Gift screen -> Choose Photo -> Crop Photo -> Reassurance -> Loading -> Game Board.
  - This allows buyers to see and feel how their personal memory turns into an interactive board.

---

## 3. Single-Session Gameplay & Lockout
- **During the Game**:
  - The Pause modal in trial mode hides or disables "Restart Game" to prevent resetting mid-game.
  - Changing memory mid-game is disabled during the trial session.
- **Game Over Trigger**:
  - When the board runs out of valid moves (Game Over), immediately mark the trial as completed (`localStorage.setItem('mb_trial_completed', 'true')`).
- **Game Over / Trial Expired View**:
  - Instead of the "CONTINUE PLAYING" button, display a prominent **Trial Expired** card.
  - Message: *"Trial Session Complete — Thank you for trying Memory Blocks! Your 1-session preview has ended."*
  - Score card and "Share Score" button remain active so players can still celebrate and share their trial high score.
  - If the user reloads or revisits the app in trial mode later, they see a dedicated Trial Expired screen displaying their previous final score and the expired notice.

---

## 4. Verification & Testing
1. **Trial URL Test**: Open `?trial=true`, upload and crop a photo, verify game starts normally.
2. **Game Over Check**: Play until no moves are left, confirm the "Trial Expired" message appears and the "Continue Playing" button is gone.
3. **Re-entry Check**: Refresh the page with `?trial=true` to confirm it directly shows the Trial Expired state.
4. **Regular App Safety**: Open standard URL (without `?trial=true`) to verify normal players still enjoy unlimited games and photo changes without any restrictions.
