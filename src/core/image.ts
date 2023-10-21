import { Resource, Texture } from 'pixi.js';

class ImageLibrary {
    /**
     * Adds a new image by alias.
     * @param alias - The image alias reference.
     * @param {ArrayBuffer|AudioBuffer|String|Options|HTMLAudioElement} options - Either the path or url to the source file.
     *        or the object of options to use.
     * @return Instance of the image object.
     */
    public async add(alias: string, options: string) {
        this.imageLibrary[alias] = await Texture.fromURL(options);
        return this.imageLibrary[alias];
    }

    /**
     * Find a image by alias.
     * @param alias - The image alias reference.
     * @return image object.
     */
    public find(alias: string) {
        return this.imageLibrary[alias];
    }

    private imageLibrary: Record<string, Texture<Resource>> = {};
}

/**
 * A class to handle image within the game.
 */
export const image = new ImageLibrary();
