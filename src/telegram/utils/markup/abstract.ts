import type { IKeyboardBuilder, IKeyboardButton, IKeyboardRow } from '.';
import type { KeyboardButton, Markup } from '../../types';

export abstract class AbstractButton<Props extends KeyboardButton> implements IKeyboardButton {
    protected readonly props: Props;

    public constructor(text: string, props: Omit<Props, 'text'> = {} as Props) {
        this.props = {
            ...props,
            text,
        } as Props;
    }

    public build(): KeyboardButton {
        return this.props;
    }
}

export class KeyboardRow<Button extends AbstractButton<KeyboardButton>> implements IKeyboardRow {
    protected readonly buttons: Button[] = [];

    public length(): number {
        return this.buttons.length;
    }

    public addButton(button: Button): this {
        this.buttons.push(button);
        return this;
    }

    public build(): KeyboardButton[] {
        return this.buttons.map(col => col.build());
    }
}

export abstract class MarkupBuilder<Params extends Markup, SkipParams extends string = never> implements IKeyboardBuilder {
    protected readonly props: Omit<Params, SkipParams>;

    public constructor(props: Omit<Params, SkipParams> = {} as Params) {
        this.props = props;
    }

    public abstract build(): Markup;
}

export abstract class KeyboardBuilder<Type extends Markup, Button extends AbstractButton<KeyboardButton>, SkipParams extends string = never> extends MarkupBuilder<Type, SkipParams> {
    protected readonly rows: KeyboardRow<Button>[] = [];

    public constructor(props: Omit<Type, SkipParams> = {} as Type) {
        super(props);
    }

    get buttonsCount(): number {
        return this.rows.reduce((acc, row) => acc + row.length(), 0);
    }

    get rowsCount(): number {
        return this.rows.length;
    }

    public addRow(row: KeyboardRow<Button> = new KeyboardRow<Button>()): KeyboardRow<Button> {
        this.rows.push(row);
        return row;
    }

    public getRow(index: number): KeyboardRow<Button> {
        return this.rows[index];
    }

    public removeRow(index: number): this {
        this.rows.splice(index, 1);
        return this;
    }
}
