import { KeyboardButton, KeyboardBuilder } from './abstract';
import { InlineKeyboard, CallbackGame } from '../../types';

type InlineKeyboardButtonProps = {
    callback_data?: string;
    url?: string;
    login_url?: string;
    switch_inline_query?: string;
    callback_game?: CallbackGame;
};

export class Builder extends KeyboardBuilder<InlineKeyboard, Button, InlineKeyboardButtonProps, 'inline_keyboard'> {
    public build = () => ({
        inline_keyboard: this.rows.map(row => row.build()),
        ...this.props,
    });
}

export class Button extends KeyboardButton<InlineKeyboardButtonProps> {
    constructor(text: string, props: InlineKeyboardButtonProps = {}) {
        super(text, props);

        const fields = Object.keys(props).filter(v => v !== 'text');

        if (!fields.length) {
            throw new Error('Text buttons are unallowed in the inline keyboard. Specify one of: callback_data, url, login_url, switch_inline_query, or callback_game');
        }

        if (fields.length > 1) {
            throw new Error('Uncertainty. It is possible to determine what type this button belongs to.');
        }

        // const type = fields[0];

        if ('callback_data' in props && props.callback_data.length > 64) {
            throw new Error('callback_data must be least than 64 symbols');
        }
    }
}
