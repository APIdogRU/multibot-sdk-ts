import { Message } from '../types/message';
import { SendMessageOptions } from '../types/send';
import { TelegramBot } from '../';

export const reply = async(bot: TelegramBot, message: Message, text: string, options: SendMessageOptions = {}) => bot.request('sendMessage', {
    chat_id: message.chat.id,
    text,
    ...options
});
