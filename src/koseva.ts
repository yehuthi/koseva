import { activate } from "./core";
import * as config from "./config";

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

function isHebrew(text: string): boolean {
	for (let i = 0; i < text.length; i++) {
		const c = text.charCodeAt(i);
		if (0x0590 <= c && c <= 0x05FF) return true;
	}
	return false;
}

function isHebrewTextInPage(): boolean {
	function checkNode(node: ChildNode): boolean {
		if (node.textContent && isHebrew(node.textContent)) return true;
		for (const child of node.childNodes) if (checkNode(child)) return true;
		return false;
	}
	for (const node of document.childNodes) if (checkNode(node)) return true;
	return false;
}

function isHebrewPage(): boolean {
	return (
		document.documentElement.lang === 'he' ||
		isHebrew(document.title)               ||
		isHebrewTextInPage()
	);
}

chrome.runtime.onMessage.addListener(onActivate);

chrome.storage.sync.get([config.activation_storage_key], config => {
	const activation = Object.values(config)[0]; // can't just read normally seemingly due to a browser bug.
	if ((activation === 'hebrew' && isHebrewPage()) || activation === 'always')
		onActivate();
})