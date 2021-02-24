import { ReplyKeyboardBuilder, ReplyButton, RemoveKeyboardBuilder, ForceReplyKeyboardBuilder, InlineKeyboardBuilder, InlineButton } from '.';
import { KeyboardRow } from './markup';

describe('Telegram markup', () => {
    it('should be created reply keyboard with one button', () => {
        const kb = new ReplyKeyboardBuilder();
        kb.addRow().addButton(new ReplyButton('text'));

        expect(kb.build()).toEqual({
            keyboard: [
                [
                    { text: 'text' }
                ]
            ]
        });
    });

    it('should be created reply keyboard 2x2 button', () => {
        const kb = new ReplyKeyboardBuilder();
        let row: KeyboardRow<ReplyButton>;

        row = kb.addRow();
        row.addButton(new ReplyButton('text 1'));
        row.addButton(new ReplyButton('text 2'));

        row = kb.addRow();
        row.addButton(new ReplyButton('text 3'));
        row.addButton(new ReplyButton('text 4'));

        expect(kb.build()).toEqual({
            keyboard: [
                [
                    { text: 'text 1' },
                    { text: 'text 2' },
                ],
                [
                    { text: 'text 3' },
                    { text: 'text 4' },
                ],
            ],
        });
    });

    it('should be created remove keyboard markup', () => {
        const kb = new RemoveKeyboardBuilder({ selective: true });

        expect(kb.build()).toEqual({
            remove_keyboard: true,
            selective: true,
        });
    });

    it('should be created force reply markup', () => {
        const kb = new ForceReplyKeyboardBuilder();

        expect(kb.build()).toEqual({ force_reply: true });
    });

    it('should be created inline keyboard with one button', () => {
        const kb = new InlineKeyboardBuilder();

        kb.addRow().addButton(new InlineButton('text', { callback_data: 'aaa' }));

        expect(kb.build()).toEqual({
            inline_keyboard: [
                [
                    { text: 'text', callback_data: 'aaa' },
                ],
            ],
        });
    });

    it('should be throws exception when all optional fields for inline button not specified', () => {
        const button = () => new InlineButton('text', {});

        expect(button).toThrow();
    });

    it('should be throws execption when callback_data length greater 64 symbols', () => {
        const button = () => new InlineButton('text', {
            callback_data: 'd'.repeat(65),
        });

        expect(button).toThrow();
    });
});
