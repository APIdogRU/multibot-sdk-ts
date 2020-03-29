import * as fs from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import AbstractBot, { IBotPolling } from '../abstract-bot';
import { Config, Request, User, Message, Update, CallbackQuery, Chat, InlineQuery, ChosenInlineResult, Location } from './types';
import { TelegramMatcher, MatchType, MatchResultCommand } from './matcher';
import { Listener } from '../utils';

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
