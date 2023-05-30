export type Activation = 'manual' | 'hebrew' | 'always';
export const activation_default: Activation = 'hebrew';

export type Config = {
    activation: Activation,
};

export const activation_storage_key: string = 'activation';

export function get_activation_mode(): Promise<Activation> {
    return new Promise(complete => 
        chrome.storage.sync.get(activation_storage_key, ({ [activation_storage_key]: activation }) => {
            complete(activation ?? activation_default)
    }));
}

export function subscribe_activation_mode(callback: (activation: Activation) => void): () => void {
    const fn = (data: any) => {
        const activation = data[activation_storage_key];
        if (activation) callback(activation.newValue);
    };
    chrome.storage.sync.onChanged.addListener(fn);
    get_activation_mode().then(callback);
    return () => chrome.storage.sync.onChanged.removeListener(fn);
}

export async function set_activation_mode(activation: Activation) {
    await chrome.storage.sync.set({ [activation_storage_key]: activation });
}