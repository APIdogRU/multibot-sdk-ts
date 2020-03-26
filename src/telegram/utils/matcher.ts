import { Message } from '../types';
import { extractEntites } from '..';

export const enum MatchType {
    Exact = 'text_exact',
    Command = 'text_command',
    RegExp = 'regexp',
}

type MatchRule = {
    type: MatchType;
};

export interface ExactTextMatch extends MatchRule {
    type: MatchType.Exact;
    text: string;
}

export interface CommandMatch extends MatchRule {
    type: MatchType.Command;
    command: string;
    starts?: boolean;
}

export interface RegExpMatch extends MatchRule {
    type: MatchType.RegExp;
    re: RegExp;
}

type MatcheRules = ExactTextMatch | CommandMatch | RegExpMatch;

type MatchCheck<T extends MatchRule = MatchRule, R = {}> = (message: Message, rule: T) => MatchCheckResult<R> | false;
type MatchCheckResult<T = {}> = T;

/**
 * Get text string from message of any type
 * @param message Message
 */
const text = (message: Message): string => String(message.text ?? message.caption);

/**
 * Check if message text are equal from rule
 * @param message Message
 * @param rule Rule for check
 */
const checkMatchExact: MatchCheck<ExactTextMatch> = (message, rule) => text(message) === rule.text
    ? {}
    : false;

const checkMatchCommand: MatchCheck<CommandMatch> = (message, rule) => {
    const entites = extractEntites(message);
    if (!entites.length) {
        return false;
    }

    const [entity] = entites;
    const checkStarts = rule.starts ? entity.offset === 0 : true;

    return entity.type === 'bot_command' && entity.text === rule.command && checkStarts
        ? { command: entity.text }
        : false;
};

const checkMatchRegExp: MatchCheck<RegExpMatch> = (message, rule) => {
    const res = rule.re.exec(text(message));

    return res
        ? { matches: [...res].slice(1) }
        : false;
};


export class Matcher {
    private rules: MatchRule[] = [];

    private static readonly checker: Record<MatchType, MatchCheck> = {
        [MatchType.Exact]: checkMatchExact,
        [MatchType.Command]: checkMatchCommand,
        [MatchType.RegExp]: checkMatchRegExp,
    };

    constructor() {

    }

    public readonly add = (rule: MatcheRules): Matcher => {
        this.rules.push(rule);
        return this;
    };

    public readonly remove = (rule: MatcheRules): Matcher => {
        const index = this.rules.indexOf(rule);

        if (~index) {
            this.rules.splice(index, 1);
        }

        return this;
    };

    public readonly getMatches = <T = MatchCheckResult>(message: Message): T[] => {
        return this.rules.map(rule => Matcher.checker[rule.type](message, rule)) as T[];
    };

    public readonly getMatch = <T = MatchCheckResult>(message: Message): T => {
        const matches = this.getMatches(message).filter(Boolean);

        return matches[0] as T;
    };
}
