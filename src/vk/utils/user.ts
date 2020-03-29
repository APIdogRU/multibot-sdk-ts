import { Bot } from '..';
import { User, UserFieldExtra, Message } from '../types';
import { IBot } from '../../abstract-bot';

export const getUser = async(bot: IBot, userId: number, fields?: UserFieldExtra[]): Promise<User> => {
    const users = await (bot as Bot).request('users.get', {
        user_ids: userId,
        fields,
    });
    return users.length ? users[0] : undefined;
};

export const getSender = async(bot: IBot, message: Message, fields?: UserFieldExtra[]): Promise<User> => getUser(bot, message.from_id, fields);
