import * as PIXI from 'pixi.js';
import { app } from './app';

/**
 * 基于 `Pixijs` 的日志模块。
 *
 * @since 1.0.0
 */
class BackLog {
    /**
     * 自动启动鼠标滚轮检测和鼠标右键检测。
     * 向上滚动鼠标滚轮，显示日志。
     * 显示日志时，右键点击鼠标，关闭日志；上下滚动鼠标滚轮，控制日志文本上下移动。
     */
    constructor() {
        this.marginTop = 150;
        this.marginBottom = 80;
        this.lineSpacing = 36;
        this.observeTextChanges();
        this.enableWheelDetection();
        this.enableRightClickDetection();
    }

    /**
     * 关闭日志。
     *
     * 如果日志已经打开，则关闭日志。
     * @note 请和 `BackLog.open()` 配对使用。
     */
    public close() {
        if (!this.isShowing) {
            return;
        }
        this.removeAllObjects();
        this.isShowing = false;
        this.autoRecordText = true;
    }

    /**
     * 启用鼠标滚轮检测。
     *
     * 当鼠标滚轮向上滚动，且日志未显示时，显示日志。
     *
     * 已显示日志，但没有文本时，不做任何操作。
     *
     * 鼠标滚轮向上滚动时，`this.pixiTexts` 整体上移；向下滚动时，`this.pixiTexts` 整体下移。
     *
     * 同时，调整 `this.scroll` 相对于 `this.scrollBg`的位置。
     * @note 该方法会在构造函数中自动调用。
     */
    private enableWheelDetection() {
        app.view.addEventListener('wheel', (event) => {
            const getFirstText = () => {
                return this.pixiTexts[0];
            };
            const getLastText = () => {
                return this.pixiTexts[this.pixiTexts.length - 1];
            };

            if (event.deltaY < 0 && !this.isShowing) {
                this.open();
                return;
            }

            if (this.isShowing && this.pixiTexts.length <= 0) {
                return;
            }

            if (event.deltaY < 0 && this.isShowing && getFirstText().y < this.marginTop) {
                const step = Math.min(30, this.marginTop - getFirstText().y);
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y += step;
                });
            } else if (
                event.deltaY > 0 &&
                this.isShowing &&
                getLastText().y + getLastText().height > app.view.height - this.marginBottom
            ) {
                const step = Math.min(
                    30,
                    getLastText().y + getLastText().height - (app.view.height - this.marginBottom),
                );
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y -= step;
                });
            }

            this.scroll.draw({
                y:
                    150 +
                    (Math.abs(this.marginTop - getFirstText().y) /
                        (getLastText().y +
                            getLastText().height -
                            getFirstText().y -
                            (app.view.height - this.marginTop - this.marginBottom))) *
                        (this.scrollBg.height - this.scroll.height),
                height:
                    ((app.view.height - this.marginTop) /
                        (getLastText().y + getLastText().height - getFirstText().y)) *
                    this.scrollBg.height,
            });
        });
    }

    /**
     * 启用滚动条拖动。
     *
     * 只能相对于 `this.scrollBg` 上下拖动。
     * 鼠标光标变为 `grab` 时，表示可以拖动。
     * 鼠标光标变为 `grabbing` 时，表示正在拖动。
     */
    private enableScrollDrag() {
        this.scroll.eventMode = 'static';
        this.scroll.cursor = 'grab';

        /** Interaction mouse/touch down handler */
        this.scroll.on('pointerdown', () => {
            this.scroll.pressing = true;
            this.scroll.cursor = 'grabbing';
            this.background.cursor = 'grabbing';
        });

        /** Interaction mouse/touch move handler */
        this.background.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            if (!this.scroll.pressing) return;

            const stepY = e.movementY * 2;
            const getFirstText = () => {
                return this.pixiTexts[0];
            };
            const getLastText = () => {
                return this.pixiTexts[this.pixiTexts.length - 1];
            };

            const nextY = this.scroll.absoluteY + stepY;
            if (nextY >= 150 && nextY <= 150 + this.scrollBg.height - this.scroll.height) {
                this.scroll.draw({
                    y: nextY,
                });
                if (stepY < 0 && getFirstText().y < this.marginTop) {
                    const step = Math.min(
                        (-stepY / this.scrollBg.height) *
                            (getLastText().y +
                                getLastText().height -
                                getFirstText().y +
                                this.marginBottom +
                                this.marginTop),
                        this.marginTop - getFirstText().y,
                    );
                    this.pixiTexts.forEach((pixiText) => {
                        pixiText.y += step;
                    });
                } else if (
                    stepY > 0 &&
                    getLastText().y + getLastText().height > app.view.height - this.marginBottom
                ) {
                    const step = Math.min(
                        (stepY / this.scrollBg.height) *
                            (getLastText().y +
                                getLastText().height -
                                getFirstText().y +
                                this.marginBottom +
                                this.marginTop),
                        getLastText().y +
                            getLastText().height -
                            (app.view.height - this.marginBottom),
                    );
                    this.pixiTexts.forEach((pixiText) => {
                        pixiText.y -= step;
                    });
                }
            }
        });

        /** Interaction mouse/touch up handler */
        const onPointerUp = () => {
            this.scroll.pressing = false;
            this.scroll.cursor = 'grab';
            this.background.cursor = 'default';
        };
        this.scroll.on('pointerup', onPointerUp);
        this.background.on('pointerup', onPointerUp);
    }

    /**
     * 启用鼠标右键检测。
     *
     * 已显示日志，并且鼠标右键点击时，关闭日志。
     * @note 该方法会在构造函数中自动调用。
     */
    private enableRightClickDetection() {
        app.view.addEventListener('contextmenu', (event) => {
            if (this.isShowing) {
                this.close();
            } else {
                return;
            }
            event.preventDefault();
        });
    }

    /**
     * 观察文本变化。
     *
     * `this.autoRecordText` 为真时，检测到 `BackLog.app.stage.children` 中 `Pixi.Text` 类型的子对象被移除时，记录文本。
     * @note 该方法会在构造函数中自动调用。
     */
    private observeTextChanges() {
        app.stage.on('childRemoved', (child) => {
            if (this.autoRecordText && child instanceof PIXI.Text) {
                this.recordPixiText(child);
            }
        });
    }

    /**
     * 打开日志。
     *
     * 当日志未打开时，打开日志。纯黑的背景，在左上角显示标题，在右下角显示关闭按钮。
     * 另外还有两个遮罩，一个在上方，一个在下方，用于遮挡上下的文本。
     * 自动显示 `BackLog.recordedPixiTexts` 中的文本。
     * 在文本右方显示滚动条，用于显示当前文本的位置。
     * @note 请和 `BackLog.close()` 配对使用。
     */
    public open() {
        if (this.isShowing) {
            return;
        }

        this.background = new Background(app.view.width, app.view.height);
        this.showObject(this.background);

        this.recordedPixiTexts.forEach((pixiText, index) => {
            const message = new Message(pixiText, app.view.width);
            if (index !== 0) {
                const lastTextChild = this.pixiTexts[index - 1];
                message.y = lastTextChild.y + lastTextChild.height + this.lineSpacing;
            }
            this.showObject(message);
        });

        if (this.pixiTexts.length > 0) {
            const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
            const lastTextChildBottom = lastTextChild.y + lastTextChild.height;
            const lastTextChildBottomMargin =
                app.view.height - this.marginBottom - lastTextChildBottom;
            if (lastTextChildBottomMargin < 0) {
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y += lastTextChildBottomMargin;
                });
            }
        }

        this.scrollBg = new ScrollBg();
        this.showObject(this.scrollBg);

        this.scroll = new Scroll();
        if (this.pixiTexts.length > 0) {
            const firstTextChild = this.pixiTexts[0];
            const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
            const nextScrollHeight =
                ((app.view.height - this.marginTop) /
                    (lastTextChild.y + lastTextChild.height - firstTextChild.y)) *
                this.scrollBg.height;
            const nextScrollY = 150 + this.scrollBg.height - nextScrollHeight;
            if (nextScrollHeight <= this.scrollBg.height) {
                this.scroll.draw({
                    y: nextScrollY,
                    height: nextScrollHeight,
                });
            }
        }
        this.enableScrollDrag();
        this.showObject(this.scroll);

        const topMask = new TopMask(app.view.width, this.marginTop);
        this.showObject(topMask);

        const bottomMask = new BottomMask(
            0,
            app.view.height - this.marginBottom,
            app.view.width,
            this.marginBottom,
        );
        this.showObject(bottomMask);

        const title = new Title();
        this.showObject(title, false);

        const closeButton = new CloseButton(this);
        this.showObject(closeButton, false);

        this.isShowing = true;
        this.autoRecordText = false;
    }

    /**
     * 记录 `PIXI.Text` 对象。
     * @param pixiText 要记录的 `PIXI.Text` 对象。
     * @note 记录 `PIXI.Text` 对象到 `BackLog.recordedPixiTexts` 中。
     */
    public recordPixiText(pixiText: PIXI.Text) {
        this.recordedPixiTexts.push(pixiText);
    }

    /**
     * 显示对象到舞台。
     *
     * 调用 `BackLog.app.stage.addChildAt()` ，将对象显示到舞台中。
     * 同时，将对象添加到 `BackLog.showingObjects` 中。
     * 如果该对象是 `PIXI.Text` 类型，并且 `isRecorded` 为 `true`，则将对象添加到 `BackLog.pixiTexts` 中。
     * @param object 要显示的对象。
     * @param isRecorded 是否记录到 `BackLog.pixiTexts` 中。
     */
    private showObject(object: PIXI.DisplayObject, isRecorded?: boolean) {
        app.stage.addChildAt(object, app.stage.children.length);
        this.showingObjects.push(object);
        if (object instanceof PIXI.Text && isRecorded !== false) {
            this.pixiTexts.push(object);
        }
    }

    /**
     * 从舞台中移除所有对象。
     *
     * 调用 `BackLog.app.stage.removeChild()` ，将对象从舞台中移除。
     * 同时，清空 `BackLog.showingObjects` 和 `BackLog.pixiTexts`。
     */
    private removeAllObjects() {
        this.showingObjects.forEach((showingObject) => {
            app.stage.removeChild(showingObject);
        });
        this.showingObjects = [];
        this.pixiTexts = [];
    }

    /**
     * 绑定的 `Pixijs app` 对象。
     */
    private app: PIXI.Application<HTMLCanvasElement>;

    /**
     * 自动记录文本。
     *
     * 为 `true` 时，将自动记录文本。
     * @note 你可以在任何地方将其设为 `false` 或 `true`，以控制是否自动记录文本。
     * @default false
     */
    public autoRecordText: boolean;

    /**
     * 日志背景。
     *
     * 用于在 `BackLog.show()` 时，显示到舞台中阻止鼠标点击事件传递。
     */
    private background: Background;

    /**
     * 窗口高度。
     * @default 1080
     */
    private height: number;

    /**
     * 正在显示日志的标志。
     * @default false
     */
    public isShowing: boolean;

    /**
     * 文本行间距。
     * @default 36
     */
    private lineSpacing: number;

    /**
     * 日志文本上边距。
     * @default 150
     */
    private marginTop: number;

    /**
     * 日志文本下边距。
     * @default 80
     */
    private marginBottom: number;

    /**
     * 已记录的 `PIXI.Text` 数组。
     * @note 在调用 `BackLog.open()` 时，将文本显示到舞台中。
     */
    private recordedPixiTexts: PIXI.Text[] = [];

    /**
     * 日志中正在显示的 Pixi 对象。
     * @note 在调用 `BackLog.close()` 时，将这些对象从舞台中移除。
     */
    private showingObjects: PIXI.DisplayObject[] = [];

    /**
     * 滚动条。
     */
    private scroll: Scroll;

    /**
     * 滚动条背景。
     */
    private scrollBg: ScrollBg;

    /**
     * 舞台中的 `PIXI.Text` 数组。
     * @note 配合鼠标滚轮事件，控制文本上下移动。
     */
    private pixiTexts: PIXI.Text[] = [];

    /**
     * 窗口宽度。
     * @default 1920
     */
    public width: number;
}

/**
 * 日志背景。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中阻止鼠标点击事件传递。
 * @since 1.0.0
 */
class Background extends PIXI.Graphics {
    /**
     * @param width 背景宽度。
     * @param height 背景高度。
     */
    constructor(width: number, height: number) {
        super();
        this.beginFill(0x000000, 0.8);
        this.drawRect(0, 0, width, height);
        this.endFill();
        this.eventMode = 'static';
        this.on('click', (event) => {
            event.stopPropagation();
        });
    }
}

/**
 * 关闭按钮。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中，点击后将关闭日志。
 * @since 1.0.0
 */
class CloseButton extends PIXI.Text {
    /**
     * @param backLog 日志对象。
     */
    constructor(backLog: BackLog) {
        super(
            '×',
            new PIXI.TextStyle({
                fill: '#ffffff',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: 49,
            }),
        );
        this.x = 1800;
        this.y = 960;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('click', () => {
            backLog.close();
        });
    }
}

/**
 * 标题。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中。
 * @since 1.0.0
 */
class Title extends PIXI.Text {
    constructor() {
        super(
            'Back Log',
            new PIXI.TextStyle({
                fill: '#ffffff',
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                fontSize: 49,
            }),
        );
        this.x = 0;
        this.y = 20;
    }
}

/**
 * 顶部遮罩。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中，遮挡上方的文本。
 * @since 1.0.0
 */
class TopMask extends PIXI.Graphics {
    /**
     * @param width 遮罩宽度。
     * @param height 遮罩高度。
     */
    constructor(width: number, height: number) {
        super();
        this.beginFill(0x000000, 1);
        this.drawRect(0, 0, width, height);
        this.endFill();
    }
}

/**
 * 底部遮罩。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中，遮挡下方的文本。
 * @since 1.0.0
 */
class BottomMask extends PIXI.Graphics {
    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.beginFill(0x000000, 1);
        this.drawRect(x, y, width, height);
        this.endFill();
    }
}

/**
 * 消息。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中，显示文本。
 * @since 1.0.0
 */
class Message extends PIXI.Text {
    /**
     * @param pixiText 要显示的文本。
     * @param backLogWidth 日志宽度。
     */
    constructor(pixiText: PIXI.Text, backLogWidth: number) {
        super(pixiText.text);
        this.x = 320;
        this.y = 150;
        this.style = new PIXI.TextStyle({
            fill: pixiText.style.fill,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 49,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: backLogWidth - this.x - this.x,
        });
    }
}

/**
 * A scroll component to be used in the BackLog.
 * @since 1.0.0
 */
export class Scroll extends PIXI.Graphics {
    constructor() {
        super();
        this.draw();
    }

    /**
     * Draw the scroll.
     * @param elm The element to be drawn.
     */
    public draw = (elm?: {
        color?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        radius?: number;
        border?: number;
    }) => {
        const color = elm && elm.color ? elm.color : 0xe5e5e5;
        const x = elm && elm.x ? elm.x : 1700;
        this.absoluteY = elm && elm.y ? elm.y : 150;
        const width = elm && elm.width ? elm.width : 20;
        const height = elm && elm.height ? elm.height : app.view.height > 0 ? app.view.height : 840;
        const radius = elm && elm.radius ? elm.radius : 10;
        const border = elm && elm.border ? elm.border : 4;
        this.clear();
        this.beginFill(color);
        this.drawRoundedRect(x, this.absoluteY, width - border * 2, height, radius);
        this.endFill();
    };

    /**
     * The absolute position of the displayObject on the y axis, in pixels.
     * @default 150
     */
    public absoluteY: number;

    /**
     * Whether the scroll is pressing.
     * @default false
     */
    public pressing: boolean;
}

/**
 * A scroll background component to be used in the BackLog.
 * @since 1.0.0
 */
export class ScrollBg extends PIXI.Graphics {
    constructor() {
        super();
        this.draw();
    }

    /**
     * Draw the scroll background.
     * @param elm The element to be drawn.
     */
    public draw = (elm?: {
        color?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        radius?: number;
        border?: number;
    }) => {
        const color = elm && elm.color ? elm.color : 0x727272;
        const x = elm && elm.x ? elm.x : 1700;
        this.absoluteY = elm && elm.y ? elm.y : 150;
        const width = elm && elm.width ? elm.width : 20;
        const height = elm && elm.height ? elm.height : 840;
        const radius = elm && elm.radius ? elm.radius : 10;
        const border = elm && elm.border ? elm.border : 4;
        this.clear();
        this.beginFill(color);
        this.drawRoundedRect(x, this.absoluteY, width - border * 2, height - border * 2, radius);
        this.endFill();
    };

    /**
     * The absolute position of the displayObject on the y axis, in pixels.
     * @default 150
     */
    public absoluteY: number;
}

export const backLog = new BackLog();
