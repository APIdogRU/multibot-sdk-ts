import { IBot } from '../abstract-bot';

export type Listener<T = unknown> = (info: T) => void;

export type MatchRule<Update> = {
    type: string;
    test: MatchTest<Update>;
    handle: MatchHandle<Update>;
};

export type MatchTest<Update> = (update: Update, bot?: IBot) => boolean;
export type MatchHandle<Update> = (update: Update, bot?: IBot) => unknown;

export interface IMatcher<Update> {
    add: (item: MatchRule<Update>) => void;
    getMatches: (update: Update) => MatchRule<Update>[];
}

export abstract class Matcher<Update> implements IMatcher<Update> {
    protected readonly bot: IBot;
    protected readonly rules: MatchRule<Update>[] = [];

    constructor(bot: IBot, rules?: MatchRule<Update>[]) {
        this.bot = bot;
        this.rules = rules;
    }

    /**
     * Add rule for match
     */
    public add = (item: MatchRule<Update>) => {
        if (!this.rules.includes(item)) {
            this.rules.push(item);
        }
    };

    public getMatches = (update: Update) => this.rules.filter(rule => rule.test(update, this.bot));
}
