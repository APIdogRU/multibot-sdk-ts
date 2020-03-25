import { Message, SendMessageOptions } from '../types';
import { Bot } from '..';

export const fastReply = async(bot: Bot, message: Message, text: string, options: SendMessageOptions = {}) => bot.request('sendMessage', {
    chat_id: message.chat.id,
    text,
    ...options
});
