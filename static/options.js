/** @type {HTMLSelectElement} */
const activationSelect = document.getElementById('activationSelect');
activationSelect.oninput = () => {
    chrome.storage.sync.set({
        activation: activationSelect.value
    });
};

/**
 * @param {'manual' | 'hebrew' | 'always' | undefined} activationMode 
 */
function updateActivationSelect(activationMode) {
    activationSelect.value = activationMode ?? 'manual';
}

chrome.storage.sync.onChanged.addListener(e => {
    const activation = e.activation;
    if (activation) updateActivationSelect(activation.newValue);
});
chrome.storage.sync.get(['activation'], values => {
    updateActivationSelect(values.activation);
});