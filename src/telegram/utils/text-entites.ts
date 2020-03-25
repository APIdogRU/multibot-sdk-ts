import { Message, MessageEntity } from '../types';

export const extractEntites = ({ text, caption, entities, caption_entities }: Message): (MessageEntity & { text: string })[] => {
    const items = entities || caption_entities || [];
    const str = text || caption || '';

    return items.map(entry => ({
        ...entry,
        text: str.substr(entry.offset, entry.length),
    }));
};
