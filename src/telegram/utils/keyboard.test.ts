import { ReplyKeyboardBuilder, ReplyKeyboardButton, ReplyKeyboardHide, ForceReplyKeyboard, InlineKeyboardBuilder, InlineKeyboardButton } from './keyboard';

describe('Telegram keyboards', () => {
    it('should be created reply keyboard with one button', () => {
        const kb = new ReplyKeyboardBuilder();
        kb.addRow().addButton(new ReplyKeyboardButton('text'));

        expect(kb.json()).toEqual({
            keyboard: [
                [
                    { text: 'text' }
                ]
            ]
        });
    });

    it('should be created reply keyboard 2x2 button', () => {
        const kb = new ReplyKeyboardBuilder();
        let row;

        row = kb.addRow();
        row.addButton(new ReplyKeyboardButton('text 1'));
        row.addButton(new ReplyKeyboardButton('text 2'));

        row = kb.addRow();
        row.addButton(new ReplyKeyboardButton('text 3'));
        row.addButton(new ReplyKeyboardButton('text 4'));

        expect(kb.json()).toEqual({
            keyboard: [
                [
                    { text: 'text 1' },
                    { text: 'text 2' }
                ],
                [
                    { text: 'text 3' },
                    { text: 'text 4' }
                ]
            ]
        });
    });

    it('should be created reply keyboard hide', () => {
        const kb = new ReplyKeyboardHide();

        expect(kb.json()).toEqual({
            hide_keyboard: true,
            selective: false,
        });
    });

    it('should be created force reply keyboard', () => {
        const kb = new ForceReplyKeyboard();

        expect(kb.json()).toEqual({ force_reply: true });
    });

    it('should be created inline keyboard with one button', () => {
        const kb = new InlineKeyboardBuilder();

        kb.addRow().addButton(new InlineKeyboardButton('text', { callback_data: 'aaa' }));

        expect(kb.json()).toEqual({
            inline_keyboard: [
                [
                    { text: 'text', callback_data: 'aaa' }
                ]
            ]
        });
    });

    it('should be throws exception when all optional fields for inline button not specified', () => {
        const button = () => new InlineKeyboardButton('text', {});

        expect(button).toThrow();
    });

    it('should be throws execption when callback_data length greater 64 symbols', () => {
        const button = () => new InlineKeyboardButton('text', {
            callback_data: 'd'.repeat(65)
        });

        expect(button).toThrow();
    });

    it('should be throws execption when add row in keyboard hide', () => {
        const kb = new ReplyKeyboardHide();
        const addRow = () => kb.addRow();

        expect(addRow).toThrow();
    });
});
