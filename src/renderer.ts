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

// 创建异步操作
const process = async () => {
    /**
     * 宏
     * @param text 要打印的文本
     * @description 在输出文本完毕后，自动等待点击。
     */
    const printTextAndWaitForClick = async (text: string) => {
        await fsDialog.printTextAsync(text);
        await fsDialog.waitForClick();
    };
    fsDialog.printClickableText('English version', async () => {
        fsDialog.clearDialog();
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('Welcome to WordSD!');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('Press F11 to enter full screen mode for the best gaming experience.');
        await fsDialog.waitForClick();
        fsDialog.printClickableText('Click here to go to the test branch.', async () => {
            fsDialog.clearDialog();
            await fsDialog.waitForClick();
            await fsDialog.printTextAsync('Now to test if we can call another asynchronous operation.');
            await fsDialog.waitForClick();
            await processSecond('English');
            await fsDialog.printTextAsync('Now it\'s back to the first asynchronous operation');
            await fsDialog.waitForClick();
            await printTextAndWaitForClick('This is a macro.It automatically waits for a click after outputting text.');
            await fsDialog.printTextAsync('The function display ends here~');
        });
        fsDialog.printClickableText('Click here to enter the mini-game session.', async () => {
            fsDialog.clearDialog();
            await fsDialog.waitForClick();
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
            await printTextAndWaitForClick('Welcome to the mini-game session.');
            await printTextAndWaitForClick('For various reasons, you have to find a place to hide.');
            await printTextAndWaitForClick('Just then, you received a phone call.');
            fsDialog.clearDialog();
            await printTextAndWaitForClick('"The Rentouma Company will provide you with the most thoughtful service."');
            fsDialog.clearDialog();
            await printTextAndWaitForClick('In less than a week, you moved into the apartment arranged by the Rentouma Company.');
            await printTextAndWaitForClick(`【Food: ${gameData.food} / ${gameData.foodMax} 】\nAlthough the trip was hasty, you still remembered to bring some food.`);
            await printTextAndWaitForClick(`【Sanity: ${gameData.sanity} / ${gameData.sanityMax} 】\nThe inherent breath of the room always makes people breathless.`);
            await printTextAndWaitForClick(`【Health: ${gameData.health} / ${gameData.healthMax} 】\nBut it's better than being killed by someone unknown outside.`);
            await printTextAndWaitForClick('The follow-up content is still under development, please look forward to it~');
        });
    });
    fsDialog.printClickableText('中文版', async () => {
        fsDialog.clearDialog();
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('欢迎来到 WordSD!');
        await fsDialog.waitForClick();
        await fsDialog.printTextAsync('按下 F11 进入全屏模式以获得最好的游戏体验。');
        await fsDialog.waitForClick();
        fsDialog.printClickableText('点击此处进入功能测试分支。', async () => {
            fsDialog.clearDialog();
            await fsDialog.waitForClick();
            await fsDialog.printTextAsync('测试能否调用另一个异步操作。');
            await fsDialog.waitForClick();
            await processSecond('中文版');
            await fsDialog.printTextAsync('现在已返回原来的异步操作。');
            await fsDialog.waitForClick();
            await printTextAndWaitForClick('测试宏功能。宏会在输出文本的同时等待点击。');
            await fsDialog.printTextAsync('功能展示到此结束~');
        });
        fsDialog.printClickableText('点击此处进入迷你游戏分支。', async () => {
            fsDialog.clearDialog();
            await fsDialog.waitForClick();
            // 定义一些游戏变量
            let gameData = {
                survival: true,               // 是否存活
                playerPosition: 0,            // 玩家位置
                place: {                      // 场所
                    home: 0,                  // 家
                    staircase: 1,             // 楼梯
                    elevator: 2,              // 电梯
                    neighborHouse: 3,         // 邻居家
                },
                viewTheDoorEye: false,        // 是否查看了猫眼
                doorIsOpened: false,          // 是否打开了门
                healthMax: 100,               // 最大生命值
                health: 100,                  // 当前生命值
                healthIncreasePerHour: 10,    // 每小时的生命值恢复量
                sanityMax: 100,               // 最大理智值
                sanity: 100,                  // 当前理智值
                sanityConsumePerHour: 10,     // 每小时的理智值消耗量
                sanityIncreasePerHour: 3,     // 存粮（上限）
                foodMax: 100,                 // 存粮
                food: 100,                    // 每小时的食物消耗量
                foodConsumePerHour: 1,        // 购置的食物量
                purchasedFood: 0,             // 购置的食物量（上限）
                purchasedFoodMax: 100,        // 购置的食物量（下限）
                purchasedFoodMin: 20,         // 每小时的理智值恢复量（睡眠时）
            };
            await printTextAndWaitForClick('欢迎来到迷你游戏环节。');
            await printTextAndWaitForClick('因为种种原因，你不得不找个地方避避风头。');
            await printTextAndWaitForClick('就在这时，你收到了一个电话。');
            fsDialog.clearDialog();
            await printTextAndWaitForClick('“人头马公司将竭诚为您，提供最周到的服务。”');
            fsDialog.clearDialog();
            await printTextAndWaitForClick('不到一周，你就搬进了人头马公司安排的公寓。');
            await printTextAndWaitForClick(`【存粮： ${gameData.food} / ${gameData.foodMax} 】\n尽管此行匆忙，但你还是记得带上了一些食物。`);
            await printTextAndWaitForClick(`【理智： ${gameData.sanity} / ${gameData.sanityMax} 】\n房间固有的气息总有些让人喘不过气。`);
            await printTextAndWaitForClick(`【生命： ${gameData.health} / ${gameData.healthMax} 】\n但也好过在外头被不知名的某人夺了性命。`);
            await printTextAndWaitForClick('后续内容仍在开发中，敬请期待~');
        });
    });
};
// 第二个异步操作，用于测试是否可以被第一个异步操作调用。
const processSecond = async (language: 'English' | '中文版') => {
    const text = language === 'English' ? 'This is the second asynchronous operation.' : '这是第二个异步操作。';
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};
// 异步运行
process();
