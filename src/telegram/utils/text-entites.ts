import { Message, MessageEntityWithText } from '../types';

export const extractEntites = ({ text, caption, entities, caption_entities }: Message): MessageEntityWithText[] => {
    const items = entities ?? caption_entities ?? [];
    const str = text ?? caption ?? '';

    return items.map(entry => ({
        ...entry,
        text: str.substr(entry.offset, entry.length),
    }));
};
