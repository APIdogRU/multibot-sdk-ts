import { extractEntites } from '.';
import { Message } from '../types/message';

describe('Telegram text entry extractor' , () => {
    const basicMessage: Message = {
        message_id: 1,
        from: {
            id: 2,
            is_bot: false,
            username: 'user',
            first_name: 'name'
        },
        date: 123456,
        chat: {
            id: 2,
            type: 'private',
            username: 'user'
        }
    };


    it('bot command', () => {
        const entites = extractEntites({
            ...basicMessage,
            text: 's /command q',
            entities: [
                { offset: 2, length: 8, type: 'bot_command' }
            ]
        });

        expect(entites[0].text).toEqual('/command');
    });

    it('user mention', () => {
        const entites = extractEntites({
            ...basicMessage,
            text: 's (@vladislav805) q',
            entities: [
                { offset: 3, length: 13, type: 'mention' }
            ]
        });

        expect(entites[0].text).toEqual('@vladislav805');
    });
});
