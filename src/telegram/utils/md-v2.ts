const escapeChars = (text: string, chars: string[]) => {
    for (const char of chars) {
        text = text.replace(char, '\\' + char);
    }

    return text;
};

const wrapString = (text: string, char: string) => {
    if (!text) {
        throw new Error('text can\'t be empty');
    }
    return `${char}${escapeChars(text, [char]).split('\n').join(`${char}\n${char}`)}${char}`;
}

type MdV2fx = (text: string) => string;
type MdV2link = (url: string, label: string) => string;

export class MarkdownV2 {
    public static bold: MdV2fx = text => wrapString(text, '*');
    public static italic: MdV2fx = text => wrapString(text, '_');
    public static underline: MdV2fx = text => wrapString(text, '__');
    public static strikethrough: MdV2fx = text => wrapString(text, '~');
    public static link: MdV2link = (url, label) => {
        if (!url || !label) {
            throw new Error('url and label must be specified');
        }
        return `[${escapeChars(label, [']'])}](${escapeChars(url, [')'])})`
    };
    public static codeLine: MdV2fx = text => wrapString(text, '`');
    public static codeBlock: MdV2fx = text => `\`\`\`${escapeChars(text, ['```'])}\`\`\``;
}
