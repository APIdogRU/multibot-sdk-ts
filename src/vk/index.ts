import AbstractBot, { IBotPolling, Listener } from '../abstract-bot';
import * as FormData from 'form-data';
import axios from 'axios';
import { Config, LongPollProps, Request, Update, UpdateItem, Message, User, ClientInfo, UserFieldExtra } from './types';
import { getSender } from './utils';

export const enum Event {
    Message = 'message',
    MessageOut = 'message-reply',
    MessageUpdate = 'message-update',
    MessageAllow = 'message-allow',
    MessageDeny = 'message-deny'
}

type ArgumentListener = {
    message: Message;
    getSender: () => Promise<User>;
    capability?: ClientInfo;
};

interface EventListener {
    (event: Event.Message, listener: Listener<ArgumentListener & { capability?: ClientInfo }>): void;
    (event: Event.MessageOut, listener: Listener<ArgumentListener>): void;
    (event: Event.MessageUpdate, listener: Listener<ArgumentListener>): void;
    (event: Event.MessageAllow, listener: Listener<Message>): void;
    (event: Event.MessageDeny, listener: Listener<Message>): void;
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
                let v = params[key];
                if (Array.isArray(v)) {
                    v = v.join(',');
                }
                if (typeof v !== 'string') {
                    v = JSON.stringify(v);
                }
                form.append(key, v);
            }
            return form;
        }, new FormData());

        form.append('access_token', this.config.token);
        form.append('v', this.config.apiVersion);
console.log(form);
        const endpoint = this.getApiEndpoint(apiMethod);

        const { data, status, statusText } = await axios.post<Response>(endpoint, form, {
            headers: {
                ...(form.getHeaders())
            }
        });
console.log(data);
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
            case 'message_new': {
                const args: Partial<ArgumentListener> = { };
                const object = update.object;

                if ('message' in object) {
                    args.message = object.message;
                    args.capability = object.client_info;
                } else {
                    args.message = object;
                }

                args.getSender = async(fields: UserFieldExtra[] = []) => getSender(this, args.message, fields);

                this.emit(Event.Message, args);
                break;
            }

            case 'message_reply': {
                this.emit(Event.MessageOut, update.object);
                break;
            }

            case 'message_edit': {
                this.emit(Event.MessageUpdate, update.object);
                break;
            }

            case 'message_allow': {
                this.emit(Event.MessageAllow, update.object);
                break;
            }

            case 'message_deny': {
                this.emit(Event.MessageDeny, update.object);
                break;
            }
        }
    };

    public stopPolling = () => {
        this.isPollingActive = false;
    };
}

export * from './utils';
