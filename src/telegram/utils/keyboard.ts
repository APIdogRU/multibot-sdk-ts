import { InlineKeyboard, CallbackGame } from '../types/keyboard';
import { QuizType } from '../types/media';

/**
 * Abstract keyboard
 */
abstract class KeyboardButton {
    constructor(protected text: string) { }

    public json = () => ({ text: this.text });
}

class KeyboardRow<T extends KeyboardButton> {
    protected buttons: T[] = [];

    public length = (): number => this.buttons.length;

    public addButton = (button: T) => {
        this.buttons.push(button);
    };

    get json() {
        return this.buttons.map(col => col.json());
    }
}

abstract class KeyboardBuilder<T extends KeyboardButton> {
    protected rows: KeyboardRow<T>[] = [];

    public size = (): number => this.rows.reduce((acc, row) => acc + row.length(), 0);

    public length = (): number => this.rows.length;

    public addRow = (row: KeyboardRow<T> = new KeyboardRow<T>()) => {
        this.rows.push(row);
        return row;
    };

    public getRow = (index: number) => this.rows[index];

    public removeRow = (index: number) => {
        this.rows.splice(index, 1);
        return this;
    }

    public abstract json(): object;
}

/**
 * Reply keyboard
 */
type ReplyKeyboardParams = {
    need_resize?: boolean;
    one_time?: boolean;
    selective?: boolean;
};

export class ReplyKeyboardBuilder extends KeyboardBuilder<ReplyKeyboardButton> {
    constructor(private params: ReplyKeyboardParams = {}) {
        super();
    }

    public json = () => ({
        keyboard: this.rows.map(row => row.json),
        ...this.params,
    });
}

type ReplyKeyboardButtonParams = {
    request_contact?: boolean;
    request_location?: boolean;
    request_poll?: KeyboardButtonPollType;
}

type KeyboardButtonPollType = {
    type: QuizType;
}

export class ReplyKeyboardButton extends KeyboardButton {
    constructor(text: string, private params: ReplyKeyboardButtonParams = {}) {
        super(text);
    }

    public json = () => ({
        text: this.text,
        ...this.params,
    });
}

/**
 * Hide keyboard
 */
export class ReplyKeyboardHide extends KeyboardBuilder<KeyboardButton> {
    constructor(private selective = false) {
        super();
    }

    public addRow = () => {
        throw new Error('Not acceptable');
    }

    public json = () => ({
        hide_keyboard: true,
        selective: this.selective,
    });
}

/**
 * Inline keyboard
 */
export class InlineKeyboardBuilder extends KeyboardBuilder<InlineKeyboardButton> {
    public json = (): InlineKeyboard => ({
        inline_keyboard: this.rows.map(row => row.json),
    });
}

type InlineKeyboardButtonParams = {
    callback_data?: string;
    url?: string;
    login_url?: string;
    switch_inline_query?: string;
    callback_game?: CallbackGame;
}

export class InlineKeyboardButton extends KeyboardButton {
    constructor(text: string, private params: InlineKeyboardButtonParams) {
        super(text);

        if (!Object.keys(params).length) {
            throw new Error('Text buttons are unallowed in the inline keyboard. Specify one of: callback_data, url, login_url, switch_inline_query, or callback_game');
        }

        if ('callback_data' in params && params.callback_data.length > 64) {
            throw new Error('callback_data must be least than 64 symbols');
        }
    }

    public json = () => ({
        text: this.text,
        ...this.params,
    });
}

/**
 * Force reply
 */
type ForceReplyKeyboardParams = {
    selective?: boolean;
}

export class ForceReplyKeyboard extends KeyboardBuilder<KeyboardButton> {
    constructor(private params: ForceReplyKeyboardParams = {}) {
        super();
    }

    public json = () => ({ force_reply: true, ...this.params });
}


