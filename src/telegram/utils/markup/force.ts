import { MarkupBuilder } from './abstract';

type ForceReplyProps = {
    selective?: boolean;
};

// ForceReplyMarkup
export class Builder extends MarkupBuilder<ForceReplyProps> {
    public build = () => ({ force_reply: true, ...this.props });
}
