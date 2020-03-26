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

export interface ButtonText {
    type: 'text';
    label: string;
    payload?: string;
}

export interface ButtonOpenLink {
    type: 'open_link';
    link: string;
    label: string;
}

export interface ButtonLocation {
    type: 'location';
    link: string;
    label: string;
}

export interface ButtonVkPay {
    type: 'vkpay';
    payload?: string;
    hash: string;
}

export interface ButtonOpenApp {
    type: 'open_app';
    app_id: number;
    owner_id?: number;
    payload?: string;
    label: string;
    hash?: string;
}
