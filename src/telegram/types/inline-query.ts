import { Location, User, InlineKeyboard } from '.';
import { MessageEntity } from './message';
import { ParseMode } from './send';

export interface InlineQuery {
    id: string;
    from: User;
    location?: Location;
    query: string;
    offset: string;
}

export interface InlineQueryResultBase {
    id: string;
    reply_markup?: InlineKeyboard;
}

export interface InlineQueryResultArticle extends InlineQueryResultBase {
    type: 'article';
    title: string;
    input_message_content: InputMessageContent;
    url?: string;
    hide_url?: boolean;
    description?: string;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
}

export interface InlineQueryResultPhoto extends InlineQueryResultBase {
    type: 'photo';
    photo_url: string;
    thumb_url: string;
    photo_width?: number;
    photo_height?: number;
    title?: string;
    description?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultGif extends InlineQueryResultBase {
    type: 'gif';
    gif_url: string;
    gif_width?: number;
    gif_height?: number;
    gif_duration?: number;
    thumb_url?: string;
    title?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultMpeg4Gif extends InlineQueryResultBase {
    type: 'mpeg4_gif';
    mpeg4_url: string;
    mpeg4_width?: number;
    mpeg4_height?: number;
    mpeg4_duration?: number;
    thumb_url?: string;
    title?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultVideo extends InlineQueryResultBase {
    type: 'video';
    video_url: string;
    mime_type: string;
    thumb_url: string;
    title: string;
    caption?: string;
    video_width?: number;
    video_height?: number;
    video_duration?: number;
    description?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultAudio extends InlineQueryResultBase {
    type: 'audio';
    audio_url: string;
    title: string;
    caption?: string;
    performer?: string;
    audio_duration?: number;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultVoice extends InlineQueryResultBase {
    type: 'voice';
    voice_url: string;
    title: string;
    caption?: string;
    voice_duration?: number;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultDocument extends InlineQueryResultBase {
    type: 'document';
    title: string;
    caption?: string;
    document_url: string;
    mime_type: string;
    description?: string;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
}

export interface InlineQueryResultLocationBase extends InlineQueryResultBase {
    latitude: number;
    longitude: number;
    title: string;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
}

export interface InlineQueryResultLocation extends InlineQueryResultLocationBase {
    type: 'location';
}

export interface InlineQueryResultVenue extends InlineQueryResultLocationBase {
    type: 'venue';
    address: string;
    foursquare_id?: string;
}

export interface InlineQueryResultContact extends InlineQueryResultBase {
    type: 'contact';
    phone_number: string;
    first_name: string;
    last_name?: string;
    input_message_content?: InputMessageContent;
    thumb_url?: string;
    thumb_width?: number;
    thumb_height?: number;
}

export interface InlineQueryResultGame extends InlineQueryResultBase {
    type: 'game';
    game_short_name: string;
}

export interface InlineQueryResultCachedPhoto extends InlineQueryResultBase {
    type: 'photo';
    photo_file_id: string;
    title?: string;
    description?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedGif extends InlineQueryResultBase {
    type: 'gif';
    gif_file_id: string;
    title?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedMpeg4Gif extends InlineQueryResultBase {
    type: 'mpeg4_gif';
    mpeg4_file_id: string;
    title?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedSticker extends InlineQueryResultBase {
    type: 'sticker';
    sticker_file_id: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedDocument extends InlineQueryResultBase {
    type: 'document';
    title: string;
    document_file_id: string;
    description?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVideo extends InlineQueryResultBase {
    type: 'video';
    video_file_id: string;
    title: string;
    description?: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVoice extends InlineQueryResultBase {
    type: 'voice';
    voice_file_id: string;
    title: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedAudio extends InlineQueryResultBase {
    type: 'audio';
    audio_file_id: string;
    caption?: string;
    input_message_content?: InputMessageContent;
}

export type InputTextMessageContent = {
    message_text: string;
    parse_mode?: ParseMode;
    entities?: MessageEntity[];
    disable_web_page_preview?: boolean;
};

export type InputLocationMessageContent = {
    latitude: number;
    longitude: number;
    horizontal_accuracy?: number;
    live_period?: number;
    heading?: number;
    proximity_alert_radius?: number;
};

export type InputVenueMessageContent = {
    latitude: number;
    longitude: number;
    title: string;
    address: string;
    foursquare_id?: string;
    foursquare_type?: string;
    google_place_id?: string;
    google_place_type?: string;
};

export type InputContactMessageContent = {
    phone_number: string;
    first_name: string;
    last_name?: string;
    vcard?: string;
};

export type InputMessageContent = 
    | InputTextMessageContent
    | InputLocationMessageContent
    | InputVenueMessageContent
    | InputContactMessageContent;

export type InlineQueryResult =
    | InlineQueryResultCachedAudio
    | InlineQueryResultCachedDocument
    | InlineQueryResultCachedGif
    | InlineQueryResultCachedMpeg4Gif
    | InlineQueryResultCachedPhoto
    | InlineQueryResultCachedSticker
    | InlineQueryResultCachedVideo
    | InlineQueryResultCachedVoice
    | InlineQueryResultArticle
    | InlineQueryResultAudio
    | InlineQueryResultContact
    | InlineQueryResultGame
    | InlineQueryResultDocument
    | InlineQueryResultGif
    | InlineQueryResultLocation
    | InlineQueryResultMpeg4Gif
    | InlineQueryResultPhoto
    | InlineQueryResultVenue
    | InlineQueryResultVideo
    | InlineQueryResultVoice;
