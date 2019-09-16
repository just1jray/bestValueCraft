// 2019 Jesse McKnight

// Used with HSReplay.com after uploading your collection.
// From the Decks page filter by preference.
// Copy and paste the code into the Javscript console to find the most frequently occurring craftable card on the page and the number of occurances.
// You will also see a list of the cards sorted by frequency of occurance.

var craftableCards = [];
var allCraftableCards = [];

craftableCards = $('.craftable')
	.map(function() {
		return $(this).attr('aria-label');
	})
	.get();

function split2XList(array) {
	for (var i = 0; i < array.length; i++) {
		var last3Characters = array[i].slice(-3, array[i].length);
		if (last3Characters === ' ×2') {
			array[i] = array[i].slice(0, -3);
			array.push(array[i]);
		}
	}
	return array;
}

allCraftableCards = split2XList(craftableCards);
// console.log(allCraftableCards);

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

var bestValueCraft = mostFrequentOccuranceIn(craftableCards);
var valueCraftList = sortByFrequency(craftableCards);

console.log(bestValueCraft);
console.log(valueCraftList);
