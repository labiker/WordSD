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
import Window from './PixijsCore/Window';

// 创建Window对象
const window = new Window();
// 启动自动缩放
window.autoZoom();

// 创建异步操作
const process = async () => {
    window.printText('Hello World!');
    await window.waitForClick();
    window.printText('Press F11 to enter full screen mode for the best gaming experience.');
    await window.waitForClick();
    window.printText('Now I want to test the effect of long sentences, so output a string of very long sentences!');
    await window.waitForClick();
    window.printText('This is the third sentence');
    await window.waitForClick();
    window.printText('This is the fourth sentence');
    await window.waitForClick();
    window.printText('This is the fifth sentence');
    await window.waitForClick();
    window.printText('This is the sixth sentence');
    await window.waitForClick();
    window.printText('What should I write in the seventh sentence?');
    await window.waitForClick();
    window.printText('oh,');
    await window.waitForClick();
    window.printText('Just here to promote my friend\'s novel.');
    await window.waitForClick();
    window.printText('The name of the novel is "Until All Things Are Silent".');
    await window.waitForClick();
    window.printText('Now to test if we can call another asynchronous operation.');
    await window.waitForClick();
    await processSecond();
    window.printText('Now it\'s back to the first asynchronous operation');
    await window.waitForClick();
    await printTextAndWaitForClick('This is a macro.It automatically waits for a click after outputting text.');
    window.printText('The function display ends here~');
};
// 创建第二个异步操作，用于测试是否可以被第一个异步操作调用。
const processSecond = async () => {
    window.printText('This is the processSecond function.');
    await window.waitForClick();
};
// 创建一个宏，这个宏能在输出文本的同时等待点击。
const printTextAndWaitForClick = async (text: string) => {
    window.printText(text);
    await window.waitForClick();
};
// 异步运行
process();
