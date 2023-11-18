import { Container, Sprite, Text, Texture } from 'pixi.js';
import { ITooltipProps } from './ITooltipProps';
import { appWidth, appHeight } from '../../utils/app';
import { ISystem } from '../ISystem';

/**
 * The tooltip over the scene
 *
 * @since 1.0.0
 */
export class Tooltip implements ISystem {
    public SYSTEM_ID = 'Tooltip';
    public view = new Container();

    /**
     * Creat a new tooltip with the given value
     * @param props The props for the tooltip
     * @note The tooltip will be automatically positioned to avoid going out of the screen
     */
    public show(props: ITooltipProps) {
        const text = new Text(props.value ? props.value : '', {
            fontSize: 26,
            fill: 'white',
        });

        text.anchor.set(0.5, 0);
        text.x = props.x ?? 0;
        text.y = props.y ? props.y + text.height * 0.95 : 0 + text.height * 0.95;

        const background = new Sprite();

        background.texture = Texture.WHITE;
        background.width = text.width;
        background.height = text.height;
        background.tint = 0x000000;
        background.alpha = 0.5;
        background.anchor.set(0.5, 0);
        background.x = props.x ?? 0;
        background.y = props.y ? props.y + text.height * 0.95 : 0 + text.height * 0.95;

        if (background.x - background.width * 0.5 < 0) {
            text.x = text.width * 0.5;
            background.x = background.width * 0.5;
        }

        if (background.x + background.width * 0.5 > appWidth) {
            text.x = appWidth - text.width * 0.5;
            background.x = appWidth - background.width * 0.5;
        }

        if (background.y + background.height > appHeight) {
            text.y = appHeight - background.height;
            background.y = appHeight - background.height;
        }

        // Add the text and background to the view
        this.view.addChild(background, text);
    }

    /**
     * Hide the tooltip by removing all children
     */
    public hide() {
        this.view.removeChildren();
    }
}
