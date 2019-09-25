console.log('Popup script running...');

chrome.storage.sync.get([ 'card' ], function(data) {
	if (typeof data.card == 'undefined') {
		$('h1').text('Error');
		console.log(data.card);
	} else {
		$('h1').text(data.card[0]);
		$('img').attr('src', data.card[1]);
	}
});
