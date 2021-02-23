import { MessageEntity, ParseMode } from '.';
import { User } from './user';

export interface FileBase {
    file_id: string;
    file_unique_id: string;
    file_size?: number;
}

export interface File extends FileBase {
    file_path?: string;
}

export type Photo = PhotoSize[];

export interface PhotoSize extends FileBase {
    width: number;
    height: number;
}

export interface Video extends FileBase {
    width: number;
    height: number;
    duration: number;
    thumb?: PhotoSize;
    mime_type?: string;
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

export interface Voice extends FileBase {
    duration: number;
    mime_type?: string;
}

export interface VideoNote extends FileBase {
    length: number;
    duration: number;
    thumb?: PhotoSize;
}

export interface Animation extends FileBase {
    width: number;
    height: number;
    duration: number;
    thumb?: PhotoSize;
    file_name?: string;
    mime_type?: string;
}

export interface Sticker {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    is_animated: boolean;
    thumb?: PhotoSize;
    emoji?: string;
    set_name?: string;
    file_size?: number;
}

export interface Location {
    longitude: number;
    latitude: number;
    horizontal_accuracy?: number;
    live_period?: number;
    heading?: number;
    proximity_alert_radius?: number;
}

export interface Venue {
    location: Location;
    title: string;
    address: string;
    foursquare_id?: string;
    foursquare_type?: string;
    google_place_id?: string;
    google_place_type?: string;
}

export interface Contact {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
    vcard?: string;
}

export interface PollOption {
    text: string;
    voter_count: number;
}

export interface PollAnswer {
    poll_id: string;
    user: User;
    option_ids: number[];
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    total_voter_count: number;
    is_closed: boolean;
    is_anonymous: boolean;
    type: QuizType;
    allows_multiple_answers?: boolean;
    correct_option_id?: number;
    explanation?: string;
    explanation_entities?: MessageEntity[];
    open_period?: number;
    close_date?: number;
}

export interface Game {
    title: string;
    description: string;
    photo: PhotoSize[];
    text?: string;
    text_entities?: MessageEntity[];
    animation?: Animation;
}

export interface GameHighScore {
    position: number;
    user: User;
    score: number;
}

export type Media = Photo | PhotoSize | Video | Audio | Document | Animation | Voice | Sticker | Location | Venue | Contact | Poll | Game;

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

export interface InputMediaAudio extends InputMediaBase {
    type: 'audio';
    thumb: string;
    duration?: number;
    performer?: number;
    title?: string;
}

export interface InputMediaDocument extends InputMediaBase {
    type: 'document';
    thumb: string;
}

export interface InputMediaAnimation extends InputMediaBase {
    type: 'animation';
    thumb: string;
    width?: number;
    height?: number;
    duration?: number;
}

export type QuizType = 'quiz' | 'regular';

export type Dice = {
    emoji: string;
    value: number;
};

export type ProximityAlertTriggered = {
    traveler: User;
    watcher: User;
    distance: number;
};
