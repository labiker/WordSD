import { Container, Graphics } from 'pixi.js';

/**
 * Common drawing options.
 */
export interface DrawOptions {
    /** The color of the fill. */
    color?: number;
    /** The x coordinate of the upper-left corner of the rectangle. */
    x?: number;
    /** The y coordinate of the upper-left corner of the rectangle. */
    y?: number;
    /** The width of the rectangle. */
    width?: number;
    /** The height of the rectangle. */
    height?: number;
    /** The radius of the rectangle corners. */
    radius?: number;
    /** The thickness of the lines. */
    border?: number;
}

/**
 * A scroll component to be used in the BackLog.
 * @since 1.0.0
 */
export class Scroll {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The scroll */
    public scroll = new Graphics();
    /** The scroll background */
    public background = new Graphics();

    /**
     * Whether the scroll is pressing.
     * @default false
     */
    public pressing: boolean;

    /**
     * The position of the scroll on the y axis, in pixels.
     * @default 150
     */
    private _scrollY: number;

    /**
     * The height of the scroll, in pixels.
     * @default 840
     */
    private _scrollHeight: number;

    /**
     * The absolute position of the background on the y axis, in pixels.
     * @default 150
     */
    public absoluteBackgroundY: number;

    constructor() {
        this.drawScroll();
        this.drawBackground();
        this.view.addChild(this.background);
        this.view.addChild(this.scroll);
    }

    /**
     * Move the scroll by the specified amount.
     * @note The scroll will not move if it is at the top or bottom.
     * @param y The amount to move the scroll by.
     * @returns Whether the scroll has moved.
     */
    public moveScroll = (y: number) => {
        let nextY = this._scrollY + y;
        const topLimit = 150;
        const bottomLimit = 150 + this.background.height - this.scroll.height;

        if (nextY < topLimit) {
            nextY = topLimit;
        } else if (nextY > bottomLimit) {
            nextY = bottomLimit;
        }

        if (nextY !== this._scrollY) {
            this._scrollY = nextY;
            this.drawScroll();
            return true;
        }

        return false;
    };

    /**
     * Draw the scroll.
     * @param elm The element to be drawn.
     */
    public drawScroll = (options?: DrawOptions) => {
        const x = options?.x ?? 1700;
        const width = options?.width ?? 20;
        this._scrollY = options?.y ?? this._scrollY ?? 150;
        this._scrollHeight = options?.height ?? this._scrollHeight ?? 840;
        const radius = options?.radius ?? 10;
        const border = options?.border ?? 4;
        this.scroll.clear();
        this.scroll.beginFill(options?.color ?? 0xe5e5e5);
        this.scroll.drawRoundedRect(
            x,
            this._scrollY,
            width - border * 2,
            this._scrollHeight,
            radius,
        );
        this.scroll.endFill();
    };

    /**
     * Draw the scroll background.
     * @param elm The element to be drawn.
     */
    public drawBackground = (options?: DrawOptions) => {
        const x = options?.x ?? 1700;
        this.absoluteBackgroundY = options?.y ?? 150;
        const width = options?.width ?? 20;
        const height = options?.height ?? 840;
        const radius = options?.radius ?? 10;
        const border = options?.border ?? 4;
        /* console.log('this.absoluteBackgroundY', this.absoluteBackgroundY);
        console.log('height', height); */
        this.background.clear();
        this.background.beginFill(options?.color ?? 0x727272);
        this.background.drawRoundedRect(
            x,
            this.absoluteBackgroundY,
            width - border * 2,
            height - border * 2,
            radius,
        );
        this.background.endFill();
    };
}
