export interface Message {
    id: number;
    date: number;
    peer_id: number;
    from_id: number;
    out: number;
    text: string;
    conversation_message_id: number;
    fwd_messages: object[];
    geo?: object;
    random_id?: number;
    important: boolean;
    attachments: object[];
    admin_author_id?: number;
    is_hidden?: boolean;
}
