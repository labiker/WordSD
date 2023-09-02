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

// 创建 Pixijs App, 并将其添加到body中。
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
// 创建对象并绑定到 Pixijs App 上。
const fsDialog = new FullScreenDialog(app);

// 日志模块
// 创建对象并绑定到 Pixijs App 上。
const backLog = new BackLog(app);

// 自动记录文本启用
backLog.autoRecordText = true;

// Define some game variables
const gameData = {
    legacy: {                         // Legacy
        rabbitCorpse: 0,              // Rabbit corpse
        lizardCorpse: 0,              // Lizard corpse
        humanCorpse: 0,               // Human corpse
        vegetableSeed: 0,             // Vegetable seed
    },
    story: {
        sledDogDeathSceneI: false,    // Sled dog death scene I
    },
    system: {
        language: '',                 // Language
        RoundsPerDay: 4,              // Number of rounds per day
        totlaDays: 7,                 // Total number of days
        currentDay: 1,                // Current day
        currentTime: 18,              // Current time
        isEnableToGoOut: false,       // Whether to enable going out
    },
    player: {
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
    }
};

/**
 * 宏
 * @param enText 英文文本
 * @param zhcnText 中文文本
 * @note 检测语言，输出对应文本，然后等待点击。
 */
const printTextAndWaitForClick = async (enText: string, zhcnText: string) => {
    const text = gameData.system.language === 'en' ? enText : zhcnText;
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};
/**
 * 宏
 * @param enText 英文文本
 * @param zhcnText 中文文本
 * @note 检测语言，输出对应可点击文本。
 */
const printClickableText = async (enText: string, zhcnText: string, func: () => void) => {
    const text = gameData.system.language === 'en' ? enText : zhcnText;
    fsDialog.printClickableText(text, func);
};

// 创建异步操作
const process = async () => {
    // 选择语言
    fsDialog.printClickableText('English version', () => {
        gameData.system.language = 'en';
    });
    fsDialog.printClickableText('中文版', () => {
        gameData.system.language = 'zh-cn';
    });
    // 等待语言选择
    while (gameData.system.language === '') {
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
            await processSecond(gameData.system.language as 'en' | 'zh-cn');
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
            await printTextAndWaitForClick(
                'Welcome to the mini-game session.',
                '欢迎来到迷你游戏环节。'
            );
            await creatNewWorldLine();
        }
    );
};
// 第二个异步操作，用于测试是否可以被第一个异步操作调用。
const processSecond = async (language: 'en' | 'zh-cn' ) => {
    const text = language === 'en' ? 'This is the second asynchronous operation.' : '这是第二个异步操作。';
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};

// 创建新的世界线
const creatNewWorldLine = async () => {
    // 重置玩家属性
    gameData.player.health = gameData.player.healthMax;
    fsDialog.clearDialog();
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
        `【Day ${gameData.system.currentDay}】\nToday is the day you moved in.`,
        `【第 ${gameData.system.currentDay} 天】\n今天是入住日。`,
    );
    await printTextAndWaitForClick(
        `Maybe you can stay for 【${gameData.system.totlaDays} days】 first, \nsee the situation, and then decide whether to stay for a long time.`,
        `也许可以先住到【第 ${gameData.system.totlaDays} 天】，\n看看情况，再决定要不要长住。`,
    );
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        `【Food: ${gameData.player.food} / ${gameData.player.foodMax} 】\nAlthough the trip was hasty, you still remembered to bring some food.`,
        `【存粮： ${gameData.player.food} / ${gameData.player.foodMax} 】\n尽管此行匆忙，但你还是记得带上了一些食物。`
    );
    await printTextAndWaitForClick(
        `【Sanity: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nThe inherent breath of the room always makes people breathless.`,
        `【理智： ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n房间固有的气息总有些让人喘不过气。`
    );
    await printTextAndWaitForClick(
        `【Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nBut it's better than being killed by someone unknown outside.`,
        `【生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n但也好过在外头被不知名的某人夺了性命。`
    );
    await printTextAndWaitForClick(
        `【Time: ${gameData.system.currentTime} o'clock】\nYou have been busy moving, and it was already night.`,
        `【时间：${gameData.system.currentTime} 点】\n一直忙着搬家，不知不觉，已经到了晚上。`
    );
    fsDialog.clearDialog();
    printClickableText(
        `- Go out`,
        `- 外出`,
        async () => {
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                `You open the door, take a step, and a smiling face suddenly appears at your feet.`,
                `你打开门，迈出一步，一张笑脸突然出现在你脚边。`
            );
            await printTextAndWaitForClick(
                `A dog grinned, bit through your knee, and dragged you down the hallway.`,
                `一条狗咧着嘴，咬穿你的膝盖，将你拖到楼道中。`
            );
            await printTextAndWaitForClick(
                `It throws you to the ground, gently licks your tears, and bites your cheeks.`,
                `它将你扑倒在地，温柔地舔舐你的泪水，咬烂了你的脸颊。`
            );
            await printTextAndWaitForClick(
                `Your teeth collide with its teeth, its saliva burns your tongue, and you can't cry out.`,
                `你的牙齿与它的牙齿相撞，它的唾液烧烂了你的舌头，你喊不出声了。`
            );
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                `Its blood-stained smile fills the field of vision, you hear the sound of sucking, and there is a spicy tingling sensation in the eye sockets,`,
                `它染血的微笑充满了视野，你听见吸吮的声音，眼窝中传来辛辣的刺痛感，`
            );
            gameData.player.health = 0;
            gameData.story.sledDogDeathSceneI = true;
            await printTextAndWaitForClick(
                `【Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nYou finally realize that its snort is exhaling into your brain.`,
                `【生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n你最后意识到它的鼻息呼入了脑颅。`
            );
            // 创建新的世界线
            await creatNewWorldLine();
        }
    );
    if (gameData.story.sledDogDeathSceneI) {
        printClickableText(
            `- View the door eye`,
            `- 查看门眼`,
            async () => {
                fsDialog.clearDialog();
                await printTextAndWaitForClick(
                    `In the dim light, a snow-white sled dog sleepily lies in front of the door.`,
                    `在昏暗的光线下，一条雪白的雪橇犬趴在门前昏昏欲睡。`
                );
                printClickableText(
                    `- Go out`,
                    `- 出门`,
                    async () => {
                        fsDialog.clearDialog();
                        await printTextAndWaitForClick(
                            `You open the door, carefully pass it,`,
                            `你打开门，小心翼翼地经过它，`
                        );
                        await printTextAndWaitForClick(
                            `It lifted its face and grinned.`,
                            `它抬起脸来咧嘴笑了。`
                        );
                        await printTextAndWaitForClick(
                            `It then bites off your knee.`,
                            `它接着咬断了你的膝盖。`
                        );
                        await printTextAndWaitForClick(
                            `..`,
                            `..`,
                        );
                        await printTextAndWaitForClick(
                            `....`,
                            `....`,
                        );
                        await printTextAndWaitForClick(
                            `......`,
                            `......`,
                        );
                        await printTextAndWaitForClick(
                            `A snow-white sled dog whispered with joy, and it licked the last piece of minced meat with pity,`,
                            `一条雪白的雪橇犬满心欢喜地低鸣着，它怜惜地舔尽最后一块碎肉，`
                        );
                        await printTextAndWaitForClick(
                            `Stretch out, and your hair swells up.`,
                            `伸个懒腰，毛发哗一下膨胀起来。`
                        );
                        await printTextAndWaitForClick(
                            `It wagged its tail, trotted towards the stairs, and left.`,
                            `它摇晃着尾巴，小步跑向楼梯，离开了。`
                        );
                        await printTextAndWaitForClick(
                            `Get the pest entry included in Smile Angel part1`,
                            `获得有害物词条收录 微笑天使 part1`
                        );
                        fsDialog.clearDialog();
                        printTextAndWaitForClick(
                            `Follow-up content is still in production, so stay tuned~`,
                            `后续内容仍在制作中，敬请期待~`,
                        );
                    }
                );
            }
        );
    }
    printTextAndWaitForClick(
        `You can go out and have a look, maybe you can meet new neighbors and say hello.`,
        `可以出去看看，也许能碰到新的邻居，打个招呼。`
    );
};

// 异步运行
process();
