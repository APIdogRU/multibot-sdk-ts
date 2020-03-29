import { MarkdownV2 } from './md-v2';

describe('Telegram MarkdownV2 helper functions', () => {
    it('bold', () => {
        expect(MarkdownV2.bold('text')).toEqual('*text*');
    });

    it('bold escape', () => {
        expect(MarkdownV2.bold('text*text')).toEqual('*text\\*text*');
    });

    it('bold multiline', () => {
        expect(MarkdownV2.bold('text\ntest')).toEqual('*text*\n*test*');
    });

    it('italic', () => {
        expect(MarkdownV2.italic('italic')).toEqual('_italic_');
    });

    it('underline', () => {
        expect(MarkdownV2.underline('underline')).toEqual('__underline__');
    });

    it('strikethrough', () => {
        expect(MarkdownV2.strikethrough('strikethrough')).toEqual('~strikethrough~');
    });

    it('link', () => {
        expect(MarkdownV2.link('https://yandex.ru/', 'Yandex')).toEqual('[Yandex](https://yandex.ru/)');
    });

    it('codeLine', () => {
        expect(MarkdownV2.codeLine('code')).toEqual('`code`');
    });

    it('codeBlock', () => {
        expect(MarkdownV2.codeBlock('block')).toEqual('```block```');
    });

    it('Sanitize string contains MarkdownV2', () => {
        expect(MarkdownV2.sanitizeString('Test. #Test 2*2=4 | {} !')).toEqual('Test\\. \\#Test 2\\*2\\=4 \\| \\{\\} \\!');
    })
});
