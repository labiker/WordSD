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
import BackLog from './module/BackLog';

// 创建 Pixijs App, 并将其添加到body中
// Pixijs App 是公用的，可以在任何地方使用 app 这个变量来访问它。
const appWidth = 1920;
const appHeight = 1080;
const app = new PIXI.Application<HTMLCanvasElement>({width: appWidth, height: appHeight});
const pixijsContainer = document.body;
pixijsContainer.appendChild(app.view);
// 自动缩放
const autoZoom = () => {
    // 以窗口高度为基准的变换
    const appScale = innerHeight / appHeight;
    const marginLeft = (innerWidth - appWidth * appScale) / 2;

    pixijsContainer.style.transformOrigin = `0 0`;
    pixijsContainer.style.transform = `scale(${appScale})`;
    pixijsContainer.style.marginLeft = `${marginLeft}px`; // 水平居中

    window.addEventListener('resize', () => {
        // 以窗口高度为基准的变换
        const appScale = innerHeight / appHeight;
        const marginLeft = (innerWidth - appWidth * appScale) / 2;
        
        pixijsContainer.style.transform = `scale(${appScale})`;
        pixijsContainer.style.marginLeft = `${marginLeft}px`;
    })
}
autoZoom();

// 全屏对话框模块
// 创建对象并绑定到 Pixijs App 上
const fsDialog = new FullScreenDialog(app);

// 日志模块
// 创建对象并绑定到 Pixijs App 上
const backLog = new BackLog(app);

// 创建异步操作
const process = async () => {
    // 定义语言变量
    let language: 'en' | 'zh-cn' | '' = '';
    /**
     * 宏
     * @param enText 英文文本
     * @param zhcnText 中文文本
     * @description 检测语言，输出对应文本，然后等待点击。
     */
    const printTextAndWaitForClick = async (enText: string, zhcnText: string) => {
        const text = language === 'en' ? enText : zhcnText;
        await fsDialog.printTextAsync(text);
        await fsDialog.waitForClick();
    };
    /**
     * 宏
     * @param enText 英文文本
     * @param zhcnText 中文文本
     * @description 检测语言，输出对应可点击文本。
     */
    const printClickableText = async (enText: string, zhcnText: string, func: () => void) => {
        const text = language === 'en' ? enText : zhcnText;
        fsDialog.printClickableText(text, func);
    };

    // 自动记录文本启用
    backLog.autoRecordText = true;

    // 选择语言
    fsDialog.printClickableText('English version', () => {
        language = 'en';
    });
    fsDialog.printClickableText('中文版', () => {
        language = 'zh-cn';
    });
    // 等待语言选择
    while (language === '') {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 100);
        });
    }
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        'Welcome to WordSD!',
        '欢迎来到 WordSD!'
    );
    await printTextAndWaitForClick(
        'Press F11 to enter full screen mode for the best gaming experience.',
        '按下 F11 进入全屏模式以获得最好的游戏体验。'
    );
    await printClickableText(
        'Click here to go to the test branch.',
        '点击此处进入功能测试分支。',
        async () => {
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                'Now to test if we can call another asynchronous operation.',
                '测试能否调用另一个异步操作。'
            );
            await processSecond(language as 'en' | 'zh-cn');
            await printTextAndWaitForClick(
                'Now it\'s back to the first asynchronous operation',
                '现在已返回原来的异步操作。'
            );
            await printTextAndWaitForClick(
                'This is a macro. It automatically waits for a click after outputting text.',
                '测试宏功能。宏会在输出文本的同时等待点击。'
            );
            await printTextAndWaitForClick(
                'The function display ends here~',
                '功能展示到此结束~'
            );
        }
    );
    await printClickableText(
        'Click here to enter the mini-game session.',
        '点击此处进入迷你游戏分支。',
        async () => {
            fsDialog.clearDialog();
            // Define some game variables
            let gameData = {
                survival: true,               // Whether to survive
                playerPosition: 0,            // Player position
                place: {                      // Place
                    home: 0,                  // Home
                    staircase: 1,             // Staircase
                    elevator: 2,              // Elevator
                    neighborHouse: 3,         // Neighbor's house
                },
                viewTheDoorEye: false,        // Whether to view the cat's eye
                doorIsOpened: false,          // Whether the door is opened
                healthMax: 100,               // Maximum health
                health: 100,                  // Current health
                healthIncreasePerHour: 10,    // health recovery per hour
                sanityMax: 100,               // Maximum sanity
                sanity: 100,                  // Current sanity
                sanityConsumePerHour: 10,     // sanity consumption per hour
                sanityIncreasePerHour: 3,     // sanity recovery per hour (when sleeping)
                foodMax: 100,                 // Food (upper limit)
                food: 100,                    // Food
                foodConsumePerHour: 1,        // Food consumption per hour
                purchasedFood: 0,             // Purchased food
                purchasedFoodMax: 100,        // Purchased food (upper limit)
                purchasedFoodMin: 20,         // Purchased food (lower limit)
            };
            await printTextAndWaitForClick(
                'Welcome to the mini-game session.',
                '欢迎来到迷你游戏环节。'
            );
            await printTextAndWaitForClick(
                'For various reasons, you have to find a place to hide.',
                '因为种种原因，你不得不找个地方避避风头。'
            );
            await printTextAndWaitForClick(
                'Just then, you received a phone call.',
                '就在这时，你收到了一个电话。'
            );
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                '"The Rentouma Company will provide you with the most thoughtful service."',
                '“人头马公司将竭诚为您，提供最周到的服务。”'
            );
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                'In less than a week, you moved into the apartment arranged by the Rentouma Company.',
                '不到一周，你就搬进了人头马公司安排的公寓。'
            );
            await printTextAndWaitForClick(
                `【Food: ${gameData.food} / ${gameData.foodMax} 】\nAlthough the trip was hasty, you still remembered to bring some food.`,
                `【存粮： ${gameData.food} / ${gameData.foodMax} 】\n尽管此行匆忙，但你还是记得带上了一些食物。`
            );
            await printTextAndWaitForClick(
                `【Sanity: ${gameData.sanity} / ${gameData.sanityMax} 】\nThe inherent breath of the room always makes people breathless.`,
                `【理智： ${gameData.sanity} / ${gameData.sanityMax} 】\n房间固有的气息总有些让人喘不过气。`
            );
            await printTextAndWaitForClick(
                `【Health: ${gameData.health} / ${gameData.healthMax} 】\nBut it's better than being killed by someone unknown outside.`,
                `【生命： ${gameData.health} / ${gameData.healthMax} 】\n但也好过在外头被不知名的某人夺了性命。`
            );
            await printTextAndWaitForClick(
                'The follow-up content is still under development, please look forward to it~',
                '后续内容仍在开发中，敬请期待~'
            );
        }
    );
};
// 第二个异步操作，用于测试是否可以被第一个异步操作调用。
const processSecond = async (language: 'en' | 'zh-cn' ) => {
    const text = language === 'en' ? 'This is the second asynchronous operation.' : '这是第二个异步操作。';
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};
// 异步运行
process();
