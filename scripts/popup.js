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

function showError() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
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

function findBestPack(cardFrequencies, cardMap) {
  var setFrequencies = {};
  var setCardCounts = {};

  cardFrequencies.forEach(function(cardData) {
    var hsCard = cardMap[cardData.cardId];
    if (!hsCard || !hsCard.set) return;
    var set = hsCard.set;
    setFrequencies[set] = (setFrequencies[set] || 0) + cardData.frequency;
    setCardCounts[set] = (setCardCounts[set] || 0) + 1;
  });

  var bestSet = null;
  var bestFrequency = 0;
  Object.keys(setFrequencies).forEach(function(set) {
    if (setFrequencies[set] > bestFrequency) {
      bestFrequency = setFrequencies[set];
      bestSet = set;
    }
  });

  if (!bestSet) return null;
  return {
    setCode: bestSet,
    setName: SET_NAMES[bestSet] || bestSet.replace(/_/g, ' '),
    totalFrequency: bestFrequency,
    uniqueCardCount: setCardCounts[bestSet]
  };
}

function renderPack(packData) {
  if (!packData) {
    document.getElementById('pack-set-title').textContent = 'No data';
    document.getElementById('pack-card-count').textContent = '—';
    document.getElementById('pack-frequency').textContent = '—';
    return;
  }
  document.getElementById('pack-set-title').textContent = packData.setName;
  document.getElementById('pack-card-count').textContent = packData.uniqueCardCount;
  document.getElementById('pack-frequency').textContent = packData.totalFrequency;
}

var currentMode = 'card';
var modeFooter = document.getElementById('mode-footer');

function insertModeButton(panelId) {
  var panel = document.getElementById(panelId);
  var meta = panel.querySelector('.card-meta');
  panel.insertBefore(modeFooter, meta);
}

var modeTooltip = document.getElementById('mode-tooltip');

document.getElementById('mode-cycle-btn').addEventListener('click', function() {
  currentMode = currentMode === 'card' ? 'pack' : 'card';
  var showCard = currentMode === 'card';
  document.getElementById('card-panel').style.display = showCard ? 'flex' : 'none';
  document.getElementById('pack-panel').style.display = showCard ? 'none' : 'flex';
  insertModeButton(showCard ? 'card-panel' : 'pack-panel');
  this.textContent = showCard ? 'Best Craft' : 'Best Pack';
  modeTooltip.textContent = showCard ? 'Switch to Best Pack' : 'Switch to Best Craft';
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: 'getCardFrequencies' }, function(response) {
    if (chrome.runtime.lastError || !response || !response.cards || response.cards.length === 0) {
      showError();
      return;
    }

    var cardFrequencies = response.cards;

    // Find the single card with the highest frequency
    var bestCardData = cardFrequencies.reduce(function(best, card) {
      return card.frequency > best.frequency ? card : best;
    });

    fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json')
      .then(function(res) { return res.json(); })
      .then(function(hsCards) {
        // Build ID lookup map for O(1) access
        var cardMap = {};
        hsCards.forEach(function(c) { cardMap[c.id] = c; });

        // Render best card
        var card = cardMap[bestCardData.cardId];
        if (card) {
          renderCard(card, bestCardData.frequency);
        } else {
          renderCard({ id: bestCardData.cardId, name: bestCardData.name }, bestCardData.frequency);
        }

        // Compute and render best pack
        var bestPack = findBestPack(cardFrequencies, cardMap);
        renderPack(bestPack);

        // Insert button between frame and meta, then show it
        insertModeButton('card-panel');
        modeFooter.style.display = 'flex';
      })
      .catch(function() {
        showError();
      });
  });
});
