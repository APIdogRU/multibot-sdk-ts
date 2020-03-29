import { Bot } from '.';
import { cfg } from './test.cfg';

describe('VK bot', () => {
    it('should make request and fetch info about Pavel Durov', async() => {
        const bot = new Bot(cfg);

        const users = await bot.request('users.get', { user_ids: 1, fields: ['screen_name'] });

        expect(users.length).toBeGreaterThan(0);
        expect(users[0].screen_name).toEqual('durov');
    });

    it('should change language with config', async() => {
        const ruBot = new Bot({ ...cfg, lang: 'ru' });
        const enBot = new Bot({ ...cfg, lang: 'en' });

        const ruUsers = await ruBot.request('users.get', { user_ids: 1, fields: ['screen_name'] });
        const enUsers = await enBot.request('users.get', { user_ids: 1, fields: ['screen_name'] });

        expect(ruUsers[0].first_name).toEqual('Павел');
        expect(enUsers[0].first_name).toEqual('Pavel');
    });
});
