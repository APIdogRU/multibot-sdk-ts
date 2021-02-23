import { User, Chat, Markup, PhotoSize, Video, Audio, Document, Animation, Voice, Sticker, Location, Venue, Contact, Poll, Game, Dice, ProximityAlertTriggered } from '.';

export interface Message {
    message_id: number;
    from: User;
    sender_chat?: Chat;
    date: number;
    chat: Chat;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_signature?: string;
    forward_sender_name?: string;
    forward_date?: number;
    reply_to_message?: Message;
    reply_markup?: Markup;
    via_bot?: User;
    edit_date?: number;

    media_group_id?: string;
    author_signature?: string;
    text?: string;
    entities?: MessageEntity[];

    caption?: string;
    caption_entities?: MessageEntity[];
    photo?: PhotoSize[];
    video?: Video;
    audio?: Audio;
    document?: Document;
    animation?: Animation;
    voice?: Voice;
    sticker?: Sticker;
    location?: Location;
    venue?: Venue;
    contact?: Contact;
    poll?: Poll;
    game?: Game;
    dice?: Dice;
    proximity_alert_triggered?: ProximityAlertTriggered;

    new_chat_members?: User[];
    left_chat_member?: User;
    new_chat_title?: string;
    new_chat_photo?: PhotoSize[];
    delete_chat_photo?: boolean;
    group_chat_created?: boolean;
    connected_website?: string;
}

export interface MessageEntity {
    type: MessageEntityType;
    offset: number;
    length: number;
    url?: string;
    user?: User;
    language?: string;
}

export interface MessageEntityWithText extends MessageEntity {
    text: string;
}

export type MessageEntityType = 'mention' | 'hashtag' | 'cashtag' | 'bot_command' | 'url' | 'email' | 'phone_number' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'pre' | 'text_link' | 'text_mention';
