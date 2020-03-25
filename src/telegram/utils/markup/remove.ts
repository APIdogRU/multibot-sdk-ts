import { MarkupBuilder } from './abstract';

type KeyboardRemoveProps = {
    selective?: boolean;
};

// KeyboardRemoveMarkup
export class Builder extends MarkupBuilder<KeyboardRemoveProps> {
    public build = () => ({ remove_keyboard: true, ...this.props });
}
