chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === 'getBestCard') {
		findBestCraft().then(function(result) {
			sendResponse({ card: result });
		}).catch(function() {
			sendResponse({ card: null });
		});
		return true; // Keep message channel open for async response
	}
	if (request.type === 'getCardFrequencies') {
		sendResponse({ cards: getAllCardFrequencies() });
	}
});

function findBestCraft() {
	return fetchUncraftableIds().then(function(uncraftableIds) {
		var cards = expandCopies(getCardData(uncraftableIds));
		var bestValueCraftCard = mostFrequentOccurrenceIn(cards.map(function(c) { return c.name; }));
		var bestCard = cards.find(function(c) { return c.name === bestValueCraftCard[0]; });
		return {
			name: bestCard.name,
			cardId: bestCard.cardId,
			frequency: bestValueCraftCard[1]
		};
	});
}

function fetchUncraftableIds() {
	return fetch('https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json')
		.then(function(res) { return res.json(); })
		.then(function(cards) {
			var ids = new Set();
			cards.forEach(function(card) {
				// FREE rarity = no rarity gem = cannot be crafted with dust (Core Set, Path of Arthas, etc.)
				if (!card.rarity || card.rarity === 'FREE') {
					ids.add(card.id);
				}
			});
			return ids;
		})
		.catch(function() {
			return new Set();
		});
}

function getCardData(uncraftableIds) {
	var cards = [];
	document.querySelectorAll('.craftable').forEach(function(el) {
		var name = el.getAttribute('aria-label');
		var bg = el.style.backgroundImage;
		var match = bg.match(/url\(["']?([^"')]+)["']?\)/);
		var cardId = match ? match[1].split('/').pop().replace(/\.\w+$/, '') : null;
		// Skip Core set cards — they cannot be crafted with dust
		if (cardId && cardId.startsWith('CORE_')) return;
		// Skip other uncraftable cards identified via HearthstoneJSON set data
		if (cardId && uncraftableIds && uncraftableIds.has(cardId)) return;
		if (name && cardId) {
			cards.push({ name: name, cardId: cardId });
		}
	});
	return cards;
}

function expandCopies(cards) {
	var result = [];
	cards.forEach(function(card) {
		if (card.name.slice(-3) === ' ×2') {
			var expanded = { name: card.name.slice(0, -3), cardId: card.cardId };
			result.push(expanded, expanded);
		} else {
			result.push(card);
		}
	});
	return result;
}

function mostFrequentOccurrenceIn(array) {
	var counts = {};
	var occurrences = 0;
	var mostFrequentOccurrence;
	for (var i = 0; i < array.length; i++) {
		var word = array[i];

		if (counts[word] === undefined) {
			counts[word] = 1;
		} else {
			counts[word] += 1;
		}

		if (counts[word] > occurrences) {
			occurrences = counts[word];
			mostFrequentOccurrence = array[i];
		}
	}
	return [ mostFrequentOccurrence, occurrences ];
}

function getAllCardFrequencies() {
	var cards = expandCopies(getCardData());

	var counts = {};
	cards.forEach(function(card) {
		counts[card.cardId] = (counts[card.cardId] || 0) + 1;
	});

	var seen = {};
	var result = [];
	cards.forEach(function(card) {
		if (!seen[card.cardId]) {
			seen[card.cardId] = true;
			result.push({
				name: card.name,
				cardId: card.cardId,
				frequency: counts[card.cardId]
			});
		}
	});
	return result;
}
