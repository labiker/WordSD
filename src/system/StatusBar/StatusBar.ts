import { Container, FederatedPointerEvent, Sprite, Text } from 'pixi.js';
import { IStatusIconProps } from './IStatusIconProps';
import { ISystem } from '../ISystem';

/**
 * The status bar over the scene
 *
 * @since 1.0.0
 */
export class StatusBar implements ISystem {
    public SYSTEM_ID = 'StatusBar';
    public view = new Container();
    /** The array of status icons */
    private _statusIcons: {
        [key: string]: { container: Container; position: 'bottomLeft' | 'bottomRight' | 'none' };
    } = {};
    /** The array of interval event ids */
    private intervalIds: number[] = [];

    public end() {
        // Clear all interval events
        if (this.intervalIds.length) {
            this.intervalIds.forEach((id) => {
                clearInterval(id);
            });
        }
    }

    /**
     * Creat a new status icon  with the given image and value
     * @param props The props for the status icon
     * @returns The status icon container
     */
    public creatStatusIcon(props: IStatusIconProps): Container {
        if (this._statusIcons[props.key]) {
            return this.updateStatusIcon(props);
        }

        // Create a sprite using the image and set its anchor to 0.5
        const icon = Sprite.from(props.image ?? '');
        icon.anchor.set(0.5, 0);

        // Create a text object to display the value
        const text = new Text(props.value ? props.value.toString() : '', {
            fontSize: 26,
            fill: 'white',
        });
        text.anchor.set(0.5, 0);

        // Position the sprite and text object normally
        const setPositionNormally = () => {
            icon.x = props.x ?? 0;
            text.x = props.x ?? 0;
            icon.y = props.y ?? 0;
            text.y = props.y ? props.y + icon.height * 0.95 : 0 + icon.height * 0.95;
        };

        // If the position is bottom left, position the sprite and text object at the bottom left of the last bottom left icon
        if (props.position === 'bottomLeft' || props.position === 'bottomRight') {
            const lastBottomIcon = Object.values(this._statusIcons)
                .filter((icon) => icon && icon.position === props.position)
                .pop();
            if (lastBottomIcon) {
                const lastIcon = lastBottomIcon.container.getChildAt(0) as Sprite;
                const lastText = lastBottomIcon.container.getChildAt(1) as Text;
                icon.x =
                    lastIcon.x +
                    (props.position === 'bottomLeft' ? lastIcon.width : -lastIcon.width);
                text.x = icon.x;
                icon.y = lastIcon.y;
                text.y = lastText.y;
            } else {
                setPositionNormally();
            }
        } else {
            setPositionNormally();
        }

        if (props.hover || props.out) {
            icon.eventMode = 'static';
            if (props.hover) {
                icon.on('mouseover', (e: FederatedPointerEvent) => {
                    props.hover(e);
                });
            }
            if (props.out) {
                icon.on('mouseout', props.out);
            }
        }

        if (props.update) {
            // 每隔一段时间更新一次
            const intervalId = setInterval(() => {
                props.update(props.key);
            }, 100) as unknown as number;
            this.intervalIds.push(intervalId);
        }

        // Add the sprite and text to a container
        const statusIcon = new Container();
        statusIcon.addChild(icon, text);

        // Add the container to the status icons array
        this._statusIcons[props.key] = {
            container: statusIcon,
            position: props.position ?? 'none',
        };

        // Add the status icon to the view
        this.view.addChild(this._statusIcons[props.key].container);

        return this._statusIcons[props.key].container;
    }

    /**
     * Update the status icon at the given index with the given image and value
     * @param props The props for the status icon
     * @returns The status icon container
     */
    public updateStatusIcon(props: IStatusIconProps): Container {
        if (!this._statusIcons[props.key]) {
            return this.creatStatusIcon(props);
        }

        const statusIcon = this._statusIcons[props.key].container;
        const icon = statusIcon.getChildAt(0) as Sprite;
        const text = statusIcon.getChildAt(1) as Text;

        icon.texture = props.image ? Sprite.from(props.image).texture : icon.texture;
        text.text = props.value >= 0 ? props.value.toString() : text.text;

        // Position the sprite
        icon.x = props.x ?? icon.x;
        icon.y = props.y ?? icon.y;

        // Position the text object next to the icon
        text.x = props.x ?? text.x;
        text.y = props.y ? props.y + icon.height * 0.95 : text.y;

        // Add the status icon to the view
        this._statusIcons[props.key] = {
            container: statusIcon,
            position: props.position ?? this._statusIcons[props.key].position,
        };

        return this._statusIcons[props.key].container;
    }

    /**
     * Remove the status icon at the given key
     * @param key The key of the status icon to remove
     */
    public removeStatusIcon(key: string): void {
        if (!this._statusIcons[key]) {
            return;
        }

        this.view.removeChild(this._statusIcons[key].container);
        delete this._statusIcons[key];
    }

    /**
     * Get the status icon's value at the given key
     * @param key The key of the status icon to get
     * @returns The status icon's value
     */
    public getStatusIconValue(key: string): number {
        if (!this._statusIcons[key]) {
            return -1;
        }

        const statusIcon = this._statusIcons[key].container;
        const text = statusIcon.getChildAt(1) as Text;

        return parseInt(text.text);
    }
}
