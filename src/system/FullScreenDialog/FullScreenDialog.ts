import { Container } from 'pixi.js';
import { Background } from './Background';
import { Message } from './Message';
import { ISystem } from '../ISystem';

/**
 * 全屏对话框
 *
 * @since 1.0.0
 */
export class FullScreenDialog implements ISystem {
    public SYSTEM_ID = 'FullScreenDialog';
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();

    /**
     * 自动启动 `ctrl` 键检测。按下时为快进模式，松开时为普通模式。
     * @note 快进模式下，文本显示速度更快，且不会等待点击。
     */
    constructor() {
        this.marginBottom = 200;
        this.lineSpacing = 6;
        this.normalModeTextSpeed = 30;
        this.textSpeed = this.normalModeTextSpeed;
        this.skipMode = false;
        this.skipModeTextSpeed = 0.3;
        this.background = new Background();
        this.showObject(this.background);
        this.enableKeyDetection();
    }

    /**
     * 清空对话框。
     */
    public clearDialog() {
        this.messages.forEach((message) => {
            this.view.removeChild(message.view);
        });
        this.messages = [];
    }

    /**
     * 显示文本。
     *
     * 如果上一个文本是不可响应点击事件的文本，则设为半透明。
     * 当文本超出对话框范围时，会自动调用清空对话框。
     * 如果不是首次打印文本，且不需要清空舞台中的文本，则将其 `y` 设为上一个文本的 `y + height + lineSpacing`。
     * 会根据 `type` 的值，设置文本的样式。
     * @param text 显示文本。
     * @param type 文本类型。
     */
    public printText(text: string, type?: 'warning' | 'hint'): void {
        const message = new Message(text, this.width);

        if (this.messages.length !== 0) {
            const lastMessage = this.messages[this.messages.length - 1];
            if (lastMessage.text.eventMode !== 'static') {
                lastMessage.text.alpha = 0.5;
            }
            if (
                lastMessage.text.y +
                    lastMessage.text.height +
                    this.lineSpacing +
                    this.marginBottom >
                this.height
            ) {
                this.clearDialog();
            } else {
                message.text.y = lastMessage.text.y + lastMessage.text.height + this.lineSpacing;
            }
        }

        message.setTextStyle(type);

        this.showObject(message);
    }

    /**
     * 异步打印文本。
     *
     * 根据 `this.textSpeed` 的值，逐字打印文本。
     * 如果出现点击事件，则将剩余的字符全部打印出来。
     * @param text 要打印的文本。
     * @param type 文本类型。
     */
    async printTextAsync(text: string, type?: 'warning' | 'hint'): Promise<void> {
        this.printText('_', type);
        const lastMessage = this.messages[this.messages.length - 1];
        const charArray = text.split('');
        const endChar = this.skipMode ? ' ' : '_';

        let isClicked = false;
        const clickHandler = () => {
            isClicked = true;
            this.background.hitArea.removeEventListener('click', clickHandler, false);
        };
        this.background.hitArea.addEventListener('click', clickHandler, false);

        for (const char of charArray) {
            if (isClicked) {
                lastMessage.text.text = text + endChar;
                break;
            } else {
                lastMessage.text.text = lastMessage.text.text.slice(0, -1) + char + endChar;
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, this.textSpeed);
                });
            }
        }

        lastMessage.text.text = lastMessage.text.text.slice(0, -1) + ' ';
    }

    /**
     * 打印可响应点击事件的文本。
     *
     * 调用 `this.printText()` 打印文本，然后将最新的文本设为可响应点击事件。
     * @param text 要打印的文本
     * @param func 点击后调用的函数
     * @note 该文本可响应点击，点击后调用指定的函数。
     */
    public printClickableText(text: string, func: () => void): void {
        this.printText(text);
        const lastMessage = this.messages[this.messages.length - 1];
        lastMessage.setTextStyle('clickable');
        lastMessage.text.eventMode = 'static';
        lastMessage.text.cursor = 'pointer';
        lastMessage.text.on('pointerdown', func);
    }

    public resize(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.background.draw(w, h);
    }

    /**
     * 等待。
     *
     * 处于快进模式时仍需等待。
     * 不显示等待字符。
     * 用于等待一个逻辑由假变真的事件。
     * @param target 等待的目标。
     * @note 通常放在 `this.printClickableText()` 之后。
     */
    public async waitFor(target: () => boolean): Promise<void> {
        while (!target()) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 100);
            });
        }
    }

    /**
     * 等待点击。
     *
     * 如果当前处于快进模式，则不等待点击。
     * 如果当前存在文本，则显示等待字符。
     * 如果按下 `Ctrl` 键，则立即返回。
     */
    public waitForClick() {
        if (this.skipMode) {
            return new Promise<void>((resolve) => {
                resolve();
            });
        }

        const lastMessage = this.messages[this.messages.length - 1];

        if (lastMessage === undefined) {
            return new Promise<void>((resolve) => {
                this.background.hitArea.addEventListener('click', () => {
                    resolve();
                });
            });
        }

        const timer = setInterval(() => {
            if (lastMessage.text.text.endsWith('_')) {
                lastMessage.text.text = lastMessage.text.text.slice(0, -1) + ' ';
            } else if (lastMessage.text.text.endsWith(' ')) {
                lastMessage.text.text = lastMessage.text.text.slice(0, -1) + '_';
            }
        }, 500);

        const clearTimer = () => {
            clearInterval(timer);
            lastMessage.text.text = lastMessage.text.text.slice(0, -1);
        };

        const clickHandler = () => {
            clearTimer();
            this.background.hitArea.removeEventListener('click', clickHandler, false);
        };

        const keyHandler = (event: KeyboardEvent) => {
            if (!this.enableGlobalKeyDetection) return;
            if (event.ctrlKey) {
                clearTimer();
                window.removeEventListener('keydown', keyHandler, false);
            }
        };

        return new Promise<void>((resolve) => {
            this.background.hitArea.addEventListener('click', clickHandler, false);
            window.addEventListener('keydown', keyHandler, false);
            this.background.hitArea.addEventListener('click', () => {
                resolve();
            });
            window.addEventListener('keydown', (event: KeyboardEvent) => {
                if (!this.enableGlobalKeyDetection) return;
                if (event.ctrlKey) {
                    resolve();
                }
            });
        });
    }

    /**
     * 启用按键检测。
     *
     * 若 `this.enableGlobalKeyDetection` 为 `true`，则启用全局按键检测。
     *
     * 按下 `Ctrl` 键时，使 `this.skipMode = true`，同时使 `this.textSpeed = this.skipModeTextSpeed`。
     *
     * 松开 `Ctrl` 键时，使 `this.skipMode = false`，同时使 `this.textSpeed = this.normalModeTextSpeed`。
     * @note 该方法会在构造函数中自动调用。
     */
    private enableKeyDetection() {
        this.enableGlobalKeyDetection = true;
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!this.enableGlobalKeyDetection) return;
            if (event.ctrlKey) {
                this.skipMode = true;
                this.textSpeed = this.skipModeTextSpeed;
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (!this.enableGlobalKeyDetection) return;
            if (event.key === 'Control') {
                this.skipMode = false;
                this.textSpeed = this.normalModeTextSpeed;
            }
        });
    }

    /**
     * 显示对象到舞台。
     *
     * 调用 `this.view.addChildAt()` ，将对象显示到舞台中。
     * 同时，将对象添加到 `this.showingObjects` 中。
     * 如果该对象是 `Message` 类型，并且 `isRecorded` 为 `true`，则将对象添加到 `this.messages` 中。
     * @param object 要显示的对象。
     * @param isRecorded 是否记录到 `this.messages` 中。
     */
    private showObject(object: Message | Background, isRecorded?: boolean) {
        this.view.addChildAt(object.view, this.view.children.length);
        this.showingObjects.push(object.view);
        if (object instanceof Message && isRecorded !== false) {
            this.messages.push(object);
        }
    }

    /**
     * 对话框背景。
     * @description 用于绑定点击事件。最先加入舞台，位于最底层。
     */
    private background: Background;

    /**
     * 全屏对话框中正在显示的 Pixi 对象。
     */
    private showingObjects: Container[] = [];

    /**
     * 快进模式。
     * @note 按下 `Ctrl` 键时为 `true`，松开时为 `false`。
     * @default false
     */
    private skipMode: boolean;

    /**
     * 快进模式下的文本显示速度。
     * @note 单位：毫秒/字。
     * @default 3
     */
    private skipModeTextSpeed: number;

    /**
     * 是否启用全局按键检测。
     * @note 出于开发缺陷，键盘事件是直接绑定到 `window` 上的，因此无法通过 `this.view.stage` 来阻止事件传递。
     * 单独使用 `FullScreenDialog` 时，并不会有什么问题，但是如果要与其它模块（比如 `BackLog`）一同使用时，就会出现问题。
     * 请根据程序需求，在必要的地方自定义需要禁用全局按键检测的逻辑。
     */
    public enableGlobalKeyDetection: boolean;

    /**
     * 普通模式下的文本显示速度
     * @description 单位：毫秒/字。
     * @default 30
     */
    private normalModeTextSpeed: number;

    /**
     * 窗口高度。
     * @default 1080
     */
    private height: number;

    /**
     * 文本行间距。
     * @default 6
     */
    private lineSpacing: number;

    /**
     * 文本下边距。
     * @default 200
     */
    private marginBottom: number;

    /**
     * 舞台中的 `Message` 数组。
     */
    private messages: Message[] = [];

    /**
     * 文本显示速度。
     * @note 单位：毫秒/字。
     * @default this.normalModeTextSpeed
     */
    private textSpeed: number;

    /**
     * 窗口宽度。
     * @default 1920
     */
    private width: number;
}
