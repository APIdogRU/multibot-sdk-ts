import { IMatcher } from './utils';

export interface IBotPolling {
    startPolling(): void;
    stopPolling(): void;
}

export interface IBotWebHook {
    startServer(port: number): void;
    stopServer(): void;
}

export interface IBot {
    request<T>(method: string, params?: object): Promise<T>;
}

export default abstract class AbstractBot<Config, Update> implements IBot {
    protected config: Config;
    protected matcher: IMatcher<Update>;

    protected setMatcher(matcher: IMatcher<Update>) {
        this.matcher = matcher;
    }

    protected abstract getApiEndpoint(method: string): string;

    public abstract request<T>(method: string, params?: object): Promise<T>;
}
