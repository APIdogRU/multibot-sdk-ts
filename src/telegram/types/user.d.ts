import { PhotoSize } from './media';
import { Message } from './message';

declare namespace TelegramBot {
    interface User {
        id: number;
        is_bot: boolean;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
    }

    interface Chat {
        id: number;
        type: ChatType;
        title?: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        photo?: ChatPhoto;
        description?: string;
        invite_link?: string;
        pinned_message?: Message;
        permissions?: ChatPermissions;
        can_set_sticker_set?: boolean;
        sticker_set_name?: string;
    }

    type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

    interface ChatPhoto {
        small_file_id: string;
        small_file_unique_id: string;
        big_file_id: string;
        big_file_unique_id: string;
    }

    interface ChatPermissions {
        can_send_messages?: boolean;
        can_send_media_messages?: boolean;
        can_send_polls?: boolean;
        can_send_other_messages?: boolean;
        can_add_web_page_previews?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_pin_messages?: boolean;
    }

    interface ChatMember {
        user: User;
        status: ChatMemberStatus;
        custom_title?: string;
        until_date?: number;
        can_be_edited?: boolean;
        can_post_messages?: boolean;
        can_edit_messages?: boolean;
        can_delete_messages?: boolean;
        can_restrict_members?: boolean;
        can_promote_members?: boolean;
        can_change_info?: boolean;
        can_invite_users?: boolean;
        can_pin_messages?: boolean;
        is_member?: boolean;
        can_send_messages?: boolean;
        can_send_media_messages?: boolean;
        can_send_polls: boolean;
        can_send_other_messages?: boolean;
        can_add_web_page_previews?: boolean;
    }

    type ChatMemberStatus = 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';

    interface UserProfilePhotos {
        total_count: number;
        photos: PhotoSize[][];
    }
}

export = TelegramBot;
