import { Update, Media, Message } from './types';
import { extractEntites } from './utils';
import { Matcher, MatchHandle, MatchTest } from '../utils';
import { IBot } from '../abstract-bot';
import { Bot, ArgumentMessage } from '.';

export const enum MatchType {
    Message = 'message',
    MessageEdited = 'message_edited',
    ChannelPost = 'channel_post',
    ChannelPostEdited = 'channel_post_edited',
    CallbackQuery = 'callback_query',
    InlineQuery = 'inline_query',
    ChosenInlineResult = 'chosen_inline_result',
    Exact = 'text_exact',
    Command = 'bot_command',
    RegExp = 'regexp',
    Photo = 'photo',
    Video = 'video',
    Audio = 'audio',
    Voice = 'voice',
    Animation = 'animation',
    Sticker = 'sticker',
    Location = 'location',
    Document = 'document',
    Venue = 'venue',
    Contact = 'contact',
    Poll = 'poll',
    Game = 'game',
    VideoNote = 'videoNote',
    Media = 'media'
}

type MTest = MatchTest<Update>;
type MHandle = MatchHandle<Update>;

export const testMessage: MTest = update => 'message' in update;
export const handleMessage: MHandle = ({ message }) => ({
    message: message,
    chat: message.chat,
    from: message.from
});


export const testMessageEdited: MTest = update => 'message_edited' in update;
export const handleMessageEdited: MHandle = ({ edited_message }) => ({
    message: edited_message,
    chat: edited_message.chat,
    from: edited_message.from
});

export const testChannelPost: MTest = update => 'channel_post' in update;
export const handleChannelPost: MHandle = update => update.channel_post;


export const testChannelPostEdited: MTest = update => 'edited_channel_post' in update;
export const handleChannelPostEdited: MHandle = update => update.edited_channel_post;


export const testCallbackQuery: MTest = update => 'callback_query' in update;
export const handleCallbackQuery: MHandle = update => update.callback_query;

export const testInlineQuery: MTest = update => 'inline_query' in update;
export const handleInlineQuery: MHandle = update => update.inline_query;


// export const testExactText: MTest = update => testMessage(update) && ('text' in update.message || 'caption' in update.message);
// export const handleExactText: MHandle = update => update.message;


export interface MatchResultCommand extends ArgumentMessage {
    starts: boolean;
    command: string;
}

export const testCommand: MTest = update => {
    if (!testMessage(update)) {
        return false;
    }

    const entites = update.message.entities || update.message.caption_entities || [];
    return entites.length && entites.some(entity => entity.type === 'bot_command');
};

export const handleCommand: MHandle = ({ message }) => {
    const entities = extractEntites(message);

    if (!message.entities.length) {
        return false;
    }

    const [entity] = entities;

    return {
        message,
        from: message.from,
        chat: message.chat,
        starts: entity.offset === 0,
        command: entity.text,
    };
};

/*
export const checkMatchRegExp: MatchCheck<RegExpMatch> = (message, rule) => {
    const res = rule.re.exec(text(message));

    return res
        ? { matches: [...res].slice(1) }
        : false;
};*/

const media = (field: string): { test: MTest; handle: MHandle } => ({
    test: update => testMessage(update) && field in update.message,
    handle: (update, bot: Bot) => ({
        ...handleMessage(update) as object,
        getFileUrl: () => bot.request('getFile', { file_id: update.message.photo[0].file_id })
    }),
});

const mediaTypes = ['photo', 'video', 'audio', 'document', 'animation', 'voice', 'sticker', 'location', 'venue', 'contact', 'poll', 'game'];
export type MatchMedia = {
    type: string;
    object: Media;
};
const testMedia: MTest = update => mediaTypes.some(key => testMessage(update) && key in update.message);
const handleMedia: MHandle = update => {
    const type = mediaTypes.find(type => type in update.message);
    return {
        ...handleMessage(update) as object,
        media: {
            type,
            object: update.message[type as keyof Message],
        } as MatchMedia,
    };
};


export class TelegramMatcher extends Matcher<Update> {
    constructor(bot: IBot) {
        super(bot, [
            { type: MatchType.Message, test: testMessage, handle: handleMessage },
            { type: MatchType.MessageEdited, test: testMessageEdited, handle: handleMessageEdited },
            { type: MatchType.ChannelPost, test: testChannelPost, handle: handleChannelPost },
            { type: MatchType.ChannelPostEdited, test: testChannelPostEdited, handle: handleChannelPostEdited },
            { type: MatchType.CallbackQuery, test: testCallbackQuery, handle: handleCallbackQuery },
            { type: MatchType.InlineQuery, test: testInlineQuery, handle: handleInlineQuery },
//            { type: MatchType.Exact, test: testExactText, handle: handleExactText },
            { type: MatchType.Command, test: testCommand, handle: handleCommand },
//            { type: MatchType.RegExp, test: testRegExp, handle: handleRegExp },
            { type: MatchType.Photo, ...media('photo') },
            { type: MatchType.Video, ...media('video') },
            { type: MatchType.Audio, ...media('audio') },
            { type: MatchType.Document, ...media('document') },
            { type: MatchType.Animation, ...media('animation') },
            { type: MatchType.Voice, ...media('voice') },
            { type: MatchType.Sticker, ...media('sticker') },
            { type: MatchType.Location, ...media('location') },
            { type: MatchType.Venue, ...media('venue') },
            { type: MatchType.Contact, ...media('contact') },
            { type: MatchType.Poll, ...media('poll') },
            { type: MatchType.Game, ...media('game') },
//            { type: MatchType.VideoNote, ...media('video_note') },
            { type: MatchType.Media, test: testMedia, handle: handleMedia },
        ]);
    }

    public getMatches = (update: Update) => this.rules.filter(rule => rule.test(update));
}
