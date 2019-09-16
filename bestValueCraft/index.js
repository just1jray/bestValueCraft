var craftableCards = [];
craftableCards = $('.craftable')
	.map(function() {
		return $(this).attr('aria-label');
	})
	.get();

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

var bestValueCraft = mostFrequentOccuranceIn(craftableCards);

console.log(bestValueCraft);
