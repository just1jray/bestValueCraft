chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, { type: 'getBestCard' }, function(response) {
		if (chrome.runtime.lastError || !response || !response.card[0]) {
			document.querySelector('h1').textContent = 'Visit HSReplay.net/decks to find your best craft!';
		} else {
			document.querySelector('h1').textContent = response.card[0];
			document.querySelector('img').src = response.card[1];
		}
	});
});
