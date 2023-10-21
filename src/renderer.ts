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
import { app, resize } from './utils/app';
import { initAssets } from './utils/assets';
import { Title } from './scene/Title/Title';

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

    // Add the title scene to the stage
    const title = new Title();
    app.stage.addChild(title);
    title.resize(app.view.width, app.view.height);
}

// Init everything
init();
