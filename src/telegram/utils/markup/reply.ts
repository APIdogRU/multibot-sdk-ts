import { KeyboardBuilder, AbstractButton } from './abstract';
import type { Markup, ReplyKeyboard } from '../../types/keyboard';
import type { ReplyKeyboardButton } from '../../types/keyboard';

export class ReplyKeyboardBuilder extends KeyboardBuilder<ReplyKeyboard, ReplyButton, 'keyboard'> {
    public build(): Markup {
        return {
            keyboard: this.rows.map(row => row.build()),
            ...this.props,
        };
    }
}

export class ReplyButton extends AbstractButton<ReplyKeyboardButton> {
}
