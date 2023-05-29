const chrome = {};

chrome.action = {};
chrome.action.onClicked = {};
chrome.action.onClicked.addListener = function (tab) { };

chrome.browserAction = {};
chrome.browserAction.onClicked = {};
chrome.browserAction.onClicked.addListener = function (tab) { };

chrome.tabs = {};
/** @type {number} */
chrome.tabs.TAB_ID_NONE;
/**
 * @param {number} tabId
 * @param {any} message
 * @param {any} options
 * @param {any} callback
 */
chrome.tabs.sendMessage = function (tabId, message, options, callback) { };

chrome.runtime = {};
chrome.runtime.onMessage = {};
chrome.runtime.onMessage.addListener = function (callback) { };

chrome.storage = {};
chrome.storage.sync = {};
/**
 * @param {string | string[] | object} keys
 */
chrome.storage.sync.get = function (keys) { };
/**
 * @param {object} items 
 */
chrome.storage.sync.set = function (items) { };
chrome.storage.sync.onChanged = {};
/**
 * @param {(changes: { newValue?: unknown, oldValue?: unknown }) => void} callback 
 */
chrome.storage.sync.onChanged.addListener = function (callback) { };

chrome.i18n = {};
/**
 * 
 * @param {string} messageName 
 * @param {string | string[]} substitutions 
 * @returns string
 */
chrome.i18n.getMessage = function (messageName, substitutions) { }