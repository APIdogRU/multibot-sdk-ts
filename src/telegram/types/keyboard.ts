export interface Markup {

}

export interface KeyboardButton {
    text: string;
}

/**
 * Reply keyboard
 */

export interface ReplyKeyboard extends Markup {
    keyboard: ReplyKeyboardButton[][];
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    selective?: boolean;
}

export interface ReplyKeyboardButton extends KeyboardButton {
    request_contact?: boolean;
    request_location?: boolean;
}

export interface KeyboardRemoveMarkup extends Markup {
    remove_keyboard: boolean;
    selective?: boolean;
}

/**
 * Inline keyboard
 */

export interface InlineKeyboard extends Markup {
    inline_keyboard: InlineKeyboardButton[][];
}

export interface InlineKeyboardButton extends KeyboardButton {
    url?: string;
    login_url?: LoginUrl;
    callback_data?: string;
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    callback_game?: CallbackGame;
}

export interface LoginUrl {
    url: string;
    forward_text?: string;
    bot_username?: string;
    request_write_acces?: boolean;
}

export type CallbackGame = object;

export interface ForceReplyMarkup extends Markup {
    force_reply: boolean;
    selective?: boolean;
}
