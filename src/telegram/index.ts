import fetch from 'node-fetch';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import AbstractBot, { IBotPolling } from '../abstract-bot';
import {
    User,
    Message,
    Update,
    CallbackQuery,
    Chat,
    InlineQuery,
    ChosenInlineResult,
    Location,
    WebhookInfo,
    ParseMode,
    ChatAction,
    UserProfilePhotos,
    File,
    Markup,
    ChatMember,
    InlineQueryResult,
    GameHighScore,
    InlineKeyboard,
    InputMediaVideo,
    InputMediaPhoto,
    QuizType,
    Poll,
    MessageEntity,
    BotCommand,
} from './types';
import { TelegramMatcher, MatchType, MatchResultCommand } from './matcher';
import { Listener } from '../utils';
import { sanitizeMarkdownV2Props } from './utils';

export interface Config {
    secret: string;
    apiUrl?: string;
}

interface On {
    (event: MatchType.Message, listener: Listener<Message>): void;
    (event: MatchType.MessageEdited, listener: Listener<Message>): void;
    (event: MatchType.ChannelPost, listener: Listener<Message>): void;
    (event: MatchType.ChannelPostEdited, listener: Listener<Message>): void;
    (event: MatchType.CallbackQuery, listener: Listener<CallbackQuery>): void;
    (event: MatchType.Exact, listener: Listener<Message>): void;
    (event: MatchType.Command, listener: Listener<MatchResultCommand>): void;
    (event: MatchType.InlineQuery, listener: Listener<InlineQuery>): void;
    (event: MatchType.ChosenInlineResult, listener: Listener<ChosenInlineResult>): void;
    (event: MatchType.Photo | MatchType.Video | MatchType.Audio | MatchType.Voice | MatchType.Animation | MatchType.Sticker, listener: Listener<Message & {
        getFileUrl: () => Promise<string>;
    }>): void;
    (event: MatchType.Location, listener: Listener<Location>): void;
}

/**
 * Message argument
 */
export type ArgumentMessage = {
    message: Message;
    from: User;
    chat: Chat;
};

export type SendFile = string | Buffer;

export class Bot extends AbstractBot<Config, Update> implements IBotPolling {
    private static readonly defaultConfig: Config = {
        secret: 'never_used',
        apiUrl: 'https://api.telegram.org',
    };

    public constructor(config: Config) {
        super();

        if (!config.secret) {
            throw new Error('secret not specified');
        }

        this.config = { ...Bot.defaultConfig, ...config };
        this.setMatcher(new TelegramMatcher(this));
    }

    protected readonly getApiEndpoint = (method: string): string =>
        `${this.config.apiUrl}/bot${this.config.secret}/${method}`;

    private createFormDataFromParams(params: Record<string, unknown>): FormData {
        return Object.entries(params).reduce((form, [key, value]) => {
            if (value === undefined) {
                return form;
            }

            if (typeof value === 'string' && ['photo', 'video', 'audio', 'document'].includes(key) && !value.startsWith('http') && fs.existsSync(value)) {
                value = fs.createReadStream(value);
            }

            if (value instanceof Buffer || value instanceof fs.ReadStream) {
                let filename = 'filename'; // fallback

                if ('__filename' in params) {
                    filename = params.__filename as string; // user-specified name
                } else if (value instanceof fs.ReadStream && typeof value.path === 'string') {
                    filename = path.basename(value.path); // file stream path
                }

                form.append(key, value, { filename });
                return form;
            }

            switch (typeof value) {
                case 'number':
                case 'boolean': {
                    value = String(value);
                    break;
                }

                case 'object': {
                    value = JSON.stringify(value);
                    break;
                }
            }

            form.append(key, value);

            return form;
        }, new FormData());
    }

    public request = async<T>(apiMethod: string, params: Record<string, unknown> = {}): Promise<T> => {
        type ResultOk = {
            ok: true;
            result: T;
        };

        type ResultError = {
            ok: false;
            error_code: number;
            description: string;
        };

        type Result = ResultOk | ResultError;

        const url = this.getApiEndpoint(apiMethod);
        const form = this.createFormDataFromParams(params);

        const timeout = apiMethod === 'getUpdates' ? 30000 : 5000;

        const request = await fetch(url, {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
            timeout,
        });

        const data: Result = await request.json();
        const { status, statusText } = request;

        if (data?.ok) {
            return data.result;
        }

        throw new Error(`Error HTTP ${status} ${statusText}: ${(data as ResultError)?.description}`);
    };

    /**
     * Public API
     */

    public getUpdates = async(props: {
        offset?: number;
        limit?: number;
        timeout?: number;
        allowed_updates?: (Exclude<keyof Update, 'update_id'>)[];
    }): Promise<Update[]> => this.request('getUpdates', props);

    public setWebhook = async(props: {
        url: string;
        certificate?: SendFile;
        max_connections?: number;
        allowed_updates?: (Exclude<keyof Update, 'update_id'>)[];
    }): Promise<true> => this.request('setWebhook', props);

    public deleteWebhook = async(): Promise<true> => this.request('deleteWebhook');

    public getWebhookInfo = async(): Promise<WebhookInfo> => this.request('getWebhookInfo');

    public getMe = async(): Promise<User> => this.request('getMe');

    public sendMessage = async(props: {
        chat_id: number | string;
        text: string;
        parse_mode?: ParseMode;
        entities?: MessageEntity[];
        disable_web_page_preview?: boolean;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendMessage', sanitizeMarkdownV2Props(props));

    public copyMessage = async(props: {
        chat_id: number | string;
        from_chat_id: number | string;
        message_id: number;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('copyMessage', sanitizeMarkdownV2Props(props, 'caption'));

    public forwardMessage = async(props: {
        chat_id: number | string;
        from_chat_id: number | string;
        message_id: number;
        disable_notification?: boolean;
    }): Promise<Message> => this.request('forwardMessage', props);

    public sendPhoto = async(props: {
        chat_id: number | string;
        photo: SendFile;
        caption: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendPhoto', sanitizeMarkdownV2Props(props, 'caption'));

    public sendAudio = async(props: {
        chat_id: number | string;
        audio: SendFile;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        duration?: number;
        performer?: string;
        title?: string;
        thumb?: SendFile;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendAudio', sanitizeMarkdownV2Props(props, 'caption'));

    public sendDocument = async(props: {
        chat_id: number | string;
        document: SendFile;
        thumb?: SendFile;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        disable_content_type_detection?: boolean;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        allow_sending_without_reply?: boolean;
        __filename?: string;
    }): Promise<Message> => this.request('sendDocument', sanitizeMarkdownV2Props(props, 'caption'));

    public sendVideo = async(props: {
        chat_id: number | string;
        video: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        supports_streaming?: boolean;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendVideo', sanitizeMarkdownV2Props(props, 'caption'));

    public sendAnimation = async(props: {
        chat_id: number | string;
        animation: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendAnimation', sanitizeMarkdownV2Props(props, 'caption'));

    public sendVoice = async(props: {
        chat_id: number | string;
        voice: SendFile;
        duration?: number;
        caption?: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendVoice', sanitizeMarkdownV2Props(props, 'caption'));

    public sendVideoNote = async(props: {
        chat_id: number | string;
        video_note: SendFile;
        duration?: number;
        length?: number;
        thumb?: SendFile;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
        __filename?: string;
    }): Promise<Message> => this.request('sendVideoNote', props);

    public sendMediaGroup = async(props: {
        chat_id: number | string;
        media: (InputMediaPhoto | InputMediaVideo)[];
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
    }): Promise<Message> => this.request('sendMediaGroup', props);

    public sendLocation = async(props: {
        chat_id: number | string;
        latitude: number;
        longitude: number;
        horizontal_accuracy?: number;
        live_period?: number;
        heading?: number;
        proximity_alert_radius?: number;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendLocation', props);

    public editMessageLiveLocation = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        latitude: number;
        longitude: number;
        horizontal_accuracy?: number;
        heading?: number;
        proximity_alert_radius?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message> => this.request('editMessageLiveLocation', props);

    public stopMessageLiveLocation = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message> => this.request('stopMessageLiveLocation', props);

    public sendVenue = async(props: {
        chat_id: number | string;
        latitude: number;
        longitude: number;
        title: string;
        address: string;
        foursquare_id?: string;
        foursquare_type?: string;
        google_place_id?: string;
        google_place_tye?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendVenue', props);

    public sendContact = async(props: {
        chat_id: number | string;
        phone_number: string;
        first_name: string;
        last_name?: string;
        vcard?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendContact', props);

    public sendPoll = async(props: {
        chat_id: number | string;
        question: string;
        options: string[];
        is_anonymous?: boolean;
        type?: QuizType;
        allows_multiple_answers?: boolean;
        correct_option_id?: number;
        explanation?: string;
        explanation_parse_mode?: ParseMode;
        explanation_entities?: MessageEntity[];
        open_period?: number;
        close_date?: number;
        is_closed?: boolean;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendPoll', props);

    public sendDice = async(props: {
        chat_id: number | string;
        emoji: string; // "🎲" | "🎯" | "🏀" | "⚽" | "🎰"
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendDice', props);

    public sendChatAction = async(props: {
        chat_id: number | string;
        action: ChatAction;
    }): Promise<true> => this.request('sendChatAction', props);

    public getUserProfilePhotos = async(props: {
        user_id: number;
        offset?: number;
        limit?: number;
    }): Promise<UserProfilePhotos> => this.request('getUserProfilePhotos', props);

    public getFile = async(props: { file_id: string }): Promise<File> => this.request('getFile', props);

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
    // unpinAllChatMessages
    // leaveChat

    public getChat = async(props: {
        chat_id: number | string;
    }): Promise<Chat> => this.request('getChat', props);

    public getChatAdministrators = async(props: {
        chat_id: number | string;
    }): Promise<ChatMember[]> => this.request('getChatAdministrators', props);

    public getChatMembersCount = async(props: {
        chat_id: number | string;
    }): Promise<number> => this.request('getChatMembersCount', props);

    public getChatMember = async(props: {
        chat_id: number | string;
        user_id: number;
    }): Promise<ChatMember> => this.request('getChatMember', props);

    // setChatStickerSet
    // deleteChatStickerSet

    public answerCallbackQuery = async(props: {
        callback_query_id: string;
        text?: string;
        show_alert?: boolean;
        url?: string;
        cache_time?: number;
    }): Promise<true> => this.request('answerCallbackQuery', props);

    public setMyCommands = async(props: {
        commands: BotCommand[];
    }): Promise<true> => this.request('setMyCommands', props);

    public getMyCommands = async(): Promise<BotCommand[]> => this.request('getMyCommands');

    public editMessageText = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        text: string;
        parse_mode?: ParseMode;
        entities?: MessageEntity[];
        disable_web_page_preview?: boolean;
        reply_markup?: Markup;
    }): Promise<Message | true> => this.request('editMessageText', props);

    public editMessageCaption = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        caption: string;
        parse_mode?: ParseMode;
        caption_entities?: MessageEntity[];
        reply_markup?: Markup;
    }): Promise<Message | true> => this.request('editMessageCaption', sanitizeMarkdownV2Props(props, 'caption'));

    public editMessageMedia = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        media?: (InputMediaPhoto | InputMediaVideo)[];
        reply_markup?: InlineKeyboard;
    }): Promise<Message | true> => this.request('editMessageMedia', props);

    public editMessageReplyMarkup = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message | true> => this.request('editMessageReplyMarkup', props);

    public stopPoll = async(props: {
        chat_id: number | string;
        message_id: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Poll> => this.request('stopPoll', props);

    public deleteMessage = async(props: {
        chat_id: number | string;
        message_id: number;
    }): Promise<true> => this.request('deleteMessage', props);

    public sendSticker = async(props: {
        chat_id: number | string;
        sticker: SendFile;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendSticker', props);

    // getStickerSet
    // uploadStickerFile
    // createNewStickerSet
    // addStickerToSet
    // setStickerPositionInSet
    // deleteStickerFromSet
    // setStickerSetThumb

    public answerInlineQuery = async(props: {
        inline_query_id: string;
        results: InlineQueryResult[];
        cache_time?: number;
        is_personal?: boolean;
        next_offset?: string;
        switch_pm_text?: string;
        switch_pm_parameter?: string;
    }): Promise<true> => this.request('answerInlineQuery', props);

    // Payments all
    // Telegram Passport all

    public sendGame = async(props: {
        chat_id: number | string;
        game_short_name: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendGame', props);

    public setGameScore = async(props: {
        user_id: number;
        score: number;
        force?: boolean;
        disable_edit_message?: boolean;
        chat_id?: number | string;
        message_id?: number;
        inline_message_id?: number;
    }): Promise<Message | true> => this.request('setGameScore', props);

    public getGameHighScores = async(props: {
        user_id: number;
        chat_id?: number;
        message_id?: number;
        inline_message_id?: number;
    }): Promise<GameHighScore[]> => this.request('getGameHighScores', props);

    /**
     * Events
     */

    private readonly events: Record<string, Set<Listener>> = {};

    public on: On = (event: MatchType, listener: never): this => {
        if (!this.events[event]) {
            this.events[event] = new Set<Listener>();
        }

        this.events[event].add(listener);

        return this;
    };

    private handleUpdate = (update: Update): void => {
        this.matcher.getMatches(update).forEach(match => {
            this.events[match.type]?.forEach(callback => callback(match.handle(update)));
        });
    };

    /**
     * Polling
     */

    private isPollingActive = false;

    private pollingOffset: number | undefined;

    public startPolling = (): void => {
        if (this.isPollingActive) {
            return;
        }

        this.isPollingActive = true;

        let errorCountInRow = 0;

        (async() => {
            while (this.isPollingActive) {
                try {
                    // eslint-disable-next-line no-await-in-loop
                    await this.poll();

                    errorCountInRow = 0;
                } catch (e) {
                    ++errorCountInRow;

                    if (errorCountInRow > 3) {
                        console.error('3 requests in a row failed. The bot has stopped.');
                        process.exit(5);
                    }
                }
            }
        })();
    };

    public stopPolling = (): void => {
        this.isPollingActive = false;
    };

    private poll = async(): Promise<void> => new Promise<void>(resolve => {
        this.getUpdates({ offset: this.pollingOffset, timeout: 25 })
            .then(response => {
                if (response.length) {
                    this.pollingOffset = response[response.length - 1].update_id + 1;
                }

                resolve();

                response.forEach(this.handleUpdate);
            });
    });
}

export * from './types';
export * from './matcher';
export * from './utils';
