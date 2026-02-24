# bestValueCraft

A Chrome extension that maximizes the value of your Hearthstone Dust by finding the best card to craft based on live deck data from HSReplay.net.

Using your synced collection and the deck frequency data on HSReplay, the extension identifies the uncrafted card that appears in the most decks — giving you the most value per dust spent.

## Features

- Finds the highest-frequency uncrafted card from the current HSReplay decks page
- Displays the full Hearthstone card render with rarity-colored glow effects
- Shows card metadata: name, rarity, mana cost, class, type, set, card text, and deck count
- Styled with a WarcraftCN wooden card frame and fantasy UI
- Requires collection syncing to be active on HSReplay

## Installation

1. Download and unzip the repository.
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the extension directory.

## Usage

1. Sign in to [HSReplay.net](https://hsreplay.net) and enable collection syncing.
2. Navigate to [hsreplay.net/decks/](https://hsreplay.net/decks/)
3. Apply any filters you want (format, class, etc.).
4. Click the extension icon in the toolbar — it will show you the best card to craft from the current results.
5. Adjust filters and click again to recalculate.

## Roadmap

- Trigger on icon click instead of any page interaction
- Display a ranked list of cards by frequency
- Additional card filtering options
