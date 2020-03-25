import * as fs from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import AbstractBot, { IBotPolling, Listener } from '../abstract-bot';
import { Config, Request, User, Message, Update, CallbackQuery, AllowedUpdate, Chat, InlineQuery, ChosenInlineResult } from './types';
import { fastReply } from './utils';

export const enum Event {
    Message = 'message',
    MessageEdited = 'message-edited',

    ChannelPost = 'channel-post',
    ChannelPostEdited = 'channel-post-edited',

    CallbackQuery = 'callback-query',
    InlineQuery = 'inline-query',
    ChosenInlineResult = 'chosen-inline-result'
}

interface EventListener {
    (event: Event.Message, listener: Listener<ArgumentMessage>): void;
    (event: Event.MessageEdited, listener: Listener<ArgumentMessage>): void;
    (event: Event.ChannelPost, listener: Listener<ArgumentMessage>): void;
    (event: Event.ChannelPostEdited, listener: Listener<ArgumentMessage>): void;
    (event: Event.CallbackQuery, listener: Listener<CallbackQuery>): void;
    (event: Event.InlineQuery, listener: Listener<InlineQuery>): void;
    (event: Event.ChosenInlineResult, listener: Listener<ChosenInlineResult>): void;
}

/**
 * Message argument
 */
export type ArgumentMessage = {
    message: Message;
    sender: User;
    chat: Chat;
    fastReply: (text: string) => void;
};

export class Bot
    extends AbstractBot<Config, Event, EventListener>
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
    public request: Request = async<T>(apiMethod: string, params: Record<string, any> = {}) => {
        type Result = {
            ok: boolean;
            result: T;
        };

        if (apiMethod in this.handleMethodsForFiles) {
            this.handleParamsForFiles(params, this.handleMethodsForFiles[apiMethod]);
        }

        const form = Object.keys(params).reduce((form, key) => {
            if (params[key] !== undefined) {
                form.append(key, params[key]);
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

    private readonly handleEventWith: Record<AllowedUpdate, Event> = {
        message: Event.Message,
        edited_message: Event.MessageEdited,
        channel_post: Event.ChannelPost,
        edited_channel_post: Event.ChannelPostEdited,
        inline_query: Event.InlineQuery,
        callback_query: Event.CallbackQuery,
        chosen_inline_result: Event.ChosenInlineResult,
    };

    /**
     *
     */
    private handleUpdate = (update: Update) => {
        const type = Object.keys(update).filter(v => v !== 'update_id')[0] as AllowedUpdate;
        const eventType = this.handleEventWith[type];

        switch (eventType) {
            case Event.Message:
            case Event.MessageEdited:
            case Event.ChannelPost:
            case Event.ChannelPostEdited: {
                const message = update[type] as Message;
                this.emit(eventType, {
                    message,
                    sender: message.from,
                    chat: message.chat,
                    fastReply: text => fastReply(this, message, text),
                } as ArgumentMessage);
                break;
            }

            case Event.CallbackQuery: {
                this.emit(Event.CallbackQuery, update.callback_query);
                break;
            }

            case Event.InlineQuery: {
                this.emit(Event.InlineQuery, update.inline_query);
                break;
            }
        }
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
        this.request('getUpdates', {
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

export * from './utils';
