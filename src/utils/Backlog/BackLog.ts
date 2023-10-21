import { Text, Container, FederatedPointerEvent } from 'pixi.js';
import { app } from '../app';
import { Message } from './Message';
import { Background } from './Background';
import { Scroll } from './Scroll';
import { Title } from './Ttitle';
import { TopMask } from './TopMask';
import { BottomMask } from './BottomMask';
import { CloseButton } from './CloseButton';

/**
 * 基于 `Pixijs` 的日志模块。
 *
 * @since 1.0.0
 */
export class BackLog {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();

    /**
     * 自动启动鼠标滚轮检测和鼠标右键检测。
     * 向上滚动鼠标滚轮，显示日志。
     * 显示日志时，右键点击鼠标，关闭日志；上下滚动鼠标滚轮，控制日志文本上下移动。
     */
    constructor() {
        this.marginTop = 150;
        this.marginBottom = 80;
        this.lineSpacing = 36;
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
     * 同时，仅在已显示日志时，调整 `this.scroll.scroll` 相对于 `this.scroll.background`的位置。
     * @note 该方法会在构造函数中自动调用。
     */
    private enableWheelDetection() {
        app.view.addEventListener('wheel', (event) => {
            if (event.deltaY < 0 && !this.isShowing) {
                this.open();
                return;
            }

            if (this.isShowing && this.pixiTexts.length <= 0) {
                return;
            }

            if (event.deltaY < 0 && this.isShowing && this.getFirstPixiText().y < this.marginTop) {
                const step = Math.min(30, this.marginTop - this.getFirstPixiText().y);
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y += step;
                });
            } else if (
                event.deltaY > 0 &&
                this.isShowing &&
                this.getLastPixiText().y + this.getLastPixiText().height > this.height - this.marginBottom
            ) {
                const step = Math.min(
                    30,
                    this.getLastPixiText().y + this.getLastPixiText().height - (this.height - this.marginBottom),
                );
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y -= step;
                });
            }

            if(this.isShowing) {
                this.scroll.drawScroll({
                    y:
                        150 +
                        (Math.abs(this.marginTop - this.getFirstPixiText().y) /
                            (this.getLastPixiText().y +
                                this.getLastPixiText().height -
                                this.getFirstPixiText().y -
                                (this.height - this.marginTop - this.marginBottom))) *
                            (this.scroll.background.height - this.scroll.scroll.height),
                    height:
                        ((this.height - this.marginTop) /
                            (this.getLastPixiText().y + this.getLastPixiText().height - this.getFirstPixiText().y)) *
                        this.scroll.background.height,
                });
            }
        });
    }

    /**
     * 启用滚动条拖动。
     *
     * 只能相对于 `this.scroll.background` 上下拖动。
     * 鼠标光标变为 `grab` 时，表示可以拖动。
     * 鼠标光标变为 `grabbing` 时，表示正在拖动。
     */
    private enableScrollDrag() {
        this.scroll.scroll.eventMode = 'static';
        this.scroll.scroll.cursor = 'grab';

        /** Interaction mouse/touch down handler */
        this.scroll.scroll.on('pointerdown', () => {
            this.scroll.pressing = true;
            this.scroll.scroll.cursor = 'grabbing';
            this.background.hitArea.cursor = 'grabbing';
        });

        /** Interaction mouse/touch move handler */
        this.background.hitArea.on('pointermove', (e: FederatedPointerEvent) => {
            if (!this.scroll.pressing) return;

            const stepY = e.movementY * 2;

            if (this.scroll.moveScroll(stepY)) {
                if (stepY < 0 && this.getFirstPixiText().y < this.marginTop) {
                    const step = Math.min(
                        (-stepY / this.scroll.background.height) *
                            (this.getLastPixiText().y +
                                this.getLastPixiText().height -
                                this.getFirstPixiText().y +
                                this.marginBottom +
                                this.marginTop),
                        this.marginTop - this.getFirstPixiText().y,
                    );
                    this.pixiTexts.forEach((pixiText) => {
                        pixiText.y += step;
                    });
                } else if (
                    stepY > 0 &&
                    this.getLastPixiText().y + this.getLastPixiText().height > this.height - this.marginBottom
                ) {
                    const step = Math.min(
                        (stepY / this.scroll.background.height) *
                            (this.getLastPixiText().y +
                                this.getLastPixiText().height -
                                this.getFirstPixiText().y +
                                this.marginBottom +
                                this.marginTop),
                        this.getLastPixiText().y +
                                this.getLastPixiText().height -
                            (this.height - this.marginBottom),
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
            this.scroll.scroll.cursor = 'grab';
            this.background.hitArea.cursor = 'default';
        };
        this.scroll.scroll.on('pointerup', onPointerUp);
        this.background.hitArea.on('pointerup', onPointerUp);
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
     * 获取第一个 `this.pixiTexts` 对象。
     * @returns 第一个 `this.pixiTexts` 对象。
     * @note 如果 `this.pixiTexts` 为空，则返回 `undefined`。
     */
    private getFirstPixiText() {
        if (this.pixiTexts.length <= 0) {
            return undefined;
        }
        return this.pixiTexts[0];
    }

    /**
     * 获取最后一个 `this.pixiTexts` 对象。
     * @returns 最后一个 `this.pixiTexts` 对象。
     * @note 如果 `this.pixiTexts` 为空，则返回 `undefined`。
     */
    private getLastPixiText() {
        if (this.pixiTexts.length <= 0) {
            return undefined;
        }
        return this.pixiTexts[this.pixiTexts.length - 1];
    }

    /**
     * When a child of this container is removed, the text will be recorded.
     * @param target The target container to observe.
     */
    public observeTextChanges(target: Container) {
        target.on('childRemoved', (child) => {
            if (this.autoRecordText && child.children[0] instanceof Text) {
                this.recordPixiText(child.children[0]);
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

        // Resize
        this.resize(app.view.width, app.view.height);

        this.background = new Background(this.width, this.height);
        this.showObject(this.background);

        this.recordedPixiTexts.forEach((pixiText, index) => {
            const message = new Message(pixiText, this.width);
            if (index !== 0) {
                const lastTextChild = this.pixiTexts[index - 1];
                message.text.y = lastTextChild.y + lastTextChild.height + this.lineSpacing;
            }
            this.showObject(message);
        });

        if (this.pixiTexts.length > 0) {
            const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
            const lastTextChildBottom = lastTextChild.y + lastTextChild.height;
            const lastTextChildBottomMargin =
                this.height - this.marginBottom - lastTextChildBottom;
            if (lastTextChildBottomMargin < 0) {
                this.pixiTexts.forEach((pixiText) => {
                    pixiText.y += lastTextChildBottomMargin;
                });
            }
        }

        this.scroll = new Scroll();
        if (this.pixiTexts.length > 0) {
            const firstTextChild = this.pixiTexts[0];
            const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
            const nextScrollHeight =
                ((this.height - this.marginTop) /
                    (lastTextChild.y + lastTextChild.height - firstTextChild.y)) *
                this.scroll.background.height;
            const nextScrollY = 150 + this.scroll.background.height - nextScrollHeight;
            if (nextScrollHeight <= this.scroll.background.height) {
                this.scroll.drawScroll({
                    y: nextScrollY,
                    height: nextScrollHeight,
                });
            }
        }
        this.enableScrollDrag();
        this.showObject(this.scroll);

        const topMask = new TopMask(this.width, this.marginTop);
        this.showObject(topMask);

        const bottomMask = new BottomMask(
            0,
            this.height - this.marginBottom,
            this.width,
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
    public recordPixiText(pixiText: Text) {
        this.recordedPixiTexts.push(pixiText);
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
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
    private showObject(object: Background | Message | Scroll | BottomMask | TopMask | Title | CloseButton, isRecorded?: boolean) {
        this.view.addChildAt(object.view, this.view.children.length);
        this.showingObjects.push(object.view);
        if (object instanceof Message && isRecorded !== false) {
            this.pixiTexts.push(object.text);
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
            this.view.removeChild(showingObject);
        });
        this.showingObjects = [];
        this.pixiTexts = [];
    }

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
    private recordedPixiTexts: Text[] = [];

    /**
     * 日志中正在显示的 Pixi 对象。
     * @note 在调用 `BackLog.close()` 时，将这些对象从舞台中移除。
     */
    private showingObjects: Container[] = [];

    /**
     * 滚动条。
     */
    private scroll: Scroll;

    /**
     * 舞台中的 `PIXI.Text` 数组。
     * @note 配合鼠标滚轮事件，控制文本上下移动。
     */
    private pixiTexts: Text[] = [];

    /**
     * 窗口宽度。
     * @default 1920
     */
    public width: number;
}
