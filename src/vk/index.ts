import AbstractBot, { IBotPolling } from '../abstract-bot';
import * as FormData from 'form-data';
import axios from 'axios';
import { Config, LongPollProps, Request, UpdateWrap, Update, Message, User, ClientInfo } from './types';
import { VkMatcher, MatchType } from './matcher';
import { Listener } from '../utils';

type ArgumentListener = {
    message: Message;
    getSender: () => Promise<User>;
    capability?: ClientInfo;
};

interface On {
    (event: MatchType.Message, listener: Listener<ArgumentListener & { capability?: ClientInfo }>): void;
    (event: MatchType.MessageOut, listener: Listener<ArgumentListener>): void;
    (event: MatchType.MessageEdit, listener: Listener<ArgumentListener>): void;
    (event: MatchType.MessageAllow, listener: Listener<Message>): void;
    (event: MatchType.MessageDeny, listener: Listener<Message>): void;
}

export class Bot
    extends AbstractBot<Config, Update>
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
        this.setMatcher(new VkMatcher(this));
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
        form.append('lang', this.config.lang ?? 'en');

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
        return (await axios.get<UpdateWrap>(this.getLongPollUrl())).data;
    };

    private poll = async() => new Promise(resolve => {
        this.waitForResponseLongPoll().then(response => {
            this.server.ts = response.ts;

            resolve();

            response.updates.forEach(this.handleUpdate);
        });
    });

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

    public stopPolling = () => {
        this.isPollingActive = false;
    };
}

export * from './matcher';
export * from './utils';
