import { Container } from 'pixi.js';

/* eslint-disable no-unused-vars */

/** Interface for app Scenes */
export interface AppScene<T = unknown> extends Container {
    prepare?: (data?: T) => void;
    show?: () => Promise<void>;
    hide?: () => Promise<void>;
    update?: (delta: number) => void;
    resize?: (w: number, h: number) => void;
    remove?: (isOverlay: boolean) => void;
}
