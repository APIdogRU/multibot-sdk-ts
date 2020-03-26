import { Matcher, MatchType, ExactTextMatch } from './matcher';
import { Message, MessageEntityType, MessageEntity } from '../types';

describe('Matcher', () => {

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

    it('Exact text matcher', () => {
        const matcher = new Matcher();
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
    });
});
