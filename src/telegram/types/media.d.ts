import { MessageEntity } from './message';
import { ParseMode } from './send';

declare namespace TelegramBot {
    interface FileBase {
        file_id: string;
        file_size?: number;
    }

    interface File extends FileBase {
        file_path?: string;
    }

    interface PhotoSize extends FileBase {
        width: number;
        height: number;
    }

    interface Audio extends FileBase {
        duration: number;
        performer?: string;
        title?: string;
        mime_type?: string;
        thumb?: PhotoSize;
    }

    interface Document extends FileBase {
        thumb?: PhotoSize;
        file_name?: string;
        mime_type?: string;
    }

    interface Video extends FileBase {
        width: number;
        height: number;
        duration: number;
        thumb?: PhotoSize;
        mime_type?: string;
    }

    interface Voice extends FileBase {
        duration: number;
        mime_type?: string;
    }

    interface Contact {
        phone_number: string;
        first_name: string;
        last_name?: string;
        user_id?: number;
        vcard?: string;
    }

    interface Location {
        longitude: number;
        latitude: number;
    }

    interface Venue {
        location: Location;
        title: string;
        address: string;
        foursquare_id?: string;
        foursquare_type?: string;
    }

    interface PollOption {
        text: string;
        voter_count: number;
    }

    interface Poll {
        id: string;
        question: string;
        options: PollOption[];
        is_closed: boolean;
    }

    interface Sticker {
        file_id: string;
        width: number;
        height: number;
        thumb?: PhotoSize;
        emoji?: string;
        set_name?: string;
        file_size?: number;
    }

    interface Game {
        title: string;
        description: string;
        photo: PhotoSize[];
        text?: string;
        text_entities?: MessageEntity[];
        animation?: Animation;
    }

    interface Animation extends FileBase {
        width: number;
        height: number;
        duration: number;
        thumb?: PhotoSize;
        file_name?: string;
        mime_type?: string;
    }

    interface InputMediaBase {
        media: string;
        caption?: string;
        parse_mode?: ParseMode;
    }

    interface InputMediaPhoto extends InputMediaBase {
        type: 'photo';
    }

    interface InputMediaVideo extends InputMediaBase {
        type: 'video';
        width?: number;
        height?: number;
        duration?: number;
        supports_streaming?: boolean;
    }

    type QuizType = 'quiz' | 'regular';
}

export = TelegramBot;
