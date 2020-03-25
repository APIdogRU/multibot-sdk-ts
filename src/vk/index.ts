import AbstractBot, { IBotPolling, Listener } from '../abstract-bot';
import * as FormData from 'form-data';
import axios from 'axios';
import { Config, LongPollProps, Request, Update, UpdateItem, Message } from './types';

export const enum Event {
    Message = 'message',
    MessageUpdate = 'message-update',
    MessageDelete = 'message-delete'
}

interface EventListener {
    (event: Event.Message, listener: Listener<Message>): void;
    (event: Event.MessageUpdate, listener: Listener<Message>): void;
    (event: Event.MessageDelete, listener: Listener<Message>): void;
}

export class Bot
    extends AbstractBot<Config, Event, EventListener>
    implements IBotPolling {

    static readonly defaultConfig: Config = {
        token: 'never_used',
        groupId: 0,
        apiUrl: 'https://api.vk.com/method',
        apiVersion: '5.103',
    };

    private server?: LongPollProps = undefined;

    constructor(config: Config) {
        super();

        if (!config.token) {
            throw new Error('token not specified');
        }

        if (config.groupId <= 0) {
            throw new Error('groupId must be positive');
        }

        this.config = { ...Bot.defaultConfig, ...config };
    }

    protected getApiEndpoint = (method: string) => `${this.config.apiUrl}/${method}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public request: Request = async<T>(apiMethod: string, params: Record<string, any> = {}): Promise<T> => {
        type Response = { response: T };

        const form = Object.keys(params).reduce((form, key) => {
            if (params[key] !== undefined) {
                form.append(key, params[key]);
            }
            return form;
        }, new FormData());

        form.append('access_token', this.config.token);
        form.append('v', this.config.apiVersion);

        const endpoint = this.getApiEndpoint(apiMethod);

        const { data, status, statusText } = await axios.post<Response>(endpoint, form, {
            headers: {
                ...(form.getHeaders())
            }
        });

        if (status !== 200) {
            throw new Error(`Error HTTP ${statusText}`);
        }

        return data.response;
    };

    /**
     * Polling
     */
    private isPollingActive = false;
    private getLongPollServer = async(): Promise<LongPollProps> => {
        return this.request('groups.getLongPollServer', { group_id: this.config.groupId });
    };

    public startPolling = async() => {
        if (this.isPollingActive) {
            return;
        }

        this.isPollingActive = true;
        this.server = await this.getLongPollServer();
        console.log('poll', this.server);
        (async() => {
            while (this.isPollingActive) {
                await this.poll();
            }
        })();
    }

    private getLongPollUrl = () => {
        const { server, key, ts } = this.server;
        return `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`
    };

    private waitForResponseLongPoll = async() => {
        return (await axios.get<Update>(this.getLongPollUrl())).data;
    };

    private poll = async() => new Promise(resolve => {
        this.waitForResponseLongPoll().then(response => {
            this.server.ts = response.ts;

            resolve();

            response.updates.forEach(this.handleUpdate);
        });
    });

    private handleUpdate = (update: UpdateItem) => {
        switch (update.type) {
            case 'message_new':
            case 'message_reply':
                this.emit(Event.Message, update.object);
                break;

            case 'message_edit':
                this.emit(Event.MessageUpdate, update.object);
                break;
        }
    };

    public stopPolling = () => {
        this.isPollingActive = false;
    }
}

export * from './utils';
