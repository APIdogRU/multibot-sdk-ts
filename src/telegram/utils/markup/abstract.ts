import { Markup } from '../../types';

export abstract class KeyboardButton<Props> {
    protected props: Props;
    constructor(protected text: string, props: Props = {} as Props) {
        this.props = props;
    }

    public build = () => ({ text: this.text, ...this.props });
}

export class KeyboardRow<Button extends KeyboardButton<Props>, Props> {
    protected buttons: Button[] = [];

    public length = (): number => this.buttons.length;

    public addButton = (button: Button) => {
        this.buttons.push(button);
    };

    public build = () => this.buttons.map(col => col.build());
}

export abstract class MarkupBuilder<Props extends Markup> {
    protected props: Props;

    constructor(props: Props = {} as Props) {
        this.props = props;
    }

    public abstract build(): Props;
}

export abstract class KeyboardBuilder<
        Type extends Markup,
        Button extends KeyboardButton<PropsButton>,
        PropsButton,
        ExcludeKey extends string
    >
    extends MarkupBuilder<Type> {
    protected rows: KeyboardRow<Button, PropsButton>[] = [];

    constructor(props: Omit<Type, ExcludeKey> = {} as Type) {
        super(props as Type);
    }

    public size = (): number => this.rows.reduce((acc, row) => acc + row.length(), 0);

    public length = (): number => this.rows.length;

    public addRow = (row: KeyboardRow<Button, PropsButton> = new KeyboardRow<Button, PropsButton>()) => {
        this.rows.push(row);
        return row;
    };

    public getRow = (index: number) => this.rows[index];

    public removeRow = (index: number) => {
        this.rows.splice(index, 1);
        return this;
    };
}
