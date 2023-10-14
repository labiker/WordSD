/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { Application } from 'pixi.js';
import { Game } from './game/Game';
import { initAssets } from './utils/assets';

const appWidth = 1920;
const appHeight = 1080;
export const app = new Application<HTMLCanvasElement>({ width: appWidth, height: appHeight });

/** Set up a resize function for the app */
function resize(container: HTMLElement) {
    // Transform the PixiJS stage
    const appScale = innerHeight / appHeight;
    const marginLeft = (innerWidth - appWidth * appScale) / 2;

    container.style.transformOrigin = `0 0`;
    container.style.transform = `scale(${appScale})`;

    // Horizontal centering
    container.style.marginLeft = `${marginLeft}px`;
}

/** Setup app and initialise assets */
async function init() {
    // The container to hold the app
    const pixijsContainer = document.body;

    // Add pixi canvas element (app.view) to the document's body
    pixijsContainer.appendChild(app.view);

    // Whenever the window resizes, call the 'resize' function
    window.addEventListener('resize', () => resize(pixijsContainer));

    // Trigger the first resize
    resize(pixijsContainer);

    // Setup assets bundles (see assets.ts) and start up loading everything in background
    await initAssets();

    // Load the game
    const game = new Game();
    game.process();
}

// Init everything
init();