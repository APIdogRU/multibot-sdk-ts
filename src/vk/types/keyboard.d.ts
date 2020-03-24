declare namespace VkBot {
    interface Keyboard {
        one_time?: boolean;
        buttons: KeyboardButton[][];
        inline?: boolean;
    }

    interface KeyboardButton {
        action: KeyboardButtonAction;
        color?: KeyboardButtonColor;
    }

    type KeyboardButtonColor = 'primary' | 'secondary' | 'negative' | 'positive';

    type KeyboardButtonAction =
        | ButtonText
        | ButtonOpenLink
        | ButtonLocation
        | ButtonVkPay
        | ButtonOpenApp;

    interface KeyboardButtonActionAbs<T extends string> {
        type: T;
    }

    type ButtonText = KeyboardButtonActionAbs<'text'> & {
        label: string;
        payload?: string;
    };

    type ButtonOpenLink = KeyboardButtonActionAbs<'open_link'> & {
        link: string;
        label: string;
    };

    type ButtonLocation = KeyboardButtonActionAbs<'location'> & {
        link: string;
        label: string;
    };

    type ButtonVkPay = KeyboardButtonActionAbs<'vkpay'> & {
        payload?: string;
        hash: string;
    };

    type ButtonOpenApp = KeyboardButtonActionAbs<'open_app'> & {
        app_id: number;
        owner_id?: number;
        payload?: string;
        label: string;
        hash?: string;
    };
}
