export interface IBotPolling {
    startPolling(): void;
    stopPolling(): void;
}

export interface IBotWebHook<E> {
    on(event: E): void;
}

/**
 * Default listener
 */
export type Listener<T = unknown> = (info: T) => void;

type AddListener<E, C = object> = {
    (event: E, listener: Listener): void;
} | C;


export default abstract class AbstractBot<Config, EventType extends string, EventInterface> {
    protected config: Config;

    protected abstract getApiEndpoint(method: string): string;

    protected abstract request<T>(method: string, params?: object): Promise<T>;

    protected listeners: Record<EventType, Listener[]> = {} as Record<EventType, Listener[]>;

    public on: AddListener<EventType, EventInterface> = (event: EventType, listener: Listener) => {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(listener);
    };

    protected emit = <T>(event: EventType, arg: T) => {
        this.listeners[event]?.forEach(listener => listener(arg));
    };
}
