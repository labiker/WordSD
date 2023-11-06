import { Container, Graphics } from 'pixi.js';

/**
 * 顶部遮罩。
 * @note 在 `BackLog.show()` 时，显示到舞台中，遮挡上方的文本。
 * @since 1.0.0
 */
export class BottomMask {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The hit area of the background */
    public hitArea = new Graphics();

    /**
     * @param x 遮罩 x 坐标。
     * @param y 遮罩 y 坐标。
     * @param width 遮罩宽度。
     * @param height 遮罩高度。
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.hitArea.beginFill(0x000000, 1);
        this.hitArea.drawRect(x, y, width, height);
        this.hitArea.endFill();
        this.view.addChild(this.hitArea);
    }
}
