import { User, UserDefaultKeys, UserNameCase } from './user';
import { Message } from './message';
import { Keyboard } from './keyboard';

export interface Config {
    token: string;
    groupId: number;
    apiUrl?: string;
    apiVersion?: string;
}

export type SendFile = string | Buffer;

export interface Request {
    (method: 'users.get', params: {
        user_ids: number | number[] | string | string[];
        fields?: Exclude<keyof User, UserDefaultKeys>[];
        name_case?: UserNameCase;
    }): Promise<User[]>;

    (method: 'groups.getLongPollServer', params: {
        group_id: number;
    }): Promise<LongPollProps>;

    (method: 'messages.send', params: {
        peer_id: number;
        message?: string;
        attachmnt?: string | string[];
        reply_to?: number;
        forward_messaes?: number | number[] | string;
        sticker_id?: number;
        keyboard?: Keyboard;
        payload?: string;
        dont_parse_links?: 1 | 0;
        disable_mentions?: 1 | 0;
    }): Promise<number>;

    (method: 'messages.edit', params: {
        peer_id: number;
        message_id: number;
        message?: string;
        attachmnt?: string | string[];
        keep_forward_messages?: 1 | 0;
        keep_snippets?: 1 | 0;
    }): Promise<1>;

    (method: 'messages.markAsRead', params: {
        message_ids?: number | number[];
        peer_id?: number;
        start_message_id?: number;
    }): Promise<1>;
}

export interface ApiError {
    error_code: number;
    error_message: string;
    request_params: object[];
}

export interface Update {
    ts: string;
    updates: UpdateItem[];
}

export type UpdateItem = UpdateMessageNew
    | UpdateMessageNewLegacy
    | UpdateMessageReply
    | UpdateMessageEdit
    | UpdateMessageAllow
    | UpdateMessageDeny;

interface UpdateAbsItem<E extends string, T> {
    type: E;
    object: T;
    group_id: number;
    event_id: string;
}

export type UpdateMessageNew = UpdateAbsItem<'message_new', {
    message: Message;
    client_info: ClientInfo;
}>;
export type ClientInfo = {
    button_actions: ('text' | 'vkpay' | 'open_app' | 'location' | 'open_link')[];
    keyboard: boolean;
    inline_keyboard: boolean;
    carousel: boolean;
    lang_id: number;
};
export type UpdateMessageNewLegacy = UpdateAbsItem<'message_new', Message>;
export type UpdateMessageReply = UpdateAbsItem<'message_reply', Message>;
export type UpdateMessageEdit = UpdateAbsItem<'message_edit', Message>;
export type UpdateMessageAllow = UpdateAbsItem<'message_allow', {
    user_id: number;
    key: string;
}>;
export type UpdateMessageDeny = UpdateAbsItem<'message_deny', {
    user_id: number;
}>;

export type LongPollProps = {
    ts: string;
    key: string;
    server: string;
};
