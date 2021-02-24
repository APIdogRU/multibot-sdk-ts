import { AbstractButton, KeyboardBuilder } from './abstract';
import type { InlineKeyboard, InlineKeyboardButton } from '../../types';

export class InlineKeyboardBuilder extends KeyboardBuilder<InlineKeyboard, InlineButton, 'inline_keyboard'> {
    public build(): InlineKeyboard {
        return {
            inline_keyboard: this.rows.map(row => row.build()),
            ...this.props,
        };
    }
}

export class InlineButton extends AbstractButton<InlineKeyboardButton> {
    public constructor(text: string, props: Omit<InlineKeyboardButton, 'text'> = {}) {
        super(text, props);

        const fields = Object.keys(props).filter(v => v !== 'text');

        if (!fields.length) {
            throw new Error('Text buttons are unallowed in the inline keyboard. Specify one of: callback_data, url, login_url, switch_inline_query, or callback_game');
        }

        if (fields.length > 1) {
            throw new Error('Uncertainty. It is possible to determine what type this button belongs to.');
        }

        if ('callback_data' in props && props.callback_data.length > 64) {
            throw new Error('callback_data must be least than 64 symbols');
        }
    }
}
