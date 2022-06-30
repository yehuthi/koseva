export default function onAction({ id: tab_id }: chrome.tabs.Tab) {
	if (!tab_id || tab_id === chrome.tabs.TAB_ID_NONE)
		console.error("The extension was invoked on an incompatible tab.");
	else chrome.tabs.sendMessage(tab_id, true);
}
