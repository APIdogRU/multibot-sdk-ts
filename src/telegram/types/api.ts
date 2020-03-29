import { Stream } from 'stream';
import { Update, WebhookInfo, User, UserProfilePhotos, Chat, ChatMember, BaseOption, SendMessageOptions, SendMediaOptions, ChatAction, ParseMode, Message, InputMediaPhoto, InputMediaVideo, QuizType, File, Poll, InlineKeyboard, SendExtraOptions, GameHighScore } from '.';
import { InlineQueryResult } from './inline-query';

export interface Config {
    secret: string;
    apiUrl?: string;
}

export type SendFile = string | Stream | Buffer;

export interface Request {
    (method: 'getUpdates', params: {
        offset?: number;
        limit?: number;
        timeout?: number;
        allowed_updates?: (Exclude<keyof Update, 'update_id'>)[];
    }): Promise<Update[]>;

    (method: 'setWebhook', params: {
        url: string;
        certificate?: SendFile;
        max_connections?: number;
        allowed_updates?: (Exclude<keyof Update, 'update_id'>)[];
    }): Promise<true>;

    (method: 'deleteWebhook'): Promise<true>;

    (method: 'getWebhookInfo'): Promise<WebhookInfo>;

    (method: 'getMe'): Promise<User>;

    (method: 'sendMessage', params: BaseOption & {
        text: string;
    } & SendMessageOptions): Promise<Message>;

    (method: 'forwardMessage', params: BaseOption & {
        forom_chat_id: number | string;
        message_id: number;
        disable_notification?: boolean;
    }): Promise<Message>;

    (method: 'sendPhoto', params: BaseOption & SendMediaOptions & {
        photo: SendFile;
    }): Promise<Message>;

    (method: 'sendAudio', params: BaseOption & SendMediaOptions & {
        audio: SendFile;
    }): Promise<Message>;

    (method: 'sendDocument', params: BaseOption & SendMediaOptions & {
        document: SendFile;
        thumb?: SendFile;
    }): Promise<Message>;

    (method: 'sendVideo', params: BaseOption & SendMediaOptions & {
        video: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
        supports_streaming?: boolean;
    }): Promise<Message>;

    (method: 'sendAnimation', params: BaseOption & SendMediaOptions & {
        animation: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
    }): Promise<Message>;

    (method: 'sendVoice', params: BaseOption & SendMediaOptions & {
        voice: SendFile;
        duration?: number;
    }): Promise<Message>;

    (method: 'sendVideoNote', params: BaseOption & SendMessageOptions & {
        video_note: SendFile;
        duration?: number;
        length?: number;
        thumb?: SendFile;
    }): Promise<Message>;

    (method: 'sendMediaGroup', params: BaseOption & {
        media: (InputMediaPhoto | InputMediaVideo)[];
    }): Promise<Message>;

    (method: 'sendLocation', params: BaseOption & SendMediaOptions & {
        latitude: number;
        longitude: number;
        live_period?: number;
    }): Promise<Message>;

    (method: 'editMessageLiveLocation', params: BaseOption & {
        message_id?: number;
        inline_message_id?: number;
        latitude: number;
        longitude: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message>;

    (method: 'stopMessageLiveLocation', params: BaseOption & SendMessageOptions & {
        message_id?: number;
        inline_message_id?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message>;

    (method: 'sendVenue', params: BaseOption & SendMessageOptions & {
        latitude: number;
        longitude: number;
        title: string;
        address: string;
        foursquare_id?: string;
        foursquare_type?: string;
    }): Promise<Message>;

    (method: 'sendContact', params: BaseOption & SendMessageOptions & {
        phone_number: string;
        first_name: string;
        last_name?: string;
        vcard?: string;
    }): Promise<Message>;

    (method: 'sendPoll', params: BaseOption & SendMessageOptions & {
        question: string;
        options: string[];
        is_anonymous?: boolean;
        type?: QuizType;
        allows_multiple_answers?: boolean;
        correct_option_id?: number;
        is_closed?: boolean;
    }): Promise<Message>;

    (method: 'sendChatAction', params: BaseOption & {
        action: ChatAction;
    }): Promise<true>;

    (method: 'getUserProfilePhotos', params: {
        user_id: number;
        offset?: number;
        limit?: number;
    }): Promise<UserProfilePhotos>;

    (method: 'getFile', params: {
        file_id: string;
    }): Promise<File>;

    // kickChatMember
    // unbanChatMember
    // restrictChatMember
    // promoteChatMember
    // setChatAdministratorCustomTitle
    // setChatPermissions
    // exportChatInviteLink
    // setChatPhoto
    // deleteChatPhoto
    // setChatTitle
    // setChatDescription
    // pinChatMessage
    // unpinChatMessage
    // leaveChat

    (method: 'getChat', params: BaseOption): Promise<Chat>;

    (method: 'getChatAdministrators', params: BaseOption): Promise<ChatMember>;

    (method: 'getChatMembersCount', params: BaseOption): Promise<number>;

    (method: 'getChatMember', params: BaseOption & { user_id: number }): Promise<ChatMember>;

    // setChatStickerSet
    // deleteChatStickerSet

    (method: 'answerCallbackQuery', params: {
        callback_query_id: string;
        text?: string;
        show_alert?: boolean;
        url?: string;
        cache_time?: number;
    }): Promise<true>;

    (method: 'editMessageText', params: BaseOption & SendMessageOptions & {
        message_id?: number;
        inline_message_id?: number;
        text: string;
        reply_markup?: ParseMode;
    }): Promise<Message | true>;

    (method: 'editMessageCaption', params: BaseOption & SendMediaOptions & {
        message_id?: number;
        inline_message_id?: number;
    }): Promise<Message | true>;

    (method: 'editMessageMedia', params: BaseOption & {
        message_id?: number;
        inline_message_id?: number;
        media?: (InputMediaPhoto | InputMediaVideo)[];
        reply_markup?: InlineKeyboard;
    }): Promise<Message | true>;

    (method: 'editMessageReplyMarkup', params: BaseOption & {
        message_id?: number;
        inline_message_id?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message | true>;

    (method: 'stopPoll', params: BaseOption & {
        message_id: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Poll>;

    (method: 'deleteMessage', params: BaseOption & {
        message_id: number;
    }): Promise<true>;

    (method: 'sendSticker', params: BaseOption & { sticker: string } & SendExtraOptions): Promise<Message>;

    // getStickerSet
    // uploadStickerFile
    // createNewStickerSet
    // addStickerToSet
    // setStickerPositionInSet

    (method: 'answerInlineQuery', params: {
        inline_query_id: string;
        results: InlineQueryResult[];
        cache_time?: number;
        is_personal?: boolean;
        next_offset?: string;
        switch_pm_text?: string;
        switch_pm_parameter?: string;
    }): Promise<true>;

    (method: 'sendGame', params: BaseOption & {
        game_short_name: string;
    } & SendExtraOptions): Promise<Message>;

    (method: 'setGameScore', params: Partial<BaseOption> & {
        user_id: number;
        score: number;
        force?: boolean;
        disable_edit_message?: boolean;
        message_id?: number;
        inline_message_id?: number;
    }): Promise<Message | true>;

    (method: 'getGameHighScores', params: {
        user_id: number;
        chat_id?: number;
        message_id?: number;
        inline_message_id?: number;
    }): Promise<GameHighScore[]>;
}
