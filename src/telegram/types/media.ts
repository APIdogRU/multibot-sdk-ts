import { MessageEntity } from './message';
import { ParseMode } from './send';

export interface FileBase {
    file_id: string;
    file_size?: number;
}

export interface File extends FileBase {
    file_path?: string;
}

export interface PhotoSize extends FileBase {
    width: number;
    height: number;
}

export interface Audio extends FileBase {
    duration: number;
    performer?: string;
    title?: string;
    mime_type?: string;
    thumb?: PhotoSize;
}

export interface Document extends FileBase {
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
}

export interface Video extends FileBase {
    width: number;
    height: number;
    duration: number;
    thumb?: PhotoSize;
    mime_type?: string;
}

export interface Voice extends FileBase {
    duration: number;
    mime_type?: string;
}

export interface Contact {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
    vcard?: string;
}

export interface Location {
    longitude: number;
    latitude: number;
}

export interface Venue {
    location: Location;
    title: string;
    address: string;
    foursquare_id?: string;
    foursquare_type?: string;
}

export interface PollOption {
    text: string;
    voter_count: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    is_closed: boolean;
}

export interface Sticker {
    file_id: string;
    width: number;
    height: number;
    thumb?: PhotoSize;
    emoji?: string;
    set_name?: string;
    file_size?: number;
}

export interface Game {
    title: string;
    description: string;
    photo: PhotoSize[];
    text?: string;
    text_entities?: MessageEntity[];
    animation?: Animation;
}

export interface Animation extends FileBase {
    width: number;
    height: number;
    duration: number;
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
}

export interface InputMediaBase {
    media: string;
    caption?: string;
    parse_mode?: ParseMode;
}

export interface InputMediaPhoto extends InputMediaBase {
    type: 'photo';
}

export interface InputMediaVideo extends InputMediaBase {
    type: 'video';
    width?: number;
    height?: number;
    duration?: number;
    supports_streaming?: boolean;
}

export type QuizType = 'quiz' | 'regular';
