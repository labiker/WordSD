import { Application } from 'pixi.js';

const appWidth = 1920;
const appHeight = 1080;
export const app = new Application<HTMLCanvasElement>({ width: appWidth, height: appHeight });

/** Set up a resize function for the app */
export function resize(container: HTMLElement) {
    // Transform the PixiJS stage
    const appScale = innerHeight / appHeight;
    const marginLeft = (innerWidth - appWidth * appScale) / 2;

    container.style.transformOrigin = `0 0`;
    container.style.transform = `scale(${appScale})`;

    // Horizontal centering
    container.style.marginLeft = `${marginLeft}px`;
}
