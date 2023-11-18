import { FederatedPointerEvent, Texture } from 'pixi.js';

/* eslint-disable no-unused-vars */

/** Interface for status icons props */
export interface IStatusIconProps {
    /** The key for the status icon */
    key: string;
    /** The image for the status icon */
    image?: Texture;
    /** The value for the status icon */
    value?: number;
    /** The x position of the status icon */
    x?: number;
    /** The y position of the status icon */
    y?: number;
    /** The position of the status icon */
    position?: 'bottomLeft' | 'bottomRight' | 'none';
    /** The update function for the status icon */
    update?: (key: string) => void;
    /** The callback function when the status icon is hovered */
    hover?: (e: FederatedPointerEvent) => void;
    /** The callback function when the status icon is hovered out */
    out?: () => void;
}
