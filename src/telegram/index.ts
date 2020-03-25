import * as fs from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import AbstractBot, { IBotPolling, Listener } from '../abstract-bot';
import { Update, CallbackQuery } from './types/common';
import { Message } from './types/message';
import { User } from './types/user';
import { Config, Request } from './types/api';

const enum EventType {
    Message = 'message',
    MessageUpdate = 'message-update',
    MessageDelete = 'message-delete',
    CallbackQuery = 'callback-query'
}

interface EventListener {
    (event: EventType.Message, listener: EventArgumentMessage): void;
    (event: EventType.MessageUpdate, listener: EventArgumentMessage): void;
    (event: EventType.MessageDelete, listener: Listener<Message>): void;
    (event: EventType.CallbackQuery, listener: Listener<CallbackQuery>): void;
}

/**
 * Message argument
 */
export type ArgumentMessage = {
    message: Message;
    user: User;
};

/**
 * Message listener
 */
export type EventArgumentMessage = Listener<ArgumentMessage>;

export class TelegramBot
    extends AbstractBot<Config, EventType, EventListener>
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

        this.config = { ...TelegramBot.defaultConfig, ...config };
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

    /**
     *
     */
    private handleUpdate = (update: Update) => {
        if (update.message) {
            this.handleMessage(update.message);
        }

        if (update.callback_query) {
            this.handleCallbackQuery(update.callback_query);
        }
    };

    private handleMessage = (message: Message) => {
        const arg: ArgumentMessage = {
            message,
            user: message.from,
        };

        this.emit(EventType.Message, arg);
    };

    private handleCallbackQuery = (query: CallbackQuery) => {
        this.emit(EventType.CallbackQuery, query);
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
