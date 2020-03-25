import { Bot } from '..';
import { User, UserFieldExtra, Message } from '../types';

export const getUser = async(bot: Bot, userId: number, fields?: UserFieldExtra[]): Promise<User> => (await bot.request('users.get', {
    user_ids: userId,
    fields,
}))[0];

export const getSender = async(bot: Bot, message: Message, fields?: UserFieldExtra[]): Promise<User> => getUser(bot, message.from_id, fields);
