declare namespace VkBot {
    interface User {
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

    type UserDefaultKeys = 'id' | 'first_name' | 'last_name' | 'deactivated' | 'is_closed' | 'can_access_closed';

    type UserNameCase = 'nom' | 'gen' | 'dat' | 'acc' | 'ins' | 'abl';

    type UserDeactivateReason = 'deleted' | 'banned';

    type UserLastSeen = {
        time: number;
        platform?: number;
    }

    const enum Platform {
        MOBILE = 1,
        IPHONE = 2,
        IPAD = 3,
        ANDROID = 4,
        WINDOWS_PHONE = 5,
        WINDOWS = 6,
        SITE = 7
    }

    const enum UserSex {
        UNKNOWN = 0,
        FEMALE = 1,
        MALE = 2
    }

    type City = AbsItemWithName;
    type Country = AbsItemWithName;
}
