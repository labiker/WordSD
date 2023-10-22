import { Container, Text, TextStyle } from 'pixi.js';

/**
 * 对话框中的文本。
 * @since 1.0.0
 */
export class Message {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The text to display */
    public text = new Text();
    /** 文本类型。 */
    public type: 'normal' | 'clickable' | 'warning' | 'hint' = 'normal';
    /** 普通文本的样式。 */
    private normalTextStyle: TextStyle;
    /** 可响应点击事件的文本的样式。 */
    private clickableTextStyle: TextStyle;
    /** 警告文本的样式。 */
    private warningTextStyle: TextStyle;
    /** 提示文本的样式。 */
    private hintTextStyle: TextStyle;

    /**
     * @param text 要显示的文本
     * @param screenWidth 日志宽度
     */
    constructor(text: string, screenWidth: number) {
        this.text.text = text;
        this.text.x = 320;
        this.text.y = 150;

        this.normalTextStyle = new TextStyle({
            fill: '#ffffff',
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: 49,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: screenWidth - this.text.x - this.text.x,
        });

        this.clickableTextStyle = new TextStyle({
            fill: ['#a0a0ff', '#ffffff'],
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: 49,
            fontWeight: 'bold',
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: screenWidth - this.text.x - this.text.x,
        });

        this.warningTextStyle = new TextStyle({
            fill: ['#ff9e9e', '#ffffff'],
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: 49,
            fontWeight: 'bold',
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: screenWidth - this.text.x - this.text.x,
        });

        this.hintTextStyle = new TextStyle({
            fill: ['#9effa0', '#ffffff'],
            fontFamily: '"Comic Sans MS", cursive, sans-serif',
            fontSize: 49,
            fontWeight: 'bold',
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: screenWidth - this.text.x - this.text.x,
        });

        this.setTextStyle(this.type);

        this.view.addChild(this.text);
    }

    /**
     * 设置文本样式。
     * @param type 文本类型。
     */
    public setTextStyle(type: 'normal' | 'clickable' | 'warning' | 'hint'): void {
        switch (type) {
            case 'normal':
                this.text.style = this.normalTextStyle;
                break;
            case 'clickable':
                this.text.style = this.clickableTextStyle;
                break;
            case 'warning':
                this.text.style = this.warningTextStyle;
                break;
            case 'hint':
                this.text.style = this.hintTextStyle;
                break;
            default:
                this.text.style = this.normalTextStyle;
                break;
        }
        this.type = type;
    }
}
