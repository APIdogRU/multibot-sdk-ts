import { MarkupBuilder } from './abstract';
import type { KeyboardRemoveMarkup } from '../../types';

export class RemoveKeyboardBuilder extends MarkupBuilder<KeyboardRemoveMarkup, 'remove_keyboard'> {
    public build(): KeyboardRemoveMarkup {
        return {
            remove_keyboard: true,
            ...this.props,
        };
    }
}
