export type Activation = 'manual' | 'hebrew' | 'always';
export const activation_default: Activation = 'hebrew';

export type Config = {
    activation: Activation,
};

export const activation_storage_key: string = 'activation';