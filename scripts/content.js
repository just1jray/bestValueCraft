console.log('Content script running...');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === 'getBestCard') {
		sendResponse({ card: findBestCraft() });
	}
});

function findBestCraft() {
	var allCraftableCardData = getCardData();
	var allCraftableCards = trimMultiplierText(allCraftableCardData[0], allCraftableCardData[1], allCraftableCardData[2]);
	var bestValueCraftCard = mostFrequentOccuranceIn(allCraftableCards[0]);
	var bestCardIndex = allCraftableCards[0].indexOf(bestValueCraftCard[0]);
	var result = {
		name: bestValueCraftCard[0],
		imageUrl: allCraftableCards[1][bestCardIndex],
		cardId: allCraftableCards[2][bestCardIndex],
		frequency: bestValueCraftCard[1]
	};
	console.log('bestValueCraft:', result);
	return result;
}

function getCardData() {
	var names = [];
	var images = [];
	var cardIds = [];
	document.querySelectorAll('.craftable').forEach(function(el) {
		var name = el.getAttribute('aria-label');
		var bg = el.style.backgroundImage;
		var match = bg.match(/url\(["']?([^"')]+)["']?\)/);
		var cardId = match ? match[1].split('/').pop().replace(/\.\w+$/, '') : null;
		var imgUrl = cardId ? 'https://art.hearthstonejson.com/v1/render/latest/enUS/256x/' + cardId + '.png' : null;
		if (name && imgUrl) {
			names.push(name);
			images.push(imgUrl);
			cardIds.push(cardId);
		}
	});
	console.log('craftableCards (' + names.length + '):', names);
	return [ names, images, cardIds ];
}

function trimMultiplierText(array, parallelArray, parallelArray2) {
	var newArray = [];
	var newParallelArray = [];
	var newParallelArray2 = [];
	for (var i = 0; i < array.length; i++) {
		var last3Characters = array[i].slice(-3);
		if (last3Characters === ' ×2') {
			var trimmed = array[i].slice(0, -3);
			newArray.push(trimmed, trimmed);
			newParallelArray.push(parallelArray[i], parallelArray[i]);
			newParallelArray2.push(parallelArray2[i], parallelArray2[i]);
		} else {
			newArray.push(array[i]);
			newParallelArray.push(parallelArray[i]);
			newParallelArray2.push(parallelArray2[i]);
		}
	}
	return [ newArray, newParallelArray, newParallelArray2 ];
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
