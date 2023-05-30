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
    config.set_activation_mode(activationSelect.value as Activation | null ?? config.activation_default);
};

config.subscribe_activation_mode(activation => {
    activationSelect.value = activation;
});