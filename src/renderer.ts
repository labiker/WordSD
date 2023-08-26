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
import * as PIXI from 'pixi.js';
import FullScreenDialog from './module/FullScreenDialog';

// 创建 Pixijs App, 并将其添加到body中
// Pixijs App 是公用的，可以在任何地方使用 app 这个变量来访问它。
const appWidth = 1920;
const appHeight = 1080;
const app = new PIXI.Application<HTMLCanvasElement>({width: appWidth, height: appHeight});
document.body.appendChild(app.view);
// 自动缩放
const autoZoom = () => {
    document.body.style.transform = `scale( ${window.innerHeight / appHeight} )`;
    document.body.style.transformOrigin = '0px 0px';
    window.addEventListener('resize', () => {
      document.body.style.transform = `scale( ${window.innerHeight / appHeight} )`;
    })
}
autoZoom();

// 全屏对话框模块
// 创建对象并绑定到 Pixijs App 上
const fsDialog = new FullScreenDialog(app);

// 创建异步操作
const process = async () => {
    await fsDialog.printTextAsync('Hello World!');
    await fsDialog.waitForClick();
    await fsDialog.printTextAsync('Press F11 to enter full screen mode for the best gaming experience.');
    await fsDialog.waitForClick();
    await fsDialog.printClickableText('Click here to go to the test branch.', async () => {
        fsDialog.clearDialog();
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('Now I want to test the effect of long sentences, so output a string of very long sentences!');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('This is the third sentence');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('This is the fourth sentence');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('This is the fifth sentence');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('This is the sixth sentence');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('What should I write in the seventh sentence?');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('oh,');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('Just here to promote my friend\'s novel.');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('The name of the novel is "Until All Things Are Silent".');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('Now to test if we can call another asynchronous operation.');
        await fsDialog.waitForClick();
        await processSecond();
        await fsDialog.printTextAsync('Now it\'s back to the first asynchronous operation');
        await fsDialog.waitForClick();
        await printTextAndWaitForClick('This is a macro.It automatically waits for a click after outputting text.');
        await fsDialog.printTextAsync('The function display ends here~');
    });
    await fsDialog.printClickableText('Click here to enter the mini-game session.', async () => {
        fsDialog.clearDialog();
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('This is the mini-game session.');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('The function display ends here~');
    });
};
// 创建第二个异步操作，用于测试是否可以被第一个异步操作调用。
const processSecond = async () => {
    await fsDialog.printTextAsync('This is the processSecond function.');
    await fsDialog.waitForClick();
};
// 创建一个宏，这个宏能在输出文本的同时等待点击。
const printTextAndWaitForClick = async (text: string) => {
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};
// 异步运行
process();
