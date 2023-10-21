import { Container, Text, TextStyle } from 'pixi.js';

/**
 * 标题。
 * @note 在 `BackLog.show()` 时，显示到舞台中。
 * @since 1.0.0
 */
export class Title {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The text to display */
    public text: Text;

    constructor() {
        this.text = new Text(
            'Back Log',
            new TextStyle({
                fill: '#ffffff',
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                fontSize: 49,
            }),
        );
        this.text.x = 0;
        this.text.y = 20;
        this.view.addChild(this.text);
    }
}
