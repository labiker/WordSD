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
// Pixijs App 是公用的, 可以在任何地方使用 app 这个变量来访问它。
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
        humanCorpse: 0,               // Human corpse
        vegetableSeed: 0,             // Vegetable seed
    },
    collection: {
        smilingAngel_1: false,        // Smile Angel part1
        smilingAngel_2: false,        // Smile Angel part2
    },
    item: {
        CorpsePieces: 0,              // Corpse pieces
    },
    story: {
        sledDogDeathSceneI: false,    // Sled dog death scene I
        sledDogDeathSceneII: false,   // Sled dog death scene II
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
        credibility: 0,               // Credibility
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
 * @note 检测语言, 输出对应文本, 然后等待点击。
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
 * @note 检测语言, 输出对应可点击文本。
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
// 第二个异步操作, 用于测试是否可以被第一个异步操作调用。
const processSecond = async (language: 'en' | 'zh-cn' ) => {
    const text = language === 'en' ? 'This is the second asynchronous operation.' : '这是第二个异步操作。';
    await fsDialog.printTextAsync(text);
    await fsDialog.waitForClick();
};

// 创建新的世界线
const creatNewWorldLine = async () => {
    // 重置玩家属性
    gameData.player.health = gameData.player.healthMax;
    gameData.player.sanity = gameData.player.sanityMax;
    gameData.player.food = gameData.player.foodMax;
    gameData.player.credibility = 0;
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        'For various reasons, you have to find a place to hide.',
        '因为种种原因, 你不得不找个地方避避风头。'
    );
    await printTextAndWaitForClick(
        'Just then, you received a phone call.',
        '就在这时, 你收到了一个电话。'
    );
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        '"The Rentouma Company will provide you with the most thoughtful service."',
        '“人头马公司将竭诚为您, 提供最周到的服务。”'
    );
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        'In less than a week, you moved into the apartment arranged by the Rentouma Company.',
        '不到一周, 你就搬进了人头马公司安排的公寓。'
    );
    await printTextAndWaitForClick(
        `【 Day ${gameData.system.currentDay} 】\nToday is the day you moved in.`,
        `【第 ${gameData.system.currentDay} 天】\n今天是入住日。`,
    );
    await printTextAndWaitForClick(
        `Maybe you can stay for 【 ${gameData.system.totlaDays} days 】 first, \nsee the situation, and then decide whether to stay for a long time.`,
        `也许可以先住到【第 ${gameData.system.totlaDays} 天】, \n看看情况, 再决定要不要长住。`,
    );
    fsDialog.clearDialog();
    await printTextAndWaitForClick(
        `【 Food: ${gameData.player.food} / ${gameData.player.foodMax} 】\nAlthough the trip was hasty, you still remembered to bring some food.`,
        `【存粮： ${gameData.player.food} / ${gameData.player.foodMax} 】\n尽管此行匆忙, 但你还是记得带上了一些食物。`
    );
    await printTextAndWaitForClick(
        `【 Sanity: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nThe inherent breath of the room always makes people breathless.`,
        `【理智： ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n房间固有的气息总有些让人喘不过气。`
    );
    await printTextAndWaitForClick(
        `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nBut it's better than being killed by someone unknown outside.`,
        `【生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n但也好过在外头被不知名的某人夺了性命。`
    );
    fsDialog.clearDialog();
    // 如果有道具, 进入道具检查环节
    if (gameData.item.CorpsePieces > 0) {
        await printTextAndWaitForClick(
            `By chance, you find something strange in the room...`,
            `偶然间, 你发现房间里有一些奇怪的东西......`
        );
        await printTextAndWaitForClick(
            `【 Corpse pieces: ${gameData.item.CorpsePieces} 】`,
            `【尸块： ${gameData.item.CorpsePieces} 】`
        );
        await printTextAndWaitForClick(
            `Considering that it might come in handy, you put them back where they were, and didn't inform the Rentouma Company.`,
            `考虑到也许能派上用处, 你将它们放回了原地, \n并没有通知人头马公司。`
        );
        fsDialog.clearDialog();
    }
    // 如果有遗留物, 进入遗留物检查环节
    if (gameData.legacy.humanCorpse > 0) {
        await printTextAndWaitForClick(
            `Later, you find a box in the room, which seems to be left over from the previous occupant.`,
            `之后, 你又在房间里发现了一个箱子, \n似乎是前住户遗留下来的。`
        );
        await printTextAndWaitForClick(
            `Out of curiosity, you turned it on.`,
            `出于好奇, 你将它打开了。`
        );
        if (gameData.legacy.humanCorpse > 0) {
            await printTextAndWaitForClick(
                `【 Human corpse: ${gameData.legacy.humanCorpse} 】`,
                `【人的尸体： ${gameData.legacy.humanCorpse} 】`
            );
        }
        fsDialog.clearDialog();
        gameData.player.sanity -= 5;
        await printTextAndWaitForClick(
            `【 Sanity - ${5}. Currently ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nA strange smell stimulates you.`,
            `【理智 - ${5} 。当前为 ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n一股异味刺激着你。`
        );
        await printTextAndWaitForClick(
            `You pinch your nose and jerk away, as far away from the box as you can.`,
            `你捏住鼻子猛地跳开, 尽可能地离箱子远远的。`
        );
        await printTextAndWaitForClick(
            `What should you do?`,
            `你该怎么办？`
        );
        printClickableText(
            `- Decompose the corpse`,
            `- 分解尸体`,
            async () => {
                fsDialog.clearDialog();
                gameData.item.CorpsePieces += gameData.legacy.humanCorpse * 10;
                const decreaseSanity = gameData.legacy.humanCorpse * 50 > gameData.player.sanity ? gameData.player.sanity : gameData.legacy.humanCorpse * 50;
                gameData.player.sanity -= decreaseSanity;
                await printTextAndWaitForClick(
                    `【 Corpse + ${gameData.legacy.humanCorpse * 10}. Currently: ${gameData.item.CorpsePieces} 】`,
                    `【尸块 + ${gameData.legacy.humanCorpse * 10} 。当前为: ${gameData.item.CorpsePieces} 】`
                );
                await printTextAndWaitForClick(
                    `【 Sanity - ${decreaseSanity}. Currently: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nYour mental state is not very good.`,
                    `【理智 - ${decreaseSanity} 。当前为: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n你的精神状态有些不太好。`
                );
                fsDialog.clearDialog();
                gameData.legacy.humanCorpse = 0;
            }
        );
        printClickableText(
            `- Turn over the corpse`,
            `- 将尸体上缴`,
            async () => {
                fsDialog.clearDialog();
                gameData.player.credibility += gameData.legacy.humanCorpse * 30;
                await printTextAndWaitForClick(
                    `You close the box and put it at the door, go back to the room and wash your hands, and the box is gone.`,
                    `你将箱子关好并放在门口, 回到房间里洗手的功夫, 箱子就消失了。`
                );
                await printTextAndWaitForClick(
                    `In its place was a note that read:`,
                    `取而代之的是一张纸条, 上面写着：`
                );
                await printTextAndWaitForClick(
                    `"We are ashamed that the room was not cleaned effectively."`,
                    `“房间未能得到有效清洁, 我们深感惭愧。”`
                );
                await printTextAndWaitForClick(
                    `"Thank you sincerely for your great help."`,
                    `“真挚地感谢您的大力帮助。”`
                );
                await printTextAndWaitForClick(
                    `【 Reputation + ${gameData.player.credibility} 】\nIt seems to be appreciated by the Rentouma Company.`,
                    `【信誉 + ${gameData.player.credibility} 】\n似乎得到了人头马公司的赞赏。`
                );
                fsDialog.clearDialog();
                gameData.legacy.humanCorpse = 0;
            }
        );
        // 等待尸体处理
        while (gameData.legacy.humanCorpse > 0) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 100);
            });
        }
    }
    // 如果有有害物词条, 进入有害物词条检查环节
    if (gameData.collection.smilingAngel_1 || gameData.collection.smilingAngel_2) {
        await printTextAndWaitForClick(
            `In the corner of the living room, there is a bunch of lifeless flowers.`,
            `客厅的桌角, 摆放着一捧毫无生气的花。`
        );
        await printTextAndWaitForClick(
            `I don't know how long it has been left on, there is neither rancid nor aromatic.`,
            `不知道放了多久, 既无腐臭, 也无芳香。`
        );
        await printTextAndWaitForClick(
            `At the bottom of the container, there was a piece of paper with a scribbled note on it.`,
            `容器的底部, 压着一片纸条, 上头有一段字迹潦草的笔记。`
        );
        fsDialog.clearDialog();
        // 是否已处理笔记
        let isNoteProcessed = false;
        printClickableText(
            `- Read the note`,
            `- 阅读笔记`,
            async () => {
                fsDialog.clearDialog();
                if (gameData.collection.smilingAngel_1) {
                    await printTextAndWaitForClick(
                        `【 Collection: Smiling Angel Part 1 】\nIt loves us wholeheartedly and sincerely. Carescing, licking, and sexual intercourse are not enough, only by truly blending together can we return this love.`,
                        `【有害物词条： 微笑天使 part1】\n它全心全意, 由衷地爱着我们。抚摸, 舔舐, 性交尚不足以, 唯有真正融为一体, 方能回报这份恋心。`
                    );
                }
                if (gameData.collection.smilingAngel_2) {
                    await printTextAndWaitForClick(
                        `【 Collection: Smiling Angel Part 2 】\nIt still can't understand why anyone would reject its love. How bitter lovesickness is! It spends its time in loveless satiety, mournfully waiting for the next dawn.`,
                        `【有害物词条： 微笑天使 part2】\n它至今无法明白, 为何会有人拒绝了它的爱情。相思何其苦涩！它在无爱的饱腹中虚度光阴, 哀愁地等待下一个黎明。`
                    );
                }
                fsDialog.clearDialog();
                await printTextAndWaitForClick(
                    `...... Somewhat inexplicable.`,
                    `......有些莫名其妙。`
                );
                await printTextAndWaitForClick(
                    `Maybe other residents stayed.`,
                    `也许是其它住户留下来的。`
                );
                await printTextAndWaitForClick(
                    `You put the notes back in their place.`,
                    `你将笔记放回原处。`
                );
                fsDialog.clearDialog();
                isNoteProcessed = true;
            }
        )
        printClickableText(
            `- Throw away the note`,
            `- 丢弃笔记`,
            async () => {
                fsDialog.clearDialog();
                await printTextAndWaitForClick(
                    `You threw your notes in the trash.`,
                    `你将笔记丢进了垃圾桶。`
                );
                await printTextAndWaitForClick(
                    `You don't have to know everything.`,
                    `并不是什么都要知道。`
                );
                await printTextAndWaitForClick(
                    `You think so.`,
                    `你这么认为。`
                );
                fsDialog.clearDialog();
                isNoteProcessed = true;
            }
        )
        // 等待笔记处理
        while (!isNoteProcessed) {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 100);
            });
        }
    }
    await printTextAndWaitForClick(
        `【 Time: ${gameData.system.currentTime} o'clock 】\nYou have been busy moving, and it was already night.`,
        `【时间：${gameData.system.currentTime} 点】\n一直忙着搬家, 不知不觉, 已经到了晚上。`
    );
    await printTextAndWaitForClick(
        `You can go out and have a look, maybe you can meet new neighbors and say hello.`,
        `可以出去看看, 也许能碰到新的邻居, 打个招呼。`
    );
    // 外出环节
    let isGoOut = false;
    printClickableText(
        `- Go out`,
        `- 外出`,
        async () => {
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                `You open the door, take a step, and a smiling face suddenly appears at your feet.`,
                `你打开门, 迈出一步, 一张笑脸突然出现在你脚边。`
            );
            await printTextAndWaitForClick(
                `A dog grinned, bit through your knee, and dragged you down the hallway.`,
                `一条狗咧着嘴, 咬穿你的膝盖, 将你拖到楼道中。`
            );
            await printTextAndWaitForClick(
                `It throws you to the ground, gently licks your tears, and bites your cheeks.`,
                `它将你扑倒在地, 温柔地舔舐你的泪水, 咬烂了你的脸颊。`
            );
            await printTextAndWaitForClick(
                `Your teeth collide with its teeth, its saliva burns your tongue, and you can't cry out.`,
                `你的牙齿与它的牙齿相撞, 它的唾液烧烂了你的舌头, 你喊不出声了。`
            );
            fsDialog.clearDialog();
            await printTextAndWaitForClick(
                `Its blood-stained smile fills the field of vision, you hear the sound of sucking, and there is a spicy tingling sensation in the eye sockets,`,
                `它染血的微笑充满了视野, 你听见吸吮的声音, 眼窝中传来辛辣的刺痛感。`
            );
            gameData.player.health = 0;
            gameData.story.sledDogDeathSceneI = true;
            gameData.legacy.humanCorpse += 1;
            await printTextAndWaitForClick(
                `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nYou finally realize that its snort is exhaling into your brain.`,
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
                    `在昏暗的光线下, 一条雪白的雪橇犬趴在门前昏昏欲睡。`
                );
                printClickableText(
                    `- Go out`,
                    `- 出门`,
                    async () => {
                        fsDialog.clearDialog();
                        await printTextAndWaitForClick(
                            `You open the door, carefully pass it,`,
                            `你打开门, 小心翼翼地经过它, `
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
                        gameData.player.health = 0;
                        gameData.story.sledDogDeathSceneII = true;
                        gameData.legacy.humanCorpse += 1;
                        await printTextAndWaitForClick(
                            `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nA snow-white sled dog whispered with joy, and it licked the last piece of minced meat with pity,`,
                            `【生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n一条雪白的雪橇犬满心欢喜地低鸣着, 它怜惜地舔尽最后一块碎肉, `
                        );
                        await printTextAndWaitForClick(
                            `Stretch out, and your hair swells up.`,
                            `伸个懒腰, 毛发哗一下膨胀起来。`
                        );
                        await printTextAndWaitForClick(
                            `It wagged its tail, trotted towards the stairs, and left.`,
                            `它摇晃着尾巴, 小步跑向楼梯, 离开了。`
                        );
                        if(gameData.story.sledDogDeathSceneII && !gameData.collection.smilingAngel_1) {
                            gameData.collection.smilingAngel_1 = true;
                            await printTextAndWaitForClick(
                                `Colletion: Smiling Angel Part 2`,
                                `收录有害物词条： 微笑天使 part2`
                            );
                        }
                        // 创建新的世界线
                        await creatNewWorldLine();
                    }
                );
                if (gameData.collection.smilingAngel_1 && gameData.item.CorpsePieces > 0) {
                    printClickableText(
                        `- Feed the corpse pieces`,
                        `- 喂食尸块`,
                        async () => {
                            fsDialog.clearDialog();
                            await printTextAndWaitForClick(
                                `You open the door. Toss it a piece of meat.`,
                                `你打开门。丢给它一块肉。`
                            );
                            await printTextAndWaitForClick(
                                `It lowered its head to sniff, and then slowly ate the meat.`,
                                `它低下头去嗅闻, 而后慢条斯理地将肉吃掉了。`
                            );
                            await printTextAndWaitForClick(
                                `The sled dog licks its lips, stares at you meaningfully for a moment, and turns away.`,
                                `雪橇犬舔舔嘴唇, 意味深长地盯着你看了会儿, 转身离开。`
                            );
                            fsDialog.clearDialog();
                            gameData.item.CorpsePieces -= 1;
                            await printTextAndWaitForClick(
                                `【 Corpse - ${1}. Currently: ${gameData.item.CorpsePieces} 】`,
                                `【尸块 - ${1} 。当前为： ${gameData.item.CorpsePieces} 】`
                            );
                            if(!gameData.collection.smilingAngel_2) {
                                gameData.collection.smilingAngel_2 = true;
                                await printTextAndWaitForClick(
                                    `Collection: Smiling Angel Part 2`,
                                    `收录有害物词条： 微笑天使 part2`
                                );
                            }
                            fsDialog.clearDialog();
                            await printTextAndWaitForClick(
                                `Suddenly, something creepy.`,
                                `突然间, 有些毛骨悚然。`
                            );
                            await printTextAndWaitForClick(
                                `You close the door and go back to the room.`,
                                `你关上门, 回到房间里。`
                            );
                            fsDialog.clearDialog();
                            isGoOut = true;
                        }
                    );
                }
            }
        );
    }
    while (!isGoOut) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 100);
        });
    }
    await printTextAndWaitForClick(
        `..`,
        `..`
    );
    await printTextAndWaitForClick(
        `....`,
        `....`
    );
    await printTextAndWaitForClick(
        `......`,
        `......`
    );
    // 消耗8小时的食物
    gameData.player.food -= gameData.player.foodConsumePerHour * 8;
    await printTextAndWaitForClick(
        `【 Food - ${gameData.player.foodConsumePerHour * 8}. Currently: ${gameData.player.food} / ${gameData.player.foodMax} 】\nAfter a simple dinner solution in the living room, you return to the bedroom. `,
        `【存粮 - ${gameData.player.foodConsumePerHour * 8} 。当前为： ${gameData.player.food} / ${gameData.player.foodMax} 】\n在客厅简单解决掉晚饭后, 你回到了卧室。`
    );
    await printTextAndWaitForClick(
        `Although you are staying in a shared room, you don't see your roommates for a whole day.`,
        `虽说是以合租的形式入住, 但你整整一天都没有见到室友。`
    );
    await printTextAndWaitForClick(
        `There were three rooms with the doors tightly closed, and it didn't seem like anyone was there.`,
        `有三个房间的门紧紧地关着, 里面似乎也不像是有人在的样子。`
    );
    await printTextAndWaitForClick(
        `You think, maybe they're office workers and they're not at home during the day.`,
        `你想, 也许他们都是上班族, 白天都不在家。`
    );
    await printTextAndWaitForClick(
        `You're lying in bed, thinking about what happened today.`,
        `你躺在床上, 想着今天发生的事情。`
    );
    await printTextAndWaitForClick(
        `It's not good here, like the mutilated body that was found. But right now, there's nowhere else to go.`,
        `虽然这里很不妙, 比如发现的那具残破尸体。\n但眼下，也没有其它的去处了。`
    );
    await printTextAndWaitForClick(
        `Anyway, hide here for a while.`,
        `总之，先在这里躲上一阵子。`
    );
    await printTextAndWaitForClick(
        `Determined, you close your eyes and fall asleep.`,
        `下定决心的你，闭上眼睛, 进入了梦乡。`
    );
    fsDialog.clearDialog();
    // 消耗8小时的睡眠
    const increaseSanity = gameData.player.sanityIncreasePerHour * 8 > gameData.player.sanityMax - gameData.player.sanity ? gameData.player.sanityMax - gameData.player.sanity : gameData.player.sanityIncreasePerHour * 8;
    gameData.player.sanity += increaseSanity;
    await printTextAndWaitForClick(
        `【 Sanity + ${increaseSanity}. Currently: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】`,
        `【理智 + ${increaseSanity} 。当前为： ${gameData.player.sanity} / ${gameData.player.sanityMax} 】`
    );
    await printTextAndWaitForClick(
        `When you wake up, it's the next morning.`,
        `你醒来时, 已经是第二天的早上了。`
    );
    await printTextAndWaitForClick(
        `Follow-up content is still in production, so stay tuned~`,
        `剩下的内容仍在制作中, 敬请期待~`
    );
};

// 异步运行
process();
