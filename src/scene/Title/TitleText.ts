import { Container, Text } from 'pixi.js';
import { i18n } from '../../utils/i18n';

/**
 * Class to render the game's title
 */
export class TitleText {
    /* The container instance that is the root of all visuals in this class */
    public view = new Container();

    constructor() {
        // Add the top title text
        const gameTitleTopText = i18n.t('gameTitleTop');
        const titleTop = new Text(gameTitleTopText);
        titleTop.anchor.set(0.5);
        this.view.addChild(titleTop);

        // Add the bottom title text
        const gameTitleBottomText = i18n.t('gameTitleBottom');
        const titleBottom = new Text(gameTitleBottomText);
        titleBottom.anchor.set(0.5);
        this.view.addChild(titleBottom);

        titleTop.style = {
            dropShadow: true,
            dropShadowAngle: 2.3,
            dropShadowDistance: 7,
            fill: '#262b35',
            fontFamily: 'Zcool Xiaowei',
            fontSize: 200,
            fontWeight: '900',
            stroke: '#008080',
            strokeThickness: 12,
        };

        titleBottom.style = {
            dropShadow: true,
            dropShadowAngle: 0.9,
            dropShadowDistance: 8,
            fill: '#262b35',
            fontFamily: 'Ma Shan Zheng',
            fontSize: 190,
            fontStyle: 'italic',
            fontWeight: '900',
            stroke: '#BDB76B',
            strokeThickness: 12,
        };
    }

    public resize(width?: number, height?: number) {
        this.view.x = width * 0.83;
        this.view.y = height * 0.15;

        const firstTitle = this.view.children[0] as Text;
        const secondTitle = this.view.children[1] as Text;

        secondTitle.y = firstTitle.y + firstTitle.height - 30;
    }
}
