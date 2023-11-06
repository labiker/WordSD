import { Container, Text, TextStyle } from 'pixi.js';
import { BackLog } from './BackLog';

/**
 * 关闭按钮。
 * @note 在 `BackLog.show()` 时，显示到舞台中，点击后将关闭日志。
 * @since 1.0.0
 */
export class CloseButton {
    /** The container instance that is the root of all visuals in this class */
    public view = new Container();
    /** The text to display */
    public text: Text;

    constructor(backLog: BackLog) {
        this.text = new Text(
            '×',
            new TextStyle({
                fill: '#ffffff',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: 49,
            }),
        );
        this.text.x = 1800;
        this.text.y = 960;
        this.text.eventMode = 'static';
        this.text.cursor = 'pointer';
        this.text.on('click', () => {
            backLog.close();
        });
        this.view.addChild(this.text);
    }
}
