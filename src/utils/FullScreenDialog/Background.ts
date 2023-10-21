import { Container, Graphics } from 'pixi.js';

/**
 * 背景。
 * @note 用于绑定点击事件。最先加入舞台，位于最底层。
 * @since 1.0.0
 */
export class Background {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The hit area of the background */
    public hitArea = new Graphics();

    constructor(width?: number, height?: number) {
        this.draw(width, height);
        this.hitArea.eventMode = 'static';
        this.hitArea.on('click', (event) => {
            event.stopPropagation();
        });
        this.view.addChild(this.hitArea);
    }

    /**
     * Draw the background.
     * @param width The width of the background.
     * @param height The height of the background.
     */
    public draw(width: number, height: number) {
        this.hitArea.clear();
        this.hitArea.beginFill(0x000000, 0.5);
        this.hitArea.drawRect(0, 0, width, height);
        this.hitArea.endFill();
    }
}
