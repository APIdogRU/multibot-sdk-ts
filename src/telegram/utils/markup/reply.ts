import { KeyboardBuilder, KeyboardButton } from './abstract';
import { ReplyKeyboard, QuizType } from '../../types';

type ReplyKeyboardButtonProps = {
    request_contact?: boolean;
    request_location?: boolean;
    request_poll?: KeyboardButtonPollType;
};

type KeyboardButtonPollType = {
    type: QuizType;
};

export class Builder extends KeyboardBuilder<ReplyKeyboard, Button, ReplyKeyboardButtonProps, 'keyboard'> {
    public build = () => ({
        keyboard: this.rows.map(row => row.build()),
        ...this.props
    });
}

export class Button extends KeyboardButton<ReplyKeyboardButtonProps> {
}
