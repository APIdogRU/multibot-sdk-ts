import { TelegramMatcher, MatchType, MatchResultCommand, MatchMedia } from './matcher';
import { Message, MessageEntityType, MessageEntity, Update, User, Chat, Video } from './types';
import { Bot } from '.';
import { MatchRule } from '../utils';

describe.only('Matcher', () => {

    const bot = new Bot({ secret: 'abc' });

    // Base message
    const bm: Message = {
        chat: {
            id: 1,
            type: 'private',
        },
        date: 0,
        message_id: 0,
        from: {
            first_name: 'name',
            id: 0,
            is_bot: false,
        },
    };

    const entitiy = (type: MessageEntityType, offset: number, length: number): MessageEntity[] => [{ type, offset, length }];

    it('Message', () => {
        const m = new TelegramMatcher(bot);

        const update: Update = { update_id: 0, message: { ...bm, text: 'abc' } };
        const match = m.getMatches(update);

        expect(match.length).toBeGreaterThanOrEqual(1);
        expect(match[0].type).toEqual('message');
        expect(match[0].handle(update)).toEqual({
            message: update.message,
            chat: update.message.chat,
            from: update.message.from,
        });
    });

    it('Command', () => {
        const m = new TelegramMatcher(bot);

        const update: Update = { update_id: 0, message: { ...bm, text: '/fuck', entities: entitiy('bot_command', 0, 5) } };
        const match = m.getMatches(update);

        const rule: MatchRule<Update> = match.find(item => item.type === MatchType.Command);

        expect(rule).not.toBeUndefined();

        const command = rule.handle(update) as MatchResultCommand;
        expect(command.message).toEqual(update.message);
        expect(command.command).toEqual('/fuck');
        expect(command.starts).toBeTruthy();
    });

    it('Media match', () => {
        const getRuleAs = (match: MatchRule<Update>[], type: MatchType) => {
            return match.find(item => item.type === type);
        };

        const m = new TelegramMatcher(bot);

        const updates: Update[] = [
            { update_id: 0, message: { ...bm, photo: [] } },
            { update_id: 0, message: { ...bm, video: {
                file_id: 'f',
                file_size: 0
             } as Video } },
        ];

        type MM = {
            message: Message;
            from: User;
            chat: Chat;
            media: MatchMedia;
        };

        expect((getRuleAs(m.getMatches(updates[0]), MatchType.Media)?.handle(updates[0]) as MM)?.media).toEqual({
            type: 'photo',
            object: [],
        });

        expect((getRuleAs(m.getMatches(updates[1]), MatchType.Media)?.handle(updates[1]) as MM)?.media).toEqual({
            type: 'video',
            object: { file_id: 'f', file_size: 0 },
        });
    });

    /*it('Exact text matcher', () => {
        const matcher = new TelegramMatcher(bot);
        matcher.add({ type: MatchType.Exact, text: 'qqqqwe' });

        const rightMessage = { ...bm, text: 'qqqqwe' };
        const wrongMessage = { ...bm, text: 'abc' };

        expect(matcher.getMatch(rightMessage)).not.toBeFalsy();
        expect(matcher.getMatch(wrongMessage)).toBeFalsy();
    });

    it('Command matcher single', () => {
        const matcher = new Matcher();
        matcher.add({ type: MatchType.Command, command: '/fuck' });

        expect(matcher.getMatch({ ...bm, text: '/fuck', entities: entitiy('bot_command', 0, 5) }))
            .toEqual({ command: '/fuck' });
        expect(matcher.getMatch({ ...bm, text: '/fuck args', entities: entitiy('bot_command', 0, 5) }))
            .toEqual({ command: '/fuck' });
        expect(matcher.getMatch({ ...bm, text: 'arg /fuck', entities: entitiy('bot_command', 4, 5) }))
            .toEqual({ command: '/fuck' });
        expect(matcher.getMatch({ ...bm, text: 'args /fuck args', entities: entitiy('bot_command', 5, 5) }))
            .toEqual({ command: '/fuck' });

        expect(matcher.getMatch({ ...bm, text: 'abc' })).toBeFalsy();
        expect(matcher.getMatch({ ...bm, text: '/fucker', entities: entitiy('bot_command', 0, 7) }))
            .toBeFalsy();
        expect(matcher.getMatch({ ...bm, text: 'fuck' })).toBeFalsy();
    });

    it('Command matcher starts', () => {
        const matcher = new Matcher();
        matcher.add({ type: MatchType.Command, command: '/fuck', starts: true });

        expect(matcher.getMatch({ ...bm, text: '/fuck', entities: entitiy('bot_command', 0, 5) }))
            .toEqual({ command: '/fuck' });
        expect(matcher.getMatch({ ...bm, text: '/fuck args', entities: entitiy('bot_command', 0, 5) }))
            .toEqual({ command: '/fuck' });
        expect(matcher.getMatch({ ...bm, text: 'arg /fuck', entities: entitiy('bot_command', 4, 5) }))
            .toBeFalsy();
        expect(matcher.getMatch({ ...bm, text: 'args /fuck args', entities: entitiy('bot_command', 5, 5) }))
            .toBeFalsy();
        expect(matcher.getMatch({ ...bm, text: '/fucker', entities: entitiy('bot_command', 0, 7) }))
            .toBeFalsy();
    });

    it('RegExp matcher', () => {
        const matcher = new Matcher();
        matcher.add({ type: MatchType.RegExp, re: /\/love @([a-z0-9_]+)/i });

        expect(matcher.getMatch({ ...bm, text: '/love @admin' })).toEqual({ matches: ['admin'] });
    });

    it('Check all', () => {
        const matcher = new Matcher();
        matcher.add({ type: MatchType.Exact, text: '/test' });
        matcher.add({ type: MatchType.Command, command: '/test' });
        matcher.add({ type: MatchType.RegExp, re: /\/(test)/i });

        expect(matcher.getMatch({ ...bm, text: '/test', entities: entitiy('bot_command', 0, 5) })).toEqual({});

        expect(matcher.getMatches({ ...bm, text: '/test', entities: entitiy('bot_command', 0, 5) })).toEqual([
            {},
            { command: '/test' },
            { matches: ['test'] }
        ]);
    });

    it('Remove matcher', () => {
        const matcher = new Matcher();
        const rule: ExactTextMatch = { type: MatchType.Exact, text: 'abc' };

        matcher.add(rule);
        expect(matcher.getMatch({ ...bm, text: 'abc' })).not.toBeFalsy();

        matcher.remove(rule);
        expect(matcher.getMatch({ ...bm, text: 'abc' })).toBeFalsy();
    });*/
});
