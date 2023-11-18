import { Container, Sprite } from 'pixi.js';

/** A class representing the player. */
export class Player {
    /** The Container instance which contains all the visual elements for this class. */
    public view = new Container();

    constructor() {
        // Use a helper function to simplify building the player
        this._build();
    }

    /**
     * Helper function to build the player
     */
    private async _build() {
        // Create a sprite using the id and set its anchor to 0.5
        const element = Sprite.from('img://player.png');
        element.anchor.set(0.5);

        // Add the sprite to the view
        this.view.addChild(element);
    }
}
