export interface Keyboard {
    one_time?: boolean;
    buttons: KeyboardButton[][];
    inline?: boolean;
}

export interface KeyboardButton {
    action: KeyboardButtonAction;
    color?: KeyboardButtonColor;
}

export type KeyboardButtonColor = 'primary' | 'secondary' | 'negative' | 'positive';

export type KeyboardButtonAction =
    | ButtonText
    | ButtonOpenLink
    | ButtonLocation
    | ButtonVkPay
    | ButtonOpenApp;

interface KeyboardButtonActionAbs<T extends string> {
    type: T;
}

export type ButtonText = KeyboardButtonActionAbs<'text'> & {
    label: string;
    payload?: string;
};

export type ButtonOpenLink = KeyboardButtonActionAbs<'open_link'> & {
    link: string;
    label: string;
};

export type ButtonLocation = KeyboardButtonActionAbs<'location'> & {
    link: string;
    label: string;
};

export type ButtonVkPay = KeyboardButtonActionAbs<'vkpay'> & {
    payload?: string;
    hash: string;
};

export type ButtonOpenApp = KeyboardButtonActionAbs<'open_app'> & {
    app_id: number;
    owner_id?: number;
    payload?: string;
    label: string;
    hash?: string;
};
