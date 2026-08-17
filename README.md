# Find The Code — Office Heist

**Find The Code: Office Heist** is a mobile-first mini exploration game designed for live events, stalls, and pop-up activations. Visitors scan a QR code at your booth, opening the game directly in their mobile browser — no app install, no sign-up required.

## Story & Mission

You are a newly hired intern on your first day at Corporate HQ. An urgent executive memo directs you to retrieve the CEO's secret access code before the deadline!

### Mission Flow

1. **Opening Memo** — Read your mission directive from executive management.
2. **Room 1: Reception / CEO Entry** — Explore 6 interactive office objects (desk drawers, bookshelves, plant pots, filing cabinets, coat rack, wall art). Retrieve the **Executive Keycard** and the **4-digit Door Access Code (`7492`)** to unlock the security door to the Open Office Floor.
3. **Room 2: Open Office Floor** — Speak with Alex the Office Worker to get a clue describing the target workstation (*"Desk #6 on the right with the RED MUG"*). Access the correct computer among 8 workstations to read `SECRET_RIDDLE.TXT` (*"I have keys but no locks... Answer: `KEYBOARD`"*).
4. **Room 3: CEO Private Suite** — Use your Executive Keycard to breach the suite. Speak with the CEO or inspect the Vault Locker, input the Riddle Answer (`KEYBOARD`), and unlock the secret discount code!

## The Reward Structure

| Finish Time | Reward Unlocked |
|---|---|
| ≤ 1:30 | **20% Discount Code** |
| > 1:30 | **10% Discount Code** |

## Visual Style

- **Stylized Office Pixel Art** — Warm wood tones, soft blue carpet, plaster walls, executive office rugs, and clean workstation sprites.
- **Warm Subtle Glow** — Interactive objects feature soft yellow/gold highlights and gentle pulse animations for intuitive discovery without harsh neon elements.
- **Responsive Controls** — Virtual joystick (bottom-left), contextual action button (bottom-right), HUD timer, and inventory badge indicator for the keycard. Works seamlessly in both **portrait and landscape** mode.

## Customizing Discount Codes

Open `game.js` and locate these lines near the top:

```js
const DISCOUNT_CODE_20 = '';
const DISCOUNT_CODE_10 = '';
```

Replace with your actual promo codes.

## Running Locally

Serve the project using any static file server:

```bash
cmd /c "npx -y serve . -l 3456"
```

Then open `http://localhost:3456` in your browser.

## License

MIT
