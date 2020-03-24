declare namespace TelegramBot {
    type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML';

    type BaseOption = {
        chat_id: number | string;
    }

    interface SendExtraOptions {
        disable_notification?: boolean;
        reply_to_message_id?: number;
        reply_markup?: Keyboard;
    }

    interface SendMessageOptions extends SendExtraOptions {
        parse_mode?: ParseMode;
        disable_web_page_preview?: boolean;
    }

    interface SendMediaOptions extends SendMessageOptions {
        caption?: string;
    }

    interface SendAudioOptions extends SendMediaOptions {
        duration?: number;
        performer?: string;
        title?: string;
    }

    type SendDocumentOptions = SendMediaOptions;

    type ChatAction = 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_audio' | 'upload_audio' | 'upload_document' | 'find_location' | 'record_video_note' | 'upload_video_note';
}

export = TelegramBot;
