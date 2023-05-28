import { activate } from "./core";

function twitter(document: Document) {
	const node = document.getElementById("react-root");
	if (!node) {
		console.error(
			"Koseva failed to activate for Twitter because the page is an unexpected state."
		);
		return;
	}
	activate(node);
}

function pageActivate() {
	const hostname = window.location.hostname.toLowerCase();
	(hostname === "twitter.com" ? twitter : activate)(document);
}

const onActivate = (() => {
	let active = false;
	return () => {
		if (active) return;
		active = true;
		pageActivate();
	};
})();

chrome.runtime.onMessage.addListener(onActivate);

chrome.storage.sync.get('activation', config => {
	const activation = Object.values(config)[0]; // can't just read normally seemingly due to a browser bug.
	if (activation === 'always') onActivate();
})