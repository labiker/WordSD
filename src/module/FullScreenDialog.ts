import * as PIXI from 'pixi.js';

/**
 * 全屏对话框
 * 
 * @since 1.0.0
 */
export default class FullScreenDialog{
    /**
     * 自动启动 `ctrl` 键检测。按下时为快进模式，松开时为普通模式。
     * @param app Pixijs App
     * @note 快进模式下，文本显示速度更快，且不会等待点击。
     */
    constructor(app: PIXI.Application<HTMLCanvasElement>) {
      this.app = app;
      this.width = app.view.width;
      this.height = app.view.height;
      this.marginBottom = 200;
      this.lineSpacing = 6;
      this.normalModeTextSpeed = 30;
      this.textSpeed = this.normalModeTextSpeed;
      this.skipMode = false;
      this.skipModeTextSpeed = 3;
      this.background = new Background(this.width, this.height);
      this.showObject(this.background);
      this.enableKeyDetection();
    }

    /**
     * 清空对话框。
     */
    public clearDialog(){
      this.pixiTexts.forEach((pixiText) => {
        this.app.stage.removeChild(pixiText);
      });
      this.pixiTexts = [];
    }

    /**
     * 显示文本。
     * 
     * 如果上一个文本是不可响应点击事件的文本，则设为半透明。
     * 当文本超出对话框范围时，会自动调用清空对话框。
     * 如果不是首次打印文本，且不需要清空舞台中的文本，则将其 `y` 设为上一个文本的 `y + height + lineSpacing`。
     * @param text 显示文本
     */
    public printText(text: string): void {
      const message = new Message(text, this.width);
      if (this.pixiTexts.length !== 0) {
        const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
        if (lastTextChild.style === message.style) {
          lastTextChild.alpha = 0.5;
        }
        if (lastTextChild.y + lastTextChild.height + this.lineSpacing + this.marginBottom > this.height) {
          this.clearDialog();
        } else {
          message.y = lastTextChild.y + lastTextChild.height + this.lineSpacing;
        }
      }
      this.showObject(message);
    }

    /**
     * 异步打印文本。
     * 
     * 根据 `this.textSpeed` 的值，逐字打印文本。
     * 如果出现点击事件，则将剩余的字符全部打印出来。
     * @param text 要打印的文本。
     */
    async printTextAsync(text: string): Promise<void> {
      this.printText('');
      const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
      const charArray = text.split('');

      let isClicked = false;
      const clickHandler = () => {
        isClicked = true;
        this.background.removeEventListener('click', clickHandler, false);
      };
      this.background.addEventListener('click', clickHandler, false);

      for (const char of charArray) {
        if (isClicked) {
          lastTextChild.text = text;
          break;
        } else {
          lastTextChild.text += char;
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, this.textSpeed);
          });
        }
      }
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
      const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1] as Message;
      lastTextChild.style = lastTextChild.clickableTextStyle;
      lastTextChild.eventMode = 'static';
      lastTextChild.cursor = 'pointer';
      lastTextChild.on('pointerdown', func);
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
        return;
      }

      const lastTextChild = this.pixiTexts[this.pixiTexts.length - 1];
      if (lastTextChild === undefined) {
        return new Promise<void>((resolve) => {
          this.background.addEventListener('click', () => {resolve()});
        });
      } else {
        lastTextChild.text += ' ';

        const timer = setInterval(() => {
          if (lastTextChild.text.endsWith(' ')) {
            lastTextChild.text = lastTextChild.text.slice(0, -1) + ' .';
          } else if (lastTextChild.text.endsWith(' .')) {
            lastTextChild.text = lastTextChild.text.slice(0, -2) + ' ..';
          } else if (lastTextChild.text.endsWith(' ..')) {
            lastTextChild.text = lastTextChild.text.slice(0, -3) + ' ...';
          } else if (lastTextChild.text.endsWith(' ...')) {
            lastTextChild.text = lastTextChild.text.slice(0, -4) + ' ';
          }
        }, 500);

        const clearTimer = () => {
          clearInterval(timer);
          if (lastTextChild.text.endsWith(' ')) {
            lastTextChild.text = lastTextChild.text.slice(0, -1);
          } else if (lastTextChild.text.endsWith(' .')) {
            lastTextChild.text = lastTextChild.text.slice(0, -2);
          } else if (lastTextChild.text.endsWith(' ..')) {
            lastTextChild.text = lastTextChild.text.slice(0, -3);
          } else if (lastTextChild.text.endsWith(' ...')) {
            lastTextChild.text = lastTextChild.text.slice(0, -4);
          }
        }

        const clickHandler = () => {
          clearTimer();
          this.background.removeEventListener('click', clickHandler, false);
        };

        const keyHandler = (event: KeyboardEvent) => {
          if (event.ctrlKey) {
            clearTimer();
            window.removeEventListener('keydown', keyHandler, false);
          }
        };

        return new Promise<void>((resolve) => {
          this.background.addEventListener('click', clickHandler, false);
          window.addEventListener('keydown', keyHandler, false);
          this.background.addEventListener('click', () => {resolve()});
          window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.ctrlKey) {
              resolve()
            }
          });
        });
      }
    }

    /**
     * 启用按键检测。
     * 
     * 按下 `Ctrl` 键时，使 `this.skipMode = true`，同时使 `this.textSpeed = this.skipModeTextSpeed`。
     * 
     * 松开 `Ctrl` 键时，使 `this.skipMode = false`，同时使 `this.textSpeed = this.normalModeTextSpeed`。
     * @note 该方法会在构造函数中自动调用。
     */
    private enableKeyDetection() {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.ctrlKey) {
          this.skipMode = true;
          this.textSpeed = this.skipModeTextSpeed;
        }
      });
      window.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'Control') {
          this.skipMode = false;
          this.textSpeed = this.normalModeTextSpeed;
        }
      });
    }

    /**
     * 显示对象到舞台。
     * 
     * 调用 `this.app.stage.addChildAt()` ，将对象显示到舞台中。
     * 同时，将对象添加到 `this.showingObjects` 中。
     * 如果该对象是 `PIXI.Text` 类型，并且 `isRecorded` 为 `true`，则将对象添加到 `this.pixiTexts` 中。
     * @param object 要显示的对象。
     * @param isRecorded 是否记录到 `this.pixiTexts` 中。
     */
    private showObject(object: PIXI.DisplayObject, isRecorded?: boolean) {
      this.app.stage.addChildAt(object, this.app.stage.children.length);
      this.showingObjects.push(object);
      if (object instanceof PIXI.Text && isRecorded !== false) {
        this.pixiTexts.push(object);
      }
    }

    /**
     * 绑定的 `Pixijs app` 对象。
     */
    private app: PIXI.Application<HTMLCanvasElement>;

    /** 
     * 对话框背景。
     * @description 用于绑定点击事件。最先加入舞台，位于最底层。
     */
    private background: Background;

    /**
     * 可响应点击事件的文本的样式。
     */
    public clickableTextStyle: PIXI.TextStyle;

    /** 
     * 全屏对话框中正在显示的 Pixi 对象。
     */
    private showingObjects: PIXI.DisplayObject[] = [];

    /**
     * 快进模式。
     * @note 按下 `Ctrl` 键时为 `true`，松开时为 `false`。
     * @default false
     */
    private skipMode: boolean;

    /**
     * 快进模式下的文本显示速度。
     * @description 单位：毫秒/字。
     * @default 3
     */
    private skipModeTextSpeed: number;

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
     * 舞台中的 `PIXI.Text` 数组。
     */
    private pixiTexts: PIXI.Text[] = [];

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

/**
 * 背景。
 * @note 用于绑定点击事件。最先加入舞台，位于最底层。
 * @since 1.0.0
 */
class Background extends PIXI.Graphics {
  constructor(width?: number, height?: number) {
    super();
    this.beginFill(0x000000, 0.5);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.eventMode = 'static';
    this.on('click', (event) => {
      event.stopPropagation();
    });
  }
}

class Message extends PIXI.Text {
  /**
   * @param text 要显示的文本
   * @param backLogWidth 日志宽度
   */
  constructor(text: string, backLogWidth: number) {
    super(text);
    this.x = 320;
    this.y = 150;
    this.style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 49,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'],
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: backLogWidth - this.x - this.x,
      lineJoin: 'round',
    });
    this.clickableTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 49,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#00ff99', '#ffffff'],
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: backLogWidth - this.x - this.x,
      lineJoin: 'round',
    });
  }

  /**
   * 可响应点击事件的文本的样式。
   */
  public clickableTextStyle: PIXI.TextStyle;
}