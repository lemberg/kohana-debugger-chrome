chrome.extension.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (message) {
		chrome.tabs.query({
			"active": true,
			"currentWindow": true
		}, function (tabs) {
			if (tabs.length){
				chrome.tabs.sendMessage(tabs[0].id, message);
			}
		});
	});

	chrome.extension.onMessage.addListener(function (message, sender) {
		port.postMessage({tabId: sender.tab.id, content: message});
	});
});

chrome.devtools.network.addRequestHeaders({
    "X-Kohana-Debugger-Version": "0.1"
});
