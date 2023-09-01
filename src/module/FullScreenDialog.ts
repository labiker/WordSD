import * as PIXI from 'pixi.js';

/**
 * @author Labiker
 * @description FullScreenDialog 是用于管理全屏对话框的类。
 */
export default class FullScreenDialog{
    /**
     * 构建 FullScreenDialog 对象
     * @param app Pixijs App
     * @returns 无
     */
    constructor(app: PIXI.Application<HTMLCanvasElement>) {
      this.app = app;
      this.width = app.view.width;
      this.height = app.view.height;
      // 文本相关
      this.fontSize = 49;
      this.marginRight = 320;
      this.marginLeft = 320;
      this.marginTop = 150;
      this.marginBottom = 200;
      this.wordWrapWidth = this.width - this.marginRight - this.marginLeft;
      this.lineSpacing = 6;
      this.normalModeTextSpeed = 30;
      this.textSpeed = this.normalModeTextSpeed;
      // 构建背景
      this.background = new PIXI.Graphics();
      this.background.beginFill(0x000000, 0.5);
      this.background.drawRect(0, 0, this.width, this.height);
      this.background.endFill();
      this.background.eventMode = 'static';
      this.background.on('click', (event) => {
        event.stopPropagation(); // 阻止事件传递
      });
      this.app.stage.addChildAt(this.background, this.app.stage.children.length);
      // 快进模式相关
      this.skipMode = false;
      this.skipModeTextSpeed = 3;
      // 构建文本样式
      this.textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: this.fontSize,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: this.wordWrapWidth,
        lineJoin: 'round',
      });
      this.clickableTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: this.fontSize,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#00ff99', '#ffffff'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: this.wordWrapWidth,
        lineJoin: 'round',
      });
      // 启用按键检测
      this.enableKeyDetection();
    }
    /**
     * 清空对话框
     * @returns 无
     */
    clearDialog(){
      this.textChildren.forEach((textChild) => {
        this.app.stage.removeChild(textChild);
      });
      this.textChildren = [];
    }
    /**
     * 显示文本
     * @param text 显示文本
     * @description 直接显示所有文本。可以通过 FullScreenDialog.printText('Hello World!') 显示文本。
     */
    printText(text: string): void {
      // 初始化文本，并设置文本样式
      const message = new PIXI.Text(text, this.textStyle);
      // 设置文本的左边距
      message.x = this.marginRight;
      // 判断是否为首次打印文本
      if (this.textChildren.length === 0) {
        // 如果是首次打印文本，则将其y设为 marginTop
        message.y = this.marginTop;
      } else {
        const lastTextChild = this.textChildren[this.textChildren.length - 1];
        // 如果上一个文本是不可交互的普通文本，则设为半透明
        if (lastTextChild.style === this.textStyle) {
          lastTextChild.alpha = 0.5;
        }
        // 判断是否需要清空舞台中的文本
        if (lastTextChild.y + lastTextChild.height + this.lineSpacing + this.marginBottom > this.height) {
          // 如果已超过下边距，则清空舞台中的文本
          this.textChildren.forEach((textChild) => {
            this.app.stage.removeChild(textChild);
          });
          // 将其y设为 marginTop
          message.y = this.marginTop;
        } else {
          // 如果不是首次打印文本，且不需要清空舞台中的文本，则将其y设为上一个文本的y + height + lineSpacing
          message.y = lastTextChild.y + lastTextChild.height + this.lineSpacing;
        }
      }
      // 将文本添加到舞台中
      this.app.stage.addChildAt(message, this.app.stage.children.length);
      // 将文本添加到 textChildren 中
      this.textChildren.push(message);
    }
    /**
     * 异步打印文本
     * @param text 要打印的文本
     * @description 将打印时间均摊在每个字上，逐字打印文本。
     * @return Promise<void>
     */
    async printTextAsync(text: string): Promise<void> {
      // 初始化文本
      this.printText('');
      // 获取最后一个文本
      const lastTextChild = this.textChildren[this.textChildren.length - 1];
      // 将文本拆分为单个字符
      const textArray = text.split('');
      // 检测鼠标左键点击行为
      let isClicked = false;
      this.background.addEventListener('click', () => {
        isClicked = true;
      });
      // 遍历字符数组，逐字打印文本
      for (const char of textArray) {
        if (isClicked) {
          // 如果已点击，则将剩余的字符全部打印出来
          lastTextChild.text = text;
          break;
        } else {
          // 如果未点击，则将当前字符添加到文本中
          lastTextChild.text += char;
          // 等待一段时间
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true);
            }, this.textSpeed);
          });
        }
      }
    }
    /**
     * 打印可被点击文本
     * @param text 要打印的文本
     * @param func 点击后调用的函数
     * @description 该文本可响应点击，点击后调用指定的函数
     * @returns 无
     */
    printClickableText(text: string, func: () => void): void {
      // 显示文本
      this.printText(text);
      // 获取最后一个文本
      const lastTextChild = this.textChildren[this.textChildren.length - 1];
      // 设置最后一个文本的样式
      lastTextChild.style = this.clickableTextStyle;
      // 设置最后一个文本的交互模式为静态
      lastTextChild.eventMode = 'static';
      // 设置最后一个文本的鼠标样式为手型
      lastTextChild.cursor = 'pointer';
      // 设置最后一个文本的交互模式为按钮
      lastTextChild.on('pointerdown', func);
    }
    /**
     * 等待点击
     * @description 等待鼠标左键点击。会显示等待字符。
     * @returns Promise<void>
     */
    waitForClick() {
      // 如果当前处于快进模式，则不等待点击
      if (this.skipMode) {
        return;
      }
      // 获取最新的文本
      const lastTextChild = this.textChildren[this.textChildren.length - 1];
      if (lastTextChild === undefined) { // 如果当前没有文本，则直接返回
        return new Promise<void>((resolve) => {
          this.background.addEventListener('click', () => {resolve()});
        });
      } else { // 如果当前存在文本，则显示等待字符
        lastTextChild.text += ' ';
        // 设置一个定时器，用于显示等待字符
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
        // 清除定时器的函数
        const clearTimer = () => {
          // 清除定时器
          clearInterval(timer);
          // 还原最新的文本
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
        // 创建点击事件处理函数
        const clickHandler = () => {
          // 清除定时器
          clearTimer();
          // 移除点击事件监听器
          this.background.removeEventListener('click', clickHandler, false);
        };
        // 创建按键事件处理函数
        const keyHandler = (event: KeyboardEvent) => {
          // 如果按下 Ctrl 键，则清除定时器，并移除按键事件监听器
          if (event.ctrlKey) {
            clearTimer();
            window.removeEventListener('keydown', keyHandler, false);
          }
        };
        return new Promise<void>((resolve) => {
          // 添加点击事件监听器，用于清除等待字符
          this.background.addEventListener('click', clickHandler, false);
          window.addEventListener('keydown', keyHandler, false);
          // 添加点击事件监听器，用于返回 Promise
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
     * 启用按键检测
     * @description 当按下 Ctrl 键时，会将 FullScreenDialog.skipMode 设置为 true，松开时会将其设置为 false。
     * 同时会将 FullScreenDialog.textSpeed 设置为 FullScreenDialog.skipModeTextSpeed 或 FullScreenDialog.normalModeTextSpeed。
     * @note 该方法会在构造函数中自动调用。
     * @returns 无
     */
    enableKeyDetection() {
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
     * Pixijs app
     * @description 绑定的 Pixijs app 对象。
     */
    private app: PIXI.Application<HTMLCanvasElement>;
    /** 
     * 对话框背景
     * @description 用于绑定点击事件。最先加入舞台，位于最底层。
     */
    private background: PIXI.Graphics;
    /**
     * 可被点击的文本样式
     * @description 表示可被点击的文本样式。
     * 可以通过 FullScreenDialog.clickableTextStyle 访问。
     * 可以通过 FullScreenDialog.clickableTextStyle = new PIXI.TextStyle({...}) 修改。
     */
    public clickableTextStyle: PIXI.TextStyle;
    /**
     * 文字大小
     * @description 默认值为 49。
     */
    private fontSize: number;
    /**
     * 快进模式
     * @description 默认值为 false。按下 Ctrl 键时为 true，松开时为 false。
     */
    private skipMode: boolean;
    /**
     * 快进模式下的文本显示速度
     * @description 单位：毫秒/字。默认值为 3。
     */
    private skipModeTextSpeed: number;
    /**
     * 普通模式下的文本显示速度
     * @description 单位：毫秒/字。默认值为 30。
     */
    private normalModeTextSpeed: number;

    /** 
     * 窗口高度
     * @description 默认值为 1080。
     */
    private height: number;
    /**
     * 文本行间距
     * @description 默认值为 6。
     */
    private lineSpacing: number;
    /** 
     * 文字右边距
     * @description 指定用于禁入处理的右边距字符数。
     * @note 在竖写模式下，解释为下端的字符数。
     */
    private marginRight: number;
    /** 
     * 文字左边距
     * @description 指定用于禁入处理的左边距字符数。
     * @note 在竖写模式下，解释为上端的字符数。
     */
    private marginLeft: number;
    /** 
     * 文字上边距
     * @description 指定用于禁入处理的上边距字符数。
     * @note 在竖写模式下，解释为右端的字符数。
     */
    private marginTop: number;
    /** 
     * 文字下边距
     * @description 指定用于禁入处理的下边距字符数。
     * @note 在竖写模式下，解释为左端的字符数。
     */
    private marginBottom: number;
    /**
     * 舞台中的文本数组
     * @description 表示舞台中的文本数组。可以通过 FullScreenDialog.textChildren 访问。
     */
    private textChildren: PIXI.Text[] = [];
    /**
     * 文字显示速度
     * @description 单位：毫秒/字。
     * @note 在快进模式下为 FullScreenDialog.skipModeTextSpeed，在普通模式下为 FullScreenDialog.normalModeTextSpeed。
     */
    private textSpeed: number;
    /**
     * 文本样式
     * @description 表示文本样式。
     * 可以通过 FullScreenDialog.textStyle 访问。
     * 可以通过 FullScreenDialog.textStyle = new PIXI.TextStyle({...}) 修改。
     */
    private textStyle: PIXI.TextStyle;
    /** 
     * 窗口宽度
     * @description 默认值为 1920。
     */
    private width: number;
    /** 
     * 文本换行的宽度
     * @description 需要将 wordWrap 设置为 true 才能使用。
     * @note 默认值为 FullScreenDialog.width - FullScreenDialog.marginRight - FullScreenDialog.marginLeft。
     */
    private wordWrapWidth: number;
}