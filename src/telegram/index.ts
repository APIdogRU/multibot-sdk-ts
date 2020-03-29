import * as fs from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import AbstractBot, { IBotPolling } from '../abstract-bot';
import { User, Message, Update, CallbackQuery, Chat, InlineQuery, ChosenInlineResult, Location, WebhookInfo, ParseMode, ChatAction, UserProfilePhotos, File, Markup, ChatMember, InlineQueryResult, GameHighScore, InlineKeyboard, InputMediaVideo, InputMediaPhoto, QuizType, Poll } from './types';
import { TelegramMatcher, MatchType, MatchResultCommand } from './matcher';
import { Listener } from '../utils';

export interface Config {
    secret: string;
    apiUrl?: string;
}

interface On {
    (event: MatchType.Message, listener: Listener<ArgumentMessage>): void;
    (event: MatchType.MessageEdited, listener: Listener<ArgumentMessage>): void;
    (event: MatchType.ChannelPost, listener: Listener<Message>): void;
    (event: MatchType.ChannelPostEdited, listener: Listener<Message>): void;
    (event: MatchType.CallbackQuery, listener: Listener<CallbackQuery>): void;
    (event: MatchType.Exact, listener: Listener<Message>): void;
    (event: MatchType.Command, listener: Listener<MatchResultCommand>): void;
    (event: MatchType.InlineQuery, listener: Listener<InlineQuery>): void;
    (event: MatchType.ChosenInlineResult, listener: Listener<ChosenInlineResult>): void;
    (event: MatchType.Photo | MatchType.Video | MatchType.Audio | MatchType.Voice | MatchType.Animation | MatchType.Sticker, listener: Listener<ArgumentMessageWithFile>): void;
    (event: MatchType.Location, listener: Listener<Location>): void;
}

/**
 * Message argument
 */
export type ArgumentMessage = {
    message: Message;
    sender: User;
    chat: Chat;
};

/**
 * Message argument with file
 */
export interface ArgumentMessageWithFile extends ArgumentMessage {
    getFileUrl(): Promise<string>;
}

export type SendFile = string | Buffer;

export class Bot
    extends AbstractBot<Config, Update>
    implements IBotPolling {

    static readonly defaultConfig: Config = {
        secret: 'never_used',
        apiUrl: 'https://api.telegram.org',
    };

    constructor(config: Config) {
        super();

        if (!config.secret) {
            throw new Error('secret not specified');
        }

        this.config = { ...Bot.defaultConfig, ...config };
        this.setMatcher(new TelegramMatcher(this));
    }

    protected getApiEndpoint = (method: string) => {
        return `${this.config.apiUrl}/bot${this.config.secret}/${method}`;
    };

    private readonly handleMethodsForFiles: Record<string, string | undefined> = {
        'sendPhoto': 'photo',
        'sendAudio': 'audio',
        'sendDocument': 'document',
        'sendSticker': 'sticker',
        'sendVideo': 'video',
        'sendAnimation': 'animation',
        'sendVideoNote': 'video_note',
        'sendVoice': 'voice',
        'setChatPhoto': 'file',
/*        'uploadStickerFile',
        'createNewStickerSet',
        'addStickerToSet',*/
        'sendMediaGroup': undefined
    };

    private handleParamsForFiles = (data: Record<string, unknown>, name: string) => {
        const entry = data[name];

        if (typeof entry === 'string') {
            if (fs.existsSync(entry)) {
                data[name] = fs.createReadStream(entry);
            }
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public request = async<T>(apiMethod: string, params: Record<string, any> = {}) => {
        type Result = {
            ok: boolean;
            result: T;
        };

        if (apiMethod in this.handleMethodsForFiles) {
            this.handleParamsForFiles(params, this.handleMethodsForFiles[apiMethod]);
        }

        const form = Object.keys(params).reduce((form, key) => {
            if (params[key] !== undefined) {
                const v = params[key];
                form.append(key, typeof v === 'object' ? JSON.stringify(v) : v);
            }
            return form;
        }, new FormData());

        const endpoint = this.getApiEndpoint(apiMethod);

        const { data, status, statusText } = await axios.post<Result>(endpoint, form, {
            headers: {
                ...(form.getHeaders())
            }
        });

        if (status !== 200) {
            throw new Error(`Error HTTP ${statusText}`);
        }

        return data.result;
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
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
    }): Promise<Message> => this.request('sendMessage', props);

    public forwardMessage = async(props: {
        chat_id: number | string;
        from_chat_id: number | string;
        message_id: number;
        disable_notification?: boolean;
    }): Promise<Message> => this.request('forwardMessage', props);

    public sendPhoto = async(props: {
        chat_id: number | string;
        caption: string;
        photo: SendFile;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
    }): Promise<Message> => this.request('sendPhoto', props);

    public sendAudio = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        audio: SendFile;
    }): Promise<Message> => this.request('sendAudio', props);

    public sendDocument = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        document: SendFile;
        thumb?: SendFile;
    }): Promise<Message> => this.request('sendDocument', props);

    public sendVideo = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        video: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
        supports_streaming?: boolean;
    }): Promise<Message> => this.request('sendVideo', props);

    public sendAnimation = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        animation: SendFile;
        duration?: number;
        width?: number;
        height?: number;
        thumb?: SendFile;
    }): Promise<Message> => this.request('sendAnimation', props);

    public sendVoice = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        voice: SendFile;
        duration?: number;
    }): Promise<Message> => this.request('sendVoice', props);

    public sendVideoNote = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        video_note: SendFile;
        duration?: number;
        length?: number;
        thumb?: SendFile;
    }): Promise<Message> => this.request('sendVideoNote', props);

    public sendMediaGroup = async(props: {
        chat_id: number | string;
        media: (InputMediaPhoto | InputMediaVideo)[];
    }): Promise<Message> => this.request('sendMediaGroup', props);

    public sendLocation = async(props: {
        chat_id: number | string;
        caption?: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        latitude: number;
        longitude: number;
        live_period?: number;
    }): Promise<Message> => this.request('sendLocation', props);

    public editMessageLiveLocation = async(props: {
        chat_id: number | string;
        message_id?: number;
        inline_message_id?: number;
        latitude: number;
        longitude: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message> => this.request('editMessageLiveLocation', props);

    public stopMessageLiveLocation = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        message_id?: number;
        inline_message_id?: number;
        reply_markup?: InlineKeyboard;
    }): Promise<Message> => this.request('stopMessageLiveLocation', props);

    public sendVenue = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        latitude: number;
        longitude: number;
        title: string;
        address: string;
        foursquare_id?: string;
        foursquare_type?: string;
    }): Promise<Message> => this.request('sendVenue', props);

    public sendContact = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        phone_number: string;
        first_name: string;
        last_name?: string;
        vcard?: string;
    }): Promise<Message> => this.request('sendContact', props);

    public sendPoll = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        question: string;
        options: string[];
        is_anonymous?: boolean;
        type?: QuizType;
        allows_multiple_answers?: boolean;
        correct_option_id?: number;
        is_closed?: boolean;
    }): Promise<Message> => this.request('sendPoll', props);

    // ...

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

    // ...

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

    // ...

    public answerCallbackQuery = async(props: {
        callback_query_id: string;
        text?: string;
        show_alert?: boolean;
        url?: string;
        cache_time?: number;
    }): Promise<true> => this.request('answerCallbackQuery', props);

    public editMessageText = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        message_id?: number;
        inline_message_id?: number;
        text: string;
    }): Promise<Message | true> => this.request('editMessageText', props);

    public editMessageCaption = async(props: {
        chat_id: number | string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
        message_id?: number;
        inline_message_id?: number;
        caption: string;
    }): Promise<Message | true> => this.request('editMessageCaption', props);

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
        sticker: string;
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Markup;
    }): Promise<Message> => this.request('sendSticker', props);

    // ...

    public answerInlineQuery = async(props: {
        inline_query_id: string;
        results: InlineQueryResult[];
        cache_time?: number;
        is_personal?: boolean;
        next_offset?: string;
        switch_pm_text?: string;
        switch_pm_parameter?: string;
    }): Promise<true> => this.request('answerInlineQuery', props);

    public sendGame = async(props: {
        chat_id: number | string;
        game_short_name: string;
    }): Promise<Message> => this.request('sendGame', props);

    public setGameScore = async(props: {
        chat_id: number | string;
        user_id: number;
        score: number;
        force?: boolean;
        disable_edit_message?: boolean;
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

    private readonly events: Record<string, Listener[]> = {};

    public on: On = (event: MatchType, listener: never) => {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(listener);
    };

    private handleUpdate = (update: Update) => {
        this.matcher.getMatches(update).forEach(match => {
            this.events[match.type]?.forEach(callback => callback(match.handle(update)));
        });
    };

    /**
     * Polling
     */
    private isPollingActive = false;
    private pollingOffset: number | undefined;

    public startPolling = () => {
        if (this.isPollingActive) {
            return;
        }

        this.isPollingActive = true;

        (async() => {
            while (this.isPollingActive) {
                await this.poll();
            }
        })();
    };

    public stopPolling = () => {
        this.isPollingActive = false;
    };

    private poll = async() => new Promise(resolve => {
        this.getUpdates({
            offset: this.pollingOffset
        }).then(response => {
            if (response.length) {
                this.pollingOffset = response[response.length - 1].update_id + 1;
            }

            resolve();

            response.forEach(this.handleUpdate);
        });
    });

}

export { ParseMode } from './types/send';
export * from './matcher';
export * from './utils';
