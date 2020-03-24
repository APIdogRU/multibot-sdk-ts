import { Message } from './message';
import { InlineQuery } from './inline-query';
import { User } from './user';
import { Location } from './media';

declare namespace TelegramBot {
    interface WebhookInfo {
        url: string;
        has_custom_certificate: boolean;
        pending_update_count: number;
        last_error_date: number;
        last_error_message: string;
        nax_connections: number;
        allowed_updated?: (Exclude<keyof Update, 'update_id'>)[];
    }

    interface Update {
        update_id: number;
        message?: Message;
        edited_message?: Message;
        channel_post?: Message;
        edited_channel_post?: Message;
        inline_query?: InlineQuery;
        chosen_inline_result?: ChosenInlineResult;
        callback_query?: CallbackQuery;
    }

    interface ChosenInlineResult {
        result_id: string;
        from: User;
        location?: Location;
        inline_message_id?: string;
        query: string;
    }

    interface CallbackQuery {
        id: string;
        from: User;
        message?: Message;
        inline_message_id?: string;
        chat_instance: string;
        data?: string;
        game_short_name?: string;
    }
}

export = TelegramBot;
