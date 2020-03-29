import { MatchTest, MatchHandle, Matcher } from '../utils/matcher';
import { Update, Message, UserFieldExtra } from './types';
import { IBot } from '../abstract-bot';
import { getSender, getUser } from './utils';

export const enum MatchType {
    Message = 'message',
    MessageOut = 'message_reply',
    MessageEdit = 'message_edit',
    MessageAllow = 'message_allow',
    MessageDeny = 'message_deny'
}

type MTest = MatchTest<Update>;
type MHandle = MatchHandle<Update>;

const fetcherUser = (message: Message, bot: IBot) => async(fields?: UserFieldExtra[]) => getSender(bot, message, fields);

export const testMessage: MTest = update => update.type == 'message_new';
export const handleMessage: MHandle = ({ object }, bot) => {
    if ('message' in object) {
        return {
            message: object.message,
            capability: object.client_info,
            getSender: fetcherUser(object.message, bot),
        };
    } else {
        return {
            message: object,
            getSender: fetcherUser(object as Message, bot),
        };
    }
};

export const testMessageEdit: MTest = update => update.type === 'message_edit';
export const handleMessageEdit: MHandle = ({ object }, bot) => ({
    message: object as Message,
    getSender: fetcherUser(object as Message, bot),
})

export const testMessageAllow: MTest = update => update.type === 'message_allow';
export const handleMessageAllow: MHandle = (update, bot) => ({
    event: update.object,
    getUser: () => getUser(bot, (update.object as {user_id: number}).user_id)
})

export const testMessageDeny: MTest = update => update.type === 'message_deny';
export const handleMessageDeny: MHandle = (update, bot) => ({
    event: update.object,
    getUser: () => getUser(bot, (update.object as {user_id: number}).user_id),
})

export class VkMatcher extends Matcher<Update> {
    constructor(bot: IBot) {
        super(bot, [
            { type: MatchType.Message, test: testMessage, handle: handleMessage },
            { type: MatchType.MessageEdit, test: testMessageEdit, handle: handleMessageEdit },
            { type: MatchType.MessageAllow, test: testMessageAllow, handle: handleMessageAllow },
            { type: MatchType.MessageDeny, test: testMessageDeny, handle: handleMessageDeny },
        ]);
    }
}
