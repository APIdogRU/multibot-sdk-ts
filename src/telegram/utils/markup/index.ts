import type { KeyboardButton, Markup } from '../../types/keyboard';

export * from './reply';
export * from './inline';
export * from './force';
export * from './remove';
export * from './abstract';

export type IKeyboardBuilder = {
    build(): Markup;
};

export type IKeyboardRow = {
    build(): KeyboardButton[];
};

export type IKeyboardButton = {
    build(): KeyboardButton;
};
