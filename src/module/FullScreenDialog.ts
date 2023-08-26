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
      this.fontSize = 36;
      this.marginRight = 50;
      this.marginLeft = 50;
      this.marginTop = 50;
      this.marginBottom = 50;
      this.wordWrapWidth = this.width - this.marginRight - this.marginLeft;
      this.lineSpacing = 6;
      this.textSpeed = 30;
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
    }
    /**
     * 自动缩放
     * @returns 无
     */
    autoZoom(){
      document.body.style.transform = `scale( ${window.innerHeight / this.height} )`;
      document.body.style.transformOrigin = '0px 0px';
      window.addEventListener('resize', () => {
        document.body.style.transform = `scale( ${window.innerHeight / this.height} )`;
      })
    }
    /**
     * 异步打印文本
     * @param text 要打印的文本
     * @description 将打印时间均摊在每个字上，逐字打印文本。可以通过 await window.printTextAsync('Hello World!') 打印文本。
     */
    async printTextAsync(text: string): Promise<void> {
      // 初始化文本，并设置文本样式
      const message = new PIXI.Text('', this.textStyle);
      // 设置文本的左边距
      message.x = this.marginRight;
      // 判断是否为首次打印文本
      if (this.textChildren.length === 0) {
        // 如果是首次打印文本，则将其y设为 marginTop
        message.y = this.marginTop;
      } else {
        const lastTextChild = this.textChildren[this.textChildren.length - 1];
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
      this.app.stage.addChild(message);
      // 将文本添加到 textChildren 中
      this.textChildren.push(message);
      // 将文本拆分为单个字符
      const textArray = text.split('');
      // 遍历字符数组
      for (const char of textArray) {
        // 将字符添加到舞台中
        message.text += char;
        // 等待一段时间
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, this.textSpeed);
        });
      }
    }
    /**
     * 打印可被点击文本
     * @param text 要打印的文本
     * @param func 点击后调用的函数
     * @description 该文本可响应点击，点击后调用指定的函数
     */
    async printClickableText(text: string, func: () => void): Promise<void> {
      // 打印文本
      await this.printTextAsync(text);
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
     * @description 等待点击。可以通过 await window.waitForClick() 等待点击。
     */
    waitForClick() {
      return new Promise<void>((resolve) => {
        document.addEventListener('click', () => {
          resolve();
        });
      });
    }
    /**
     * Pixijs app
     * @description Pixijs app对象。可以通过 window.app 访问。
     */
    app: PIXI.Application<HTMLCanvasElement>;
    /** 
     * 窗口宽度
     * @description 表示窗口宽度。可以设值。默认值为1024。
     */
    width: number;
    /** 
     * 窗口高度
     * @description 表示窗口高度。可以设值。默认值为768。
     */
    height: number;
    /**
     * 文本样式
     * @description 表示文本样式。可以设值。
     * 可以通过 window.textStyle 访问。
     * 可以通过 window.textStyle = new PIXI.TextStyle({...}) 修改。
     */
    textStyle: PIXI.TextStyle;
    /**
     * 可被点击的文本样式
     * @description 表示可被点击的文本样式。可以设值。
     * 可以通过 window.clickableTextStyle 访问。
     * 可以通过 window.clickableTextStyle = new PIXI.TextStyle({...}) 修改。
     */
    clickableTextStyle: PIXI.TextStyle;
    /**
     * 文字大小
     * @description 表示文字大小。可以设值。默认值为36。
     */
    fontSize: number;
    /** 
     * 文字右边距
     * @description 指定用于禁入处理的右边距字符数。(在竖写模式下，解释为下端的字符数)
     */
    marginRight: number;
    /** 
     * 文字左边距
     * @description 指定用于禁入处理的左边距字符数。(在竖写模式下，解释为上端的字符数)
     */
    marginLeft: number;
    /** 
     * 文字上边距
     * @description 指定用于禁入处理的上边距字符数。(在竖写模式下，解释为右端的字符数)
     */
    marginTop: number;
    /** 
     * 文字下边距
     * @description 指定用于禁入处理的下边距字符数。(在竖写模式下，解释为左端的字符数)
     */
    marginBottom: number;
    /** 
     * 文本换行的宽度
     * @description 需要将 wordWrap 设置为 true 才能使用。可以设值。默认值为440。
     */
    wordWrapWidth: number;
    /**
     * 文本行间距
     * @description 表示文本行间距。可以设值。默认值为0。
     */
    lineSpacing: number;
    /**
     * 舞台中的文本数组
     * @description 表示舞台中的文本数组。可以通过 window.textChildren 访问。
     */
    textChildren: PIXI.Text[] = [];
    /**
     * 舞台中的字符数组
     * @description 表示舞台中的字符数组。可以通过 window.charChildren 访问。
     */
    charChildren: PIXI.Text[] = [];
    /**
     * 文字显示速度
     * @description 单位：毫秒/字。可以设值。默认值为30。
     */
    textSpeed: number;
  }