export type AbsItemWithName = {
    id: number;
    title: string;
};

export type List<T> = {
    count: number;
    items: T[];
};
