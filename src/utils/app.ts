import { Application } from 'pixi.js';
import { ISystem } from '../system/ISystem';

export const appWidth = 1920;
export const appHeight = 1080;
export const app = new Application<HTMLCanvasElement>({ width: appWidth, height: appHeight });

/** Set up a resize function for the app */
export function resize(container: HTMLElement) {
    // Transform the PixiJS stage
    const appScale = innerHeight / appHeight;
    const marginLeft = (innerWidth - appWidth * appScale) / 2;

    container.style.transformOrigin = '0 0';
    container.style.transform = `scale(${appScale})`;

    // Horizontal centering
    container.style.marginLeft = `${marginLeft}px`;
}

/**
 * Add the view of some systems to the stage and initialize them.
 * @param systems The systems to initialize
 * @note This function will call the `init` method of the system
 */
export function initSystems<T extends ISystem>(systems: T[]) {
    systems.forEach((system) => {
        app.stage.addChild(system.view);
        system.init?.();
    });
}

/**
 * Remove the view of some systems to the stage and end them.
 * @param systems The systems to end
 * @note This function will call the `end` method of the system
 */
export function endSystems<T extends ISystem>(systems: T[]) {
    systems.forEach((system) => {
        app.stage.removeChild(system.view);
        system.end?.();
    });
}
