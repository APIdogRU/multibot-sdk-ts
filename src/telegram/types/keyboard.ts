import { QuizType } from './media';

export type Markup =
    | ReplyKeyboard
    | KeyboardRemoveMarkup
    | InlineKeyboard
    | ForceReplyMarkup;

export type KeyboardButton = 
    | ReplyKeyboardButton
    | InlineKeyboardButton;

/**
 * Reply keyboard
 */

export type ReplyKeyboard = {
    keyboard: ReplyKeyboardButton[][];
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
    selective?: boolean;
};

export type ReplyKeyboardButton = {
    text: string;
    request_contact?: boolean;
    request_location?: boolean;
    request_poll?: KeyboardButtonPollType;
};

export type KeyboardRemoveMarkup = {
    remove_keyboard: boolean;
    selective?: boolean;
};

export type KeyboardButtonPollType = {
    type?: QuizType;
};

/**
 * Inline keyboard
 */

export type InlineKeyboard = {
    inline_keyboard: InlineKeyboardButton[][];
};

export type InlineKeyboardButton = {
    text: string;
    url?: string;
    login_url?: LoginUrl;
    callback_data?: string;
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    callback_game?: CallbackGame;
};

export type LoginUrl = {
    url: string;
    forward_text?: string;
    bot_username?: string;
    request_write_acces?: boolean;
};

export type CallbackGame = object;

export type ForceReplyMarkup = {
    force_reply: boolean;
    selective?: boolean;
};
