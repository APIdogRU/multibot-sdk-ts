import { Bot } from '..';
import { getSender } from '.';
import { cfg } from '../test.cfg';

describe('User utils', () => {
    it('getSender in message', async() => {
        const bot = new Bot(cfg);

        const user = await getSender(bot, {
            id: 1,
            date: 1,
            peer_id: 1,
            from_id: 1,
            out: 0,
            text: 'test',
            conversation_message_id: 0,
            attachments: [],
            fwd_messages: [],
            important: false
        });

        expect(user).not.toBeUndefined();
        expect(user.id).toEqual(1);
        expect(user.first_name).toEqual('Pavel');
    });
});
