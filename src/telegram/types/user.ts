import { PhotoSize, Message } from '.';
import { Location } from './media';

export type User = {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    can_join_groups?: boolean;
    can_read_all_group_messages?: boolean;
    supports_inline_queries?: boolean;
};

export type Chat = {
    id: number;
    type: ChatType;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo?: ChatPhoto;
    bio?: string;
    description?: string;
    invite_link?: string;
    pinned_message?: Message;
    permissions?: ChatPermissions;
    slow_mode_delay?: boolean;
    sticker_set_name?: string;
    can_set_sticker_set?: boolean;
    linked_chat_id?: number;
    location?: ChatLocation;
};

export type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

export type ChatPhoto = {
    small_file_id: string;
    small_file_unique_id: string;
    big_file_id: string;
    big_file_unique_id: string;
};

export type ChatPermissions = {
    can_send_messages?: boolean;
    can_send_media_messages?: boolean;
    can_send_polls?: boolean;
    can_send_other_messages?: boolean;
    can_add_web_page_previews?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_pin_messages?: boolean;
};

export type ChatMember = {
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
};

export type ChatMemberStatus = 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';

export type UserProfilePhotos = {
    total_count: number;
    photos: PhotoSize[][];
};

export type ChatLocation = {
    location: Location;
    address: string;
};
