import { Markup } from '.';

export type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML';

export type BaseOption = {
    chat_id: number | string;
}

export interface SendExtraOptions {
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: Markup;
}

export interface SendMessageOptions extends SendExtraOptions {
    parse_mode?: ParseMode;
    disable_web_page_preview?: boolean;
}

export interface SendMediaOptions extends SendMessageOptions {
    caption?: string;
}

export interface SendAudioOptions extends SendMediaOptions {
    duration?: number;
    performer?: string;
    title?: string;
}

export type SendDocumentOptions = SendMediaOptions;

export type ChatAction = 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_audio' | 'upload_audio' | 'upload_document' | 'find_location' | 'record_video_note' | 'upload_video_note';
