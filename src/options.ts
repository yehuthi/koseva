import type { Activation } from "./config";
import * as config from "./config";

const activationSelect = document.getElementById('activationSelect') as HTMLSelectElement;

activationSelect.append(...['always', 'hebrew', 'manual'].map(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = chrome.i18n.getMessage(value);
    option.title = chrome.i18n.getMessage(`${value}_desc`);
    return option;
}));

activationSelect.oninput = () => {
    chrome.storage.sync.set({
        [config.activation_storage_key]: activationSelect.value
    });
};

function updateActivationSelect(activationMode?: Activation) {
    activationSelect.value = activationMode ?? config.activation_default;
}

chrome.storage.sync.onChanged.addListener(e => {
    const activation = e[config.activation_storage_key];
    if (activation) updateActivationSelect(activation.newValue);
});
chrome.storage.sync.get([config.activation_storage_key], values => {
    updateActivationSelect(values[config.activation_storage_key]);
});