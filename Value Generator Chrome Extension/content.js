// setTimeout(function() {
//     var craftableCards = [];
//     var allCraftableCards = [];

//     craftableCards = $('.craftable')
//         .map(function() {
//             return $(this).attr('aria-label');
//         })
//         .get();

//     function split2XList(array) {
//         for (var i = 0; i < array.length; i++) {
//             var last3Characters = array[i].slice(-3, array[i].length);
//             if (last3Characters === ' ×2') {
//                 array[i] = array[i].slice(0, -3);
//                 array.push(array[i]);
//             }
//         }
//         return array;
//     }

//     allCraftableCards = split2XList(craftableCards);
//     // console.log(allCraftableCards);

//     function mostFrequentOccuranceIn(array) {
//         var counts = {};
//         var occurances = 0;
//         var mostFrequentOccurance;
//         for (var i = 0; i < array.length; i++) {
//             var word = array[i];

//             if (counts[word] === undefined) {
//                 counts[word] = 1;
//             } else {
//                 counts[word] += 1;
//             }

//             if (counts[word] > occurances) {
//                 occurances = counts[word];
//                 mostFrequentOccurance = array[i];
//             }
//         }
//         return "Your best value craft is: " + mostFrequentOccurance + "\nIt appears " + occurances + " times in the decks listed on the page.";
//     }

//     function sortByFrequency(array) {
//         var frequency = {};

//         array.forEach(function(value) {
//             frequency[value] = 0;
//         });

//         var uniques = array.filter(function(value) {
//             return ++frequency[value] == 1;
//         });

//         return uniques.sort(function(a, b) {
//             return frequency[b] - frequency[a];
//         });
//     }

//     var bestValueCraft = mostFrequentOccuranceIn(allCraftableCards);
//     var valueCraftList = sortByFrequency(allCraftableCards);

//     console.log(bestValueCraft);
//     console.log(valueCraftList);

//     alert(bestValueCraft);
// }, 1000);

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResonse) {
//         if(request.message === "clicked_browser_action") {
//             var craftableCards = [];
//             var allCraftableCards = [];
        
//             craftableCards = $('.craftable')
//                 .map(function() {
//                     return $(this).attr('aria-label');
//                 })
//                 .get();
        
//             function split2XList(array) {
//                 for (var i = 0; i < array.length; i++) {
//                     var last3Characters = array[i].slice(-3, array[i].length);
//                     if (last3Characters === ' ×2') {
//                         array[i] = array[i].slice(0, -3);
//                         array.push(array[i]);
//                     }
//                 }
//                 return array;
//             }
        
//             allCraftableCards = split2XList(craftableCards);
//             // console.log(allCraftableCards);
        
//             function mostFrequentOccuranceIn(array) {
//                 var counts = {};
//                 var occurances = 0;
//                 var mostFrequentOccurance;
//                 for (var i = 0; i < array.length; i++) {
//                     var word = array[i];
        
//                     if (counts[word] === undefined) {
//                         counts[word] = 1;
//                     } else {
//                         counts[word] += 1;
//                     }
        
//                     if (counts[word] > occurances) {
//                         occurances = counts[word];
//                         mostFrequentOccurance = array[i];
//                     }
//                 }
//                 return "Your best value craft is: " + mostFrequentOccurance + "\nIt appears " + occurances + " times in the decks listed on the page.";
//             }
        
//             function sortByFrequency(array) {
//                 var frequency = {};
        
//                 array.forEach(function(value) {
//                     frequency[value] = 0;
//                 });
        
//                 var uniques = array.filter(function(value) {
//                     return ++frequency[value] == 1;
//                 });
        
//                 return uniques.sort(function(a, b) {
//                     return frequency[b] - frequency[a];
//                 });
//             }
        
//             var bestValueCraft = mostFrequentOccuranceIn(allCraftableCards);
//             var valueCraftList = sortByFrequency(allCraftableCards);
        
//             console.log(bestValueCraft);
//             console.log(valueCraftList);
        
//             chrome.browserAction.setPopup("index.html")
//         }
//     }
// )