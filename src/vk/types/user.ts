import { AbsItemWithName } from '.';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    deactivated?: UserDeactivateReason;
    can_access_closed?: boolean;
    is_closed?: boolean;
    screen_name?: string;
    domain?: string;
    photo_50?: string;
    photo_100?: string;
    photo_200?: string;
    city?: City;
    country?: Country;
    online?: boolean;
    online_mobile?: boolean;
    online_app?: string;
    last_seen?: UserLastSeen;
    sex?: UserSex;
    status?: string;
    timezone?: number;
    verified?: boolean;
}

export type UserDefaultKeys = 'id' | 'first_name' | 'last_name' | 'deactivated' | 'is_closed' | 'can_access_closed';

export type UserNameCase = 'nom' | 'gen' | 'dat' | 'acc' | 'ins' | 'abl';

export type UserDeactivateReason = 'deleted' | 'banned';

export type UserLastSeen = {
    time: number;
    platform?: number;
};

export const enum Platform {
    MOBILE = 1,
    IPHONE = 2,
    IPAD = 3,
    ANDROID = 4,
    WINDOWS_PHONE = 5,
    WINDOWS = 6,
    SITE = 7,
}

export const enum UserSex {
    UNKNOWN = 0,
    FEMALE = 1,
    MALE = 2,
}

export type City = AbsItemWithName;
export type Country = AbsItemWithName;
