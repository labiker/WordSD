import { Container, Text, TextStyle } from 'pixi.js';

/**
 * 消息。
 * @note 用于在 `BackLog.show()` 时，显示到舞台中，显示文本。
 * @since 1.0.0
 */
export class Message {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The text to display */
    public text = new Text();

    /**
     * @param pixiText 要显示的文本。
     * @param backLogWidth 日志宽度。
     */
    constructor(pixiText: Text, backLogWidth: number) {
        this.text.text = pixiText.text;
        this.text.x = 320;
        this.text.y = 150;
        this.text.style = new TextStyle({
            fill: pixiText.style.fill,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 49,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: backLogWidth - this.text.x - this.text.x,
        });
        this.view.addChild(this.text);
    }
}
