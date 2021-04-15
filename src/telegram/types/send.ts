import { Markup } from '.';

export const enum ParseMode {
    Markdown = 'Markdown',
    MarkdownV2 = 'MarkdownV2',
    HTML = 'HTML',
}

export type BaseOption = {
    chat_id: number | string;
};

export type SendExtraOptions = {
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: Markup;
};

export interface SendMessageOptions extends SendExtraOptions {
    parse_mode?: ParseMode;
    disable_web_page_preview?: boolean;
}

export type ChatAction = 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_audio' | 'upload_audio' | 'upload_document' | 'find_location' | 'record_video_note' | 'upload_video_note';

export type BotCommand = {
    command: string;
    description: string;
};
