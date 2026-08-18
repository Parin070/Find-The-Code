# Find The Code — Office Heist

**Find The Code: Office Heist** is a mobile-first mini exploration game designed for live events, stalls, and pop-up activations. Visitors scan a QR code at your booth, opening the game directly in their mobile browser — no app install, no sign-up required.

## Story & Mission

You are a newly hired intern on your first day at Corporate HQ. An urgent executive memo directs you to retrieve the CEO's secret access code before the deadline!

### Mission Flow

1. **Opening Memo** — Read your mission directive from executive management.
2. **Room 1: Reception**
   - **Player Spawn**: Entry door at the bottom of the reception room.
   - **Sarah (Receptionist NPC)**: Speak with Sarah at the front desk for welcome context and guidance.
   - **6 Detailed Interactable Objects**: Desk Drawer, Leather Binder Bookshelf, Decorative Ficus Plant, Filing Cabinet, Suit Coat Rack, and Corporate Landscape Painting.
   - **Per-Session Randomization**: Each playthrough randomly assigns the **Executive Keycard** to 1 of the 6 objects, and the handwritten **4-Digit Door Access Code** note to a different object.
   - **Rich Non-Interactable Decor**: Leather sofa, navy center rug, wall clock, and inaccessible decorative doors for immersive depth.
   - **Door Exit**: Enter the randomized 4-digit code found in Room 1 to unlock the security door to the Open Office Floor.
3. **Room 2: Open Office Floor**
   - **Alex (Office Worker NPC)**: Speak with Alex to get a visual clue describing the target workstation's identifying item (no desk numbers or coordinates given!).
   - **8 Varied Workstations**: Desks feature distinct chair styles, monitor angles, and clutter. The 7 non-target desks give flavor "Access Denied" responses.
   - **Random Tech Riddle Pool**: Accessing the target computer opens a confidential file displaying 1 of 6 randomized Computer Science / Tech riddles.
4. **Room 3: CEO Private Suite**
   - **Two-Way Backtracking**: Doorways remain unlocked, allowing players to walk back to earlier rooms if they missed an item or clue.
   - **CEO NPC & Vault Locker**: Speak with the CEO or inspect the Executive Vault Locker, enter the answer to the workstation riddle, and unlock the secret discount code!

## Reward Structure

| Finish Time | Reward Level |
|---|---|
| ≤ 1:30 | **Tier 1 Discount Code (Fast Finish)** |
| > 1:30 | **Tier 2 Discount Code (Standard Finish)** |

## Visual Style

- **Stylized Office Pixel Art** — Warm wood furniture, navy carpet tiles, executive red rugs, and clean office clutter.
- **Solid Pixel Objects & Faint Border Glow** — Interactive objects remain crisp solid pixel art sprites with a soft outer glowing border outline for intuitive discovery.
- **Mobile-First Responsive** — Virtual joystick (bottom-left), contextual action button (bottom-right), HUD timer, and inventory badge indicator for the keycard. Supports both **portrait and landscape** viewports.

## Customizing Discount Codes

Open `game.js` and locate these lines near the top:

```js
const DISCOUNT_CODE_20 = 'YOUR_20_PERCENT_CODE';
const DISCOUNT_CODE_10 = 'YOUR_10_PERCENT_CODE';
```

Replace the placeholder strings with your actual booth promo codes.

## Running Locally

Serve the project using any static file server:

```bash
cmd /c "npx -y serve . -l 3456"
```

Then open `http://localhost:3456` in your browser.

## License

MIT
