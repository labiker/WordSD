import { Container, Sprite, Text, Texture } from 'pixi.js';
import { app } from '../../utils/app';

/** The props for the tooltip */
interface ITooltipProps {
    /** The value for the tooltip */
    value: string;
    /** The x position of the tooltip */
    x: number;
    /** The y position of the tooltip */
    y: number;
}

/**
 * The tooltip over the scene
 *
 * @since 1.0.0
 */
export class Tooltip {
    /** The container instance that is the root of all visuals in this class */
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

        if (background.x + background.width * 0.5 > app.view.width) {
            text.x = app.view.width - text.width * 0.5;
            background.x = app.view.width - background.width * 0.5;
        }

        if (background.y + background.height > app.view.height) {
            text.y = app.view.height - background.height;
            background.y = app.view.height - background.height;
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
