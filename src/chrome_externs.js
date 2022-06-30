const chrome = {};

chrome.action = {};
chrome.action.onClicked = {};
chrome.action.onClicked.addListener = function (tab) {};

chrome.browserAction = {};
chrome.browserAction.onClicked = {};
chrome.browserAction.onClicked.addListener = function (tab) {};

chrome.tabs = {};
/** @type {number} */
chrome.tabs.TAB_ID_NONE;
/**
 * @param {number} tabId
 * @param {any} message
 * @param {any} options
 * @param {any} callback
 */
chrome.tabs.sendMessage = function (tabId, message, options, callback) {};

chrome.runtime = {};
chrome.runtime.onMessage = {};
chrome.runtime.onMessage.addListener = function (callback) {};
