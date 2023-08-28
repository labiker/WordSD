import * as PIXI from 'pixi.js';

/**
 * @author Labiker
 * @description BackLog 是用于管理文本日志的类。
 */
export default class BackLog{
    /**
     * 构建 BackLog 对象
     * @param app Pixijs App
     * @returns 无
     */
    constructor(app: PIXI.Application<HTMLCanvasElement>) {
      this.app = app;
      this.width = app.view.width;
      this.height = app.view.height;
      // 历史文本相关
      this.fontSize = 49;
      this.marginRight = 320;
      this.marginLeft = 320;
      this.marginTop = 150;
      this.marginBottom = 200;
      this.wordWrapWidth = this.width - this.marginRight - this.marginLeft;
      this.lineSpacing = 36;
      this.textStyle = new PIXI.TextStyle({
        fill: "#ffffff",
        fontFamily: "\"Times New Roman\", Times, serif",
        fontSize: this.fontSize,
        wordWrap: true,
        wordWrapWidth: this.wordWrapWidth,
      });
      // 标题相关
      this.titleMarginLeft = 0;
      this.titleMarginTop = 20;
      this.titleText = 'Back Log';
      this.titleTextStyle = new PIXI.TextStyle({
        fill: "#ffffff",
        fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
        fontSize: this.fontSize,
      });
      // 关闭按钮相关
      this.closeButtonX = 1800;
      this.closeButtonY = 950;
      // 初始化
      this.autoRecordText = false;
      this.recordedTexts = [];
      this.isShowing = false;
      this.observeTextChanges();
      this.enableKeyDetection();
    }
    /**
     * 关闭日志
     * @description 如果日志已经打开，则关闭日志。
     * @note 请和 BackLog.open() 配对使用。
     * @returns 无
     */
    public close() {
      // 判断是否已显示日志
      if (!this.isShowing) {
        return;
      }
      // 循环 showingObjects，从舞台中移除
      this.showingObjects.forEach((showingObject) => {
        this.app.stage.removeChild(showingObject);
      });
      // 清空 showingObjects
      this.showingObjects = [];
      // 设置正在显示日志的标志
      this.isShowing = false;
      // 开启自动记录文本
      this.autoRecordText = true;
    }
    /**
     * 启用按键检测
     * @description 当鼠标滚轮向上滚动时，显示日志。当鼠标滚轮向下滚动时，关闭日志。
     * @note 该方法会在构造函数中自动调用。
     * @returns 无
     */
    private enableKeyDetection() {
      // 监听鼠标滚轮事件
      this.app.view.addEventListener('wheel', (event) => {
        // 判断鼠标滚轮滚动方向
        if (event.deltaY < 0) {
          // 如果向上滚动，则打开日志，等待日志关闭
          this.open();
        } else {
          // 如果向下滚动，则关闭日志
          this.close();
        }
      });
    }
    /**
     * 观察文本变化
     * @description 检测 app.stage.children 中 Pixi.Text 类型的子对象是否被移除，则记录文本（自动记录模式下）。
     * @note 该方法会在构造函数中自动调用。
     * @returns 无
     */
    private observeTextChanges() {
      this.app.stage.on('childRemoved', (child) => {
        if (this.autoRecordText && child instanceof PIXI.Text) {
          this.recordText(child.text);
        }
      });
    }
    /**
     * 打开日志
     * @description 如果日志未打开，则打开日志。包含一个纯黑的背景，左上角显示一个醒目的标题，右下角有一个关闭按钮
     * @note 请和 BackLog.close() 配对使用。
     * @returns 无
     */
    public open() {
      // 判断是否已显示日志
      if (this.isShowing) {
        return;
      }
      // 显示背景
      this.background = new PIXI.Graphics();
      this.background.beginFill(0x000000, 0.8);
      this.background.drawRect(0, 0, this.width, this.height);
      this.background.endFill();
      this.background.eventMode = 'static';
      this.background.on('click', (event) => {
        event.stopPropagation(); // 阻止事件传递
      });
      this.showObject(this.background, this.app.stage.children.length)
      // 显示标题
      const title = new PIXI.Text(this.titleText, this.titleTextStyle);
      title.x = this.titleMarginLeft;
      title.y = this.titleMarginTop;
      this.showObject(title, this.app.stage.children.length);
      // 显示关闭按钮
      const closeButton = new PIXI.Text('×', this.textStyle);
      closeButton.x = this.closeButtonX;
      closeButton.y = this.closeButtonY;
      closeButton.eventMode = 'static';
      closeButton.cursor = 'pointer';
      closeButton.on('click', () => {
        this.close();
      });
      this.showObject(closeButton, this.app.stage.children.length);
      // 显示文本
      this.recordedTexts.forEach((text, index) => {
        const message = new PIXI.Text(text, this.textStyle);
        message.x = this.marginLeft;
        message.y = this.marginTop + index * (this.fontSize + this.lineSpacing);
        this.showObject(message, this.app.stage.children.length);
      });
      // 设置正在显示日志的标志
      this.isShowing = true;
      // 关闭自动记录文本
      this.autoRecordText = false;
    }
    /**
     * 记录文本
     * @description 记录文本到日志中。
     * @param text 要记录的文本
     * @returns 无
     */
    public recordText(text: string) {
      this.recordedTexts.push(text);
    }
    /**
     * 显示对象到舞台
     * @description 调用 app.stage.addChildAt() 方法，将对象显示到舞台中。同时，将对象记录到 showingObjects 中。
     * @returns 无
     */
    private showObject(object: PIXI.DisplayObject, index: number) {
      this.app.stage.addChildAt(object, index);
      this.showingObjects.push(object);
    }
    /**
     * Pixijs app
     * @description 绑定的 Pixijs app 对象。
     */
    private app: PIXI.Application<HTMLCanvasElement>;
    /**
     * 自动记录文本
     * @description 默认值为 false，为 true 时，将自动记录文本。
     * @note 你可以在任何地方将其设为 false 或 true，以控制是否自动记录文本。
     */
    public autoRecordText: boolean;
    /** 
     * 日志背景
     * @description 用于绑定点击事件。位于最上层。
     */
    private background: PIXI.Graphics;
    /** 
     * 关闭按钮的x坐标
     * @description 默认值为 1000.
     */
    private closeButtonX: number;
    /**
     * 关闭按钮的y坐标
     * @description 默认值为 600.
     */
    private closeButtonY: number;
    /**
     * 文字大小
     * @description 默认值为 49。
     */
    private fontSize: number;
    /** 
     * 窗口高度
     * @description 默认值为 1080。
     */
    private height: number;
    /** 
     * 正在显示日志的标志
     * @description 初始值为 false 。
     */
    private isShowing: boolean;
    /**
     * 文本行间距
     * @description 默认值为 36。
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
     * 日志中的纯文本数组
     * @description 在 BackLog.show() 时，将 recordedTexts 中的文本显示到舞台中。
     */
    private recordedTexts: string[] = [];
    /** 
     * 日志中正在显示的 Pixi 对象
     * @description 用于在调用 BackLog.close() 时，清空舞台中的对象。
     */
    private showingObjects: PIXI.DisplayObject[] = [];
    /**
     * 文本样式
     * @description 表示文本样式。
     * 可以通过 FullScreenDialog.textStyle 访问。
     * 可以通过 FullScreenDialog.textStyle = new PIXI.TextStyle({...}) 修改。
     */
    private textStyle: PIXI.TextStyle;
    /** 
     * 标题左边距
     * @description 默认值为 0.
     */
    private titleMarginLeft: number;
    /**
     * 标题上边距
     * @description 默认值为 20.
     */
    private titleMarginTop: number;
    /**
     * 标题文字内容
     * @description 默认值为 Back Log.
     */
    private titleText: string;
    /**
     * 标题文字样式
     */
    private titleTextStyle: PIXI.TextStyle;
    /** 
     * 窗口宽度
     * @description 表示窗口宽度。默认值为 1920。
     */
    private width: number;
    /** 
     * 文本换行的宽度
     * @description 需要将 wordWrap 设置为 true 才能使用。
     * @note 默认值为 BackLog.width - BackLog.marginRight - BackLog.marginLeft。
     */
    private wordWrapWidth: number;
}