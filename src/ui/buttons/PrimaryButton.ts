import type { ButtonOptions } from '@pixi/ui';
import { FancyButton } from '@pixi/ui';
import type { TextStyle } from 'pixi.js';
import { Container, Sprite, Text } from 'pixi.js';

import { sfx } from '../../utils/audio';
import { image } from '../../core/image';

/**
 * Options for the primary button.
 */
export interface PrimaryButtonOptions {
    /** The text displayed on the button. */
    text: string;
    /** Style properties for the text displayed on the button. */
    textStyle?: Partial<TextStyle>;
    /** Options for the underlying button component. */
    buttonOptions?: ButtonOptions;
}

/** Constant to define the default scale of the button */
const DEFAULT_SCALE = 1;

export class PrimaryButton extends FancyButton {
    /**
     * @param options - Options for the primary button.
     */
    constructor(options: PrimaryButtonOptions) {
        // Create text object to act as label
        const text = new Text(options?.text ?? '');

        text.style = {
            // Predefine text styles that can be overwritten
            fill: 0x262b35,
            fontWeight: 'bold',
            align: 'center',
            fontSize: 55,
            fontFamily: 'ZCOOL Xiaowei',
            stroke: '#4682B4',
            strokeThickness: 6,
            // Allow custom text style to overwrite predefined options
            ...options?.textStyle,
        };

        const defaultViewContainer = new Container();
        defaultViewContainer.addChild(new Sprite(image.find('play-btn-up')));
        const pressedViewContainer = new Container();
        pressedViewContainer.addChild(new Sprite(image.find('play-btn-down')));

        super({
            // Assign the default view
            defaultView: options?.buttonOptions?.defaultView ?? defaultViewContainer,
            // Assign the pressed view
            pressedView: options?.buttonOptions?.pressedView ?? pressedViewContainer,
            // Assign button text
            text,
            // Offset the button text
            textOffset: {
                default: {
                    y: 20,
                },
                pressed: {
                    y: 30,
                },
            },
            // Anchor to the center-bottom
            anchorX: 0.5,
            anchorY: 0.5,
            // Set initial scale to default scale
            scale: DEFAULT_SCALE,
            // Allow custom button options to overwrite predefined options
            ...options.buttonOptions,
        });
    }

    public override hover() {
        const text = this.textView as Text;
        text.style.stroke = 0xBDB76B;
        this.textView = text;
    }

    public override out() {
        const text = this.textView as Text;
        text.style.stroke = 0x4682B4;
        this.textView = text;
    }

    /**
     * Override function for the FancyButton, called when button is pressed
     */
    public override press() {
        // Since this is a common button, all button responses are done outside of this class

        // Play audio
        sfx.play('primary-button-press');
    }
}
