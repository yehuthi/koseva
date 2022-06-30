import onAction from "./background";

chrome.browserAction.onClicked.addListener(onAction);
