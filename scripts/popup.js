var SET_NAMES = {
  CORE: 'Core Set',
  EXPERT1: 'Classic',
  TGT: 'The Grand Tournament',
  GVG: 'Goblins vs Gnomes',
  NAXX: 'Curse of Naxxramas',
  BRM: 'Blackrock Mountain',
  LOE: 'League of Explorers',
  OG: 'Whispers of the Old Gods',
  KARA: 'One Night in Karazhan',
  GANGS: 'Mean Streets of Gadgetzan',
  UNGORO: "Journey to Un'Goro",
  ICECROWN: 'Knights of the Frozen Throne',
  LOOTAPALOOZA: 'Kobolds & Catacombs',
  GILNEAS: 'The Witchwood',
  BOOMSDAY: 'The Boomsday Project',
  TROLL: "Rastakhan's Rumble",
  DALARAN: 'Rise of Shadows',
  ULDUM: 'Saviors of Uldum',
  DRAGONS: 'Descent of Dragons',
  BLACK_TEMPLE: 'Ashes of Outland',
  SCHOLOMANCE: 'Scholomance Academy',
  DARKMOON_FAIRE: 'Madness at the Darkmoon Faire',
  THE_BARRENS: 'Forged in the Barrens',
  STORMWIND: 'United in Stormwind',
  ALTERAC_VALLEY: 'Fractured in Alterac Valley',
  THE_SUNKEN_CITY: 'Voyage to the Sunken City',
  REVENDRETH: 'Murder at Castle Nathria',
  RETURN_OF_THE_LICH_KING: 'March of the Lich King',
  FESTIVAL_OF_LEGENDS: 'Festival of Legends',
  TITANS: 'TITANS',
  WILD_WEST: 'Showdown in the Badlands',
  WHIZBANGS_WORKSHOP: "Whizbang's Workshop",
  SPACE: 'Perils in Paradise',
  PATH_OF_ARTHAS: 'Path of Arthas',
  ISLAND_VACATION: 'Island Vacation',
  EMERALD_DREAM: 'The Great Dark Beyond',
  BATTLE_OF_THE_BANDS: 'Battle of the Bands',
};

function showError(message) {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
  if (message) {
    document.getElementById('error-message').textContent = message;
  }
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/^\[x\]/i, '')
    .trim();
}

function formatCardText(html) {
  return html
    .replace(/<(?!\/?b\b)[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/^\[x\]/i, '')
    .trim();
}

function formatClass(cardClass) {
  if (!cardClass) return 'Neutral';
  return cardClass.charAt(0) + cardClass.slice(1).toLowerCase();
}

function renderCard(card, frequency) {
  var panel = document.getElementById('card-panel');

  // Rarity class on body (drives glow CSS) and card-meta (drives tooltip border)
  var rarity = (card.rarity || '').toUpperCase();
  var meta = document.querySelector('.card-meta');
  if (rarity === 'LEGENDARY') { document.body.classList.add('rarity-legendary'); meta.classList.add('wc-tooltip-legendary'); }
  else if (rarity === 'EPIC') { document.body.classList.add('rarity-epic'); meta.classList.add('wc-tooltip-epic'); }
  else if (rarity === 'RARE') { document.body.classList.add('rarity-rare'); meta.classList.add('wc-tooltip-rare'); }
  else { document.body.classList.add('rarity-common'); meta.classList.add('wc-tooltip'); }

  // Rarity badge
  var rarityBadge = document.getElementById('rarity-badge');
  if (rarity && rarity !== 'FREE') {
    rarityBadge.textContent = rarity.charAt(0) + rarity.slice(1).toLowerCase();
    rarityBadge.className = 'rarity-' + rarity.toLowerCase();
  }

  // Card image
  document.getElementById('card-img').src = 'https://art.hearthstonejson.com/v1/render/latest/enUS/256x/' + card.id + '.png';

  // Card name
  document.getElementById('card-name').textContent = card.name;

  // Mana cost
  var manaCost = document.getElementById('mana-cost');
  if (card.cost !== undefined) {
    manaCost.textContent = '🔵 ' + card.cost;
  }

  // Card class
  document.getElementById('card-class').textContent = formatClass(card.cardClass);

  // Combat stats (minion / weapon only)
  var combatStats = document.getElementById('combat-stats');
  var cardType = (card.type || '').toUpperCase();
  if ((cardType === 'MINION' || cardType === 'WEAPON') && card.attack !== undefined && card.health !== undefined) {
    document.getElementById('attack-val').textContent = '\u2694\uFE0F ' + card.attack;
    document.getElementById('health-val').textContent = '\u2764\uFE0F ' + card.health;
    combatStats.style.display = 'flex';
  } else {
    combatStats.style.display = 'none';
  }

  // Type line
  var typeLine = cardType.charAt(0) + cardType.slice(1).toLowerCase();
  if (card.race) {
    typeLine += ' \u00B7 ' + card.race.charAt(0) + card.race.slice(1).toLowerCase();
  }
  document.getElementById('card-type').textContent = 'Type: ' + typeLine;

  // Set name
  var setCode = card.set || '';
  var setName = SET_NAMES[setCode] || setCode.replace(/_/g, ' ');
  document.getElementById('card-set').textContent = 'Set: ' + setName;

  // Card text
  var cardTextEl = document.getElementById('card-text');
  if (card.text) {
    cardTextEl.innerHTML = formatCardText(card.text);
    cardTextEl.style.display = 'block';
  } else {
    cardTextEl.style.display = 'none';
  }

  // Frequency
  document.getElementById('frequency').textContent = frequency;

  // Show card panel
  document.getElementById('loading-state').style.display = 'none';
  panel.style.display = 'flex';
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: 'getBestCard' }, function(response) {
    if (chrome.runtime.lastError || !response) {
      showError();
      return;
    }
    if (!response.card || !response.card.name) {
      showError('No craftable cards found. Try the Missing Cards tab on HSReplay.net/decks.');
      return;
    }

    var cardData = response.card;

    fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json')
      .then(function(res) { return res.json(); })
      .then(function(cards) {
        var card = cards.find(function(c) { return c.id === cardData.cardId; });
        if (!card) {
          // Fallback: render with just name and image from content script
          renderCard({ id: cardData.cardId, name: cardData.name }, cardData.frequency);
          return;
        }
        renderCard(card, cardData.frequency);
      })
      .catch(function() {
        showError();
      });
  });
});
