export interface Message {
    id: number;
    date: number;
    peer_id: number;
    from_id: number;
    out: number;
    text: string;
    conversation_message_id: number;
    fwd_messages: Record<string, unknown>[]; // todo
    geo?: Record<string, unknown>; // todo
    random_id?: number;
    important: boolean;
    attachments: Record<string, unknown>[]; // todo
    admin_author_id?: number;
    is_hidden?: boolean;
}
