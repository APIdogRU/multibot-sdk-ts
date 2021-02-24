import { MarkupBuilder } from './abstract';
import type { ForceReplyMarkup } from '../../types';

export class ForceReplyKeyboardBuilder extends MarkupBuilder<ForceReplyMarkup> {
    public build(): ForceReplyMarkup {
        return {
            force_reply: this.props.force_reply ?? true,
            selective: this.props.selective,
        };
    }
}
