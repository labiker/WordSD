import { Container } from 'pixi.js';

/* eslint-disable no-unused-vars */

/** Interface for app Scenes */
export interface IScene extends Container {
    /** The unique id of the scene. */
    SCENE_ID: string;
    prepare?: () => void;
    show?: () => Promise<void>;
    hide?: () => Promise<void>;
    update?: (delta: number) => void;
    resize?: (w: number, h: number) => void;
    remove?: (isOverlay: boolean) => void;
}
