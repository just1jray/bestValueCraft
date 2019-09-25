console.log('Content script running...');

var bestValueCraft;
window.addEventListener('load', findBestCraft);

function findBestCraft() {
	var allCraftableCardData = getCardData();
	console.log(allCraftableCardData);
	var allCraftableCards = trimMultiplierText(allCraftableCardData[0], allCraftableCardData[1]);
	console.log(allCraftableCards);
	var bestValueCraftCard = mostFrequentOccuranceIn(allCraftableCards[0]);
	console.log(bestValueCraftCard);
	var bestValueCraftImageLink = mostFrequentOccuranceIn(allCraftableCards[1]);
	console.log(bestValueCraftImageLink);
	bestValueCraft = [ bestValueCraftCard[0], bestValueCraftImageLink[0] ];
	// var valueCraftList = sortByFrequency(allCraftableCards[0]);
	console.log(bestValueCraft);

	chrome.storage.sync.set({ card: bestValueCraft });

	console.log('Done.');
}

function getCardData() {
	var craftableCards = [];
	var craftableCardImageLinks = [];
	var cardData = {};

	craftableCards = getCraftableCards();
	console.log(craftableCards);
	craftableCardImageLinks = getCraftableCardImageLinks();
	console.log(craftableCardImageLinks);

	// craftableCards.forEach((craftableCards, i) => (cardData[craftableCards] = craftableCardImageLinks[i]));
	// console.log(cardData);
	// return cardData;
	return [ craftableCards, craftableCardImageLinks ];
}

function getCraftableCards() {
	var craftableCards = $('.craftable')
		.map(function() {
			return $(this).attr('aria-label');
		})
		.get();
	return craftableCards;
}

function getCraftableCardImageLinks() {
	var craftableCardImageLinks = $('.craftable')
		.map(function() {
			return $(this).parent().siblings().find('img').attr('src');
		})
		.get();
	return craftableCardImageLinks;
}

function trimMultiplierText(array, parallelArray) {
	for (var i = 0; i < array.length; i++) {
		var last3Characters = array[i].slice(-3, array[i].length);
		if (last3Characters === ' ×2') {
			array[i] = array[i].slice(0, -3);
			array.push(array[i]);
			parallelArray.push(parallelArray[i]);
		}
	}
	return [ array, parallelArray ];
}

function mostFrequentOccuranceIn(array) {
	var counts = {};
	var occurances = 0;
	var mostFrequentOccurance;
	for (var i = 0; i < array.length; i++) {
		var word = array[i];

		if (counts[word] === undefined) {
			counts[word] = 1;
		} else {
			counts[word] += 1;
		}

		if (counts[word] > occurances) {
			occurances = counts[word];
			mostFrequentOccurance = array[i];
		}
	}
	return [ mostFrequentOccurance, occurances ];
}

function sortByFrequency(array) {
	var frequency = {};

	array.forEach(function(value) {
		frequency[value] = 0;
	});

	var uniques = array.filter(function(value) {
		return ++frequency[value] == 1;
	});

	return uniques.sort(function(a, b) {
		return frequency[b] - frequency[a];
	});
}
