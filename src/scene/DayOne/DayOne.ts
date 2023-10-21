import { gameData } from '../gameData';
import { gsap } from 'gsap/gsap-core';
import { FullScreenDialog } from '../../utils/FullScreenDialog/FullScreenDialog';
import { BackLog } from '../../utils/Backlog/BackLog';
import { bgm, sfx } from '../../utils/audio';
import { Container } from 'pixi.js';
import { AppScene } from '../AppScene';
import { app } from '../../utils/app';
import { Title } from '../Title/Title';

/** The scene class for the DayOne scene */
export class DayOne extends Container implements AppScene {
    /** A container to group full screen dialog elements */
    private _fsDialog = new FullScreenDialog();
    /** A container to group backlog elements */
    private _backLog = new BackLog();

    constructor() {
        super();

        this._backLog.autoRecordText = true;
        this._backLog.observeTextChanges(this._fsDialog.view);

        // 为使模块之间能够不冲突，进行一些循环检测。
        setInterval(() => {
            if (this._backLog.isShowing) {
                this._fsDialog.enableGlobalKeyDetection = false;
            } else {
                this._fsDialog.enableGlobalKeyDetection = true;
            }
        }, 10);

        this.addChild(this._fsDialog.view, this._backLog.view);

        // Execute the default script
        this.process();
    }

    /**
     * 宏
     * @param enText 英文文本
     * @param zhcnText 中文文本
     * @param type 文本类型
     * @note 检测语言和文本类型, 打印对应文本的同时循环播放音效, 结束后等待点击。
     */
    private _printTextAndWC = async (
        enText: string,
        zhcnText: string,
        type?: 'warning' | 'hint',
    ) => {
        const text = gameData.system.language === 'en' ? enText : zhcnText;
        // 仅在非快进模式时, 才有声音
        sfx.play('sfx_print', { loop: true });
        await this._fsDialog.printTextAsync(text, type);
        sfx.stop('sfx_print');
        await this._fsDialog.waitForClick();
    };

    /**
     * 宏
     * @param enText 英文文本
     * @param zhcnText 中文文本
     * @note 检测语言, 输出对应可点击文本。
     */
    private _printClickableText = async (enText: string, zhcnText: string, func: () => void) => {
        const text = gameData.system.language === 'en' ? enText : zhcnText;
        this._fsDialog.printClickableText(text, func);
    };

    public process = async () => {
        // 选择语言
        this._fsDialog.printClickableText('English version', () => {
            gameData.system.language = 'en';
        });
        this._fsDialog.printClickableText('中文版', () => {
            gameData.system.language = 'zhcn';
        });
        // 等待语言选择
        await this._fsDialog.waitFor(() => gameData.system.language !== '');
        this._fsDialog.clearDialog();
        await this._printTextAndWC('Welcome to WordSD!', '欢迎来到 WordSD!');
        await this._printTextAndWC(
            'Press F11 to enter full screen mode for the best gaming experience.',
            '按下 F11 进入全屏模式以获得最好的游戏体验。',
        );
        this._fsDialog.clearDialog();
        await this._creatNewWorldLine();
    };

    private _creatNewWorldLine = async () => {
        // 重置玩家属性
        this._resetPlayerStatus();
        this._fsDialog.clearDialog();
        await bgm.play('sightless-storm-ii');

        await this._printTextAndWC(
            'For various reasons, you have to find a place to hide.',
            '因为种种原因, 你不得不找个地方避避风头。',
        );
        await this._printTextAndWC(
            'Just then, you received a phone call.',
            '就在这时, 你收到了一个电话。',
        );
        this._fsDialog.clearDialog();
        await this._printTextAndWC(
            '"The Rentouma Company will provide you with the most thoughtful service."',
            '“人头马公司将竭诚为您, 提供最周到的服务。”',
        );
        this._fsDialog.clearDialog();
        await this._printTextAndWC(
            'In less than a week, you moved into the apartment arranged by the Rentouma Company.',
            '不到一周, 你就搬进了人头马公司安排的公寓。',
        );
        await this._printTextAndWC(
            `【 Day ${gameData.system.currentDay} 】\nToday is the day you moved in.`,
            `【 第 ${gameData.system.currentDay} 天 】\n今天是入住日。`,
        );
        await this._printTextAndWC(
            `Maybe you can stay for 【 ${gameData.system.totlaDays} days 】 first, \nsee the situation, and then decide whether to stay for a long time.`,
            `也许可以先住到【 第 ${gameData.system.totlaDays} 天 】, \n看看情况, 再决定要不要长住。`,
        );
        this._fsDialog.clearDialog();
        await this._printTextAndWC(
            `【 Food: ${gameData.player.food} / ${gameData.player.foodMax} 】\nAlthough the trip was hasty, you still remembered to bring some food.`,
            `【 存粮： ${gameData.player.food} / ${gameData.player.foodMax} 】\n尽管此行匆忙, 但你还是记得带上了一些食物。`,
        );
        await this._printTextAndWC(
            `【 Sanity: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nThe inherent breath of the room always makes people breathless.`,
            `【 理智： ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n房间固有的气息总有些让人喘不过气。`,
        );
        await this._printTextAndWC(
            `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nBut it's better than being killed by someone unknown outside.`,
            `【 生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n但也好过在外头被不知名的某人夺了性命。`,
        );
        this._fsDialog.clearDialog();
        // 如果有道具, 进入道具检查环节
        await this._checkItem();
        // 如果有遗留物, 进入遗留物检查环节
        await this._checkLegacy();
        // 如果有收集物, 进入收集物检查环节
        await this._checkCollection();
        await this._printTextAndWC(
            `【 Time: ${gameData.system.currentTime} o'clock 】\nYou have been busy moving, and it was already night.`,
            `【 时间：${gameData.system.currentTime} 点 】\n一直忙着搬家, 不知不觉, 已经到了晚上。`,
        );
        await this._printTextAndWC(
            'You can go out and have a look, maybe you can meet new neighbors and say hello.',
            '可以出去看看, 也许能碰到新的邻居, 打个招呼。',
        );
        // 雪橇犬事件
        await this._sledDogScene();
        // 晚餐环节
        await this._dinnerPhase();
        // 入住日结算环节
        await this._dayEndPhase();
    };

    private _resetPlayerStatus = () => {
        gameData.player.health = gameData.player.healthMax;
        gameData.player.sanity = gameData.player.sanityMax;
        gameData.player.food = gameData.player.foodMax;
        gameData.player.credibility = 0;
        gameData.player.isNoteProcessed = false;
    };

    /** Called when the screen is being hidden. */
    public async hide()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Tween screen into being invisible
        await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
    }

    /**
     * Remove screen from the stage.
     */
    public async remove()
    {
        // Hide screen if method is available
        if (this.hide)
        {
            await this.hide();
        }

        // Remove screen from its parent (usually app.stage, if not changed)
        if (this.parent)
        {
            this.parent.removeChild(this);
        }
    }

    private _deadAndReturnToTitle = async () => {
        await this.remove();
        const sceneTitle = new Title();
        app.stage.addChild(sceneTitle);
        sceneTitle.resize(app.view.width, app.view.height);
    };

    /**
     * Gets called every time the screen resizes.
     * @param w - width of the screen.
     * @param h - height of the screen.
     */
    public resize(w: number, h: number) {
        this._fsDialog.resize(w, h);
        /* this._fsDialog.view.width = w;
        this._fsDialog.view.height = h;
        this._backLog.view.width = w;
        this._backLog.view.height = h; */
        // Set visuals to their respective locations
        /* this._titleText.view.x = w * 0.83;
        this._titleText.view.y = 160;

        this._player.view.x = w * 0.73;
        this._player.view.y = h * 0.7;

        this._playBtn.x = w * 0.88;
        this._playBtn.y = h * 0.7;

        this._forkBtn.x = w - 55;
        this._forkBtn.y = h - 40 + this._forkBtn.height * 0.5 - 5; */

        // Set hit area of hit container to fit screen
        // Leave a little room to prevent interaction bellow the cannon
    }

    private _checkItem = async () => {
        if (gameData.item.CorpsePieces > 0) {
            await this._printTextAndWC(
                'By chance, you find something strange in the room...',
                '偶然间, 你发现房间里有一些奇怪的东西......',
            );
            await this._printTextAndWC(
                `【 Corpse pieces (Item): ${gameData.item.CorpsePieces} 】`,
                `【 尸块（道具）： ${gameData.item.CorpsePieces} 】`,
                'hint',
            );
            await this._printTextAndWC(
                'Considering that it might come in handy, you put them back where they were, and didn\'t inform the Rentouma Company.',
                '考虑到也许能派上用处, 你将它们放回了原地, \n并没有通知人头马公司。',
            );
            this._fsDialog.clearDialog();
        }
    };

    private _checkLegacy = async () => {
        if (gameData.legacy.humanCorpse > 0) {
            await this._printTextAndWC(
                'Later, you find a box in the room, which seems to be left over from the previous occupant.',
                '之后, 你又在房间里发现了一个箱子, \n似乎是前住户遗留下来的。',
            );
            await this._printTextAndWC(
                'Out of curiosity, you turned it on.',
                '出于好奇, 你将它打开了。',
            );
            if (gameData.legacy.humanCorpse > 0) {
                await this._printTextAndWC(
                    `【 Human corpse: ${gameData.legacy.humanCorpse} 】`,
                    `【 人的尸体： ${gameData.legacy.humanCorpse} 】`,
                    'hint',
                );
            }
            this._fsDialog.clearDialog();
            gameData.player.sanity -= 5;
            await this._printTextAndWC(
                `【 Sanity - ${5}. Currently ${gameData.player.sanity} / ${
                    gameData.player.sanityMax
                } 】\nA strange smell stimulates you.`,
                `【 理智 - ${5} 。当前为: ${gameData.player.sanity} / ${
                    gameData.player.sanityMax
                } 】\n一股异味刺激着你。`,
                'warning',
            );
            await this._printTextAndWC(
                'You pinch your nose and jerk away, as far away from the box as you can.',
                '你捏住鼻子猛地跳开, 尽可能地离箱子远远的。',
            );
            await this._printTextAndWC('What should you do?', '你该怎么办？');
            this._printClickableText('- Decompose the corpse', '- 分解尸体', async () => {
                this._fsDialog.clearDialog();
                gameData.item.CorpsePieces += gameData.legacy.humanCorpse * 10;
                const decreaseSanity =
                    gameData.legacy.humanCorpse * 50 > gameData.player.sanity
                        ? gameData.player.sanity
                        : gameData.legacy.humanCorpse * 50;
                gameData.player.sanity -= decreaseSanity;
                await this._printTextAndWC(
                    `【 Corpse pieces (Item) + ${gameData.legacy.humanCorpse * 10}. Currently: ${
                        gameData.item.CorpsePieces
                    } 】`,
                    `【 尸块（道具） + ${gameData.legacy.humanCorpse * 10} 。当前为: ${
                        gameData.item.CorpsePieces
                    } 】`,
                    'hint',
                );
                await this._printTextAndWC(
                    `【 Sanity - ${decreaseSanity}. Currently: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\nYour mental state is not very good.`,
                    `【 理智 - ${decreaseSanity} 。当前为: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】\n你的精神状态有些不太好。`,
                    'warning',
                );
                this._fsDialog.clearDialog();
                gameData.legacy.humanCorpse = 0;
            });
            this._printClickableText('- Turn over the corpse', '- 将尸体上缴', async () => {
                this._fsDialog.clearDialog();
                await this._printTextAndWC(
                    'You close the box and put it at the door, go back to the room and wash your hands, and the box is gone.',
                    '你将箱子关好并放在门口, 回到房间里洗手的功夫, 箱子就消失了。',
                );
                await this._printTextAndWC(
                    'In its place was a note that read:',
                    '取而代之的是一张纸条, 上面写着：',
                );
                await this._printTextAndWC(
                    '"We are ashamed that the room was not cleaned effectively."',
                    '“房间未能得到有效清洁, 我们深感惭愧。”',
                );
                await this._printTextAndWC(
                    '"Thank you sincerely for your great help."',
                    '“真挚地感谢您的大力帮助。”',
                );
                gameData.player.credibility += gameData.legacy.humanCorpse * 30;
                await this._printTextAndWC(
                    `【 Reputation + ${gameData.player.credibility} 】\nIt seems to be appreciated by the Rentouma Company.`,
                    `【 信誉 + ${gameData.legacy.humanCorpse * 30} , 当前为: ${
                        gameData.player.credibility
                    } 】\n似乎得到了人头马公司的赞赏。`,
                    'hint',
                );
                this._fsDialog.clearDialog();
                gameData.legacy.humanCorpse = 0;
            });
            // 等待尸体处理
            await this._fsDialog.waitFor(() => gameData.legacy.humanCorpse <= 0);
        }
    };

    private _checkCollection = async () => {
        if (gameData.collection.smilingAngel_1 || gameData.collection.smilingAngel_2) {
            await this._printTextAndWC(
                'In the corner of the living room, there is a bunch of lifeless flowers.',
                '客厅的桌角, 摆放着一捧毫无生气的花。',
            );
            await this._printTextAndWC(
                'You don\'t know how long it has been left on, there is neither rancid nor aromatic.',
                '不知道放了多久, 既无腐臭, 也无芳香。',
            );
            await this._printTextAndWC(
                'At the bottom of the container, there was a piece of paper with a scribbled note on it.',
                '容器的底部, 压着一片纸条, 上头有一段字迹潦草的笔记。',
            );
            this._fsDialog.clearDialog();
            this._printClickableText('- Read the note', '- 阅读笔记', async () => {
                this._fsDialog.clearDialog();
                if (gameData.collection.smilingAngel_1) {
                    await this._printTextAndWC(
                        '【 Collection: Smiling Angel Part 1 】\nIt loves us wholeheartedly and sincerely. Carescing, licking, and sexual intercourse are not enough, only by truly blending together can we return this love.',
                        '【 有害物词条： 微笑天使 part1 】\n它全心全意, 由衷地爱着我们。抚摸, 舔舐, 性交尚不足以, 唯有真正融为一体, 方能回报这份恋心。',
                    );
                }
                if (gameData.collection.smilingAngel_2) {
                    await this._printTextAndWC(
                        '【 Collection: Smiling Angel Part 2 】\nIt still can\'t understand why anyone would reject its love. How bitter lovesickness is! It spends its time in loveless satiety, mournfully waiting for the next dawn.',
                        '【 有害物词条： 微笑天使 part2 】\n它至今无法明白, 为何会有人拒绝了它的爱情。\n相思何其苦涩！\n它在无爱的饱腹中虚度光阴, 哀愁地等待下一个黎明。',
                    );
                }
                this._fsDialog.clearDialog();
                await this._printTextAndWC('...... Somewhat inexplicable.', '......有些莫名其妙。');
                await this._printTextAndWC(
                    'Maybe other residents stayed.',
                    '也许是其它住户留下来的。',
                );
                await this._printTextAndWC(
                    'You put the notes back in their place.',
                    '你将笔记放回原处。',
                );
                this._fsDialog.clearDialog();
                gameData.player.isNoteProcessed = true;
            });
            this._printClickableText('- Throw away the note', '- 丢弃笔记', async () => {
                this._fsDialog.clearDialog();
                await this._printTextAndWC(
                    'You threw your notes in the trash.',
                    '你将笔记丢进了垃圾桶。',
                );
                await this._printTextAndWC(
                    'You don\'t have to know everything.',
                    '并不是什么都要知道。',
                );
                await this._printTextAndWC('You think so.', '你这么认为。');
                this._fsDialog.clearDialog();
                gameData.player.isNoteProcessed = true;
            });
            // 等待笔记处理
            await this._fsDialog.waitFor(() => gameData.player.isNoteProcessed);
        }
    };

    private _sledDogScene = async () => {
        let sledDogSceneClear = false;
        this._printClickableText('- Go out', '- 外出', async () => {
            this._fsDialog.clearDialog();
            await this._printTextAndWC(
                'You open the door, take a step, and a smiling face suddenly appears at your feet.',
                '你打开门, 迈出一步, 一张笑脸突然出现在你脚边。',
            );
            await this._printTextAndWC(
                'A dog grinned, bit through your knee, and dragged you down the hallway.',
                '一条狗咧着嘴, 咬穿你的膝盖, 将你拖到楼道中。',
            );
            await this._printTextAndWC(
                'It throws you to the ground, gently licks your tears, and bites your cheeks.',
                '它将你扑倒在地, 温柔地舔舐你的泪水, 咬烂了你的脸颊。',
            );
            await this._printTextAndWC(
                'Your teeth collide with its teeth, its saliva burns your tongue, and you can\'t cry out.',
                '你的牙齿与它的牙齿相撞, 它的唾液烧烂了你的舌头, 你喊不出声了。',
            );
            this._fsDialog.clearDialog();
            await this._printTextAndWC(
                'Its blood-stained smile fills the field of vision, you hear the sound of sucking, and there is a spicy tingling sensation in the eye sockets,',
                '它染血的微笑充满了视野, 你听见吸吮的声音, \n眼窝中传来辛辣的刺痛感。',
            );
            gameData.player.health = 0;
            gameData.story.sledDogDeathSceneI = true;
            gameData.legacy.humanCorpse += 1;
            await this._printTextAndWC(
                `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nYou finally realize that its snort is exhaling into your brain.`,
                `【 生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n你最后意识到它的鼻息呼入了脑颅。`,
                'warning',
            );
            // 创建新的世界线
            // await this._creatNewWorldLine();
            await this._deadAndReturnToTitle();
        });
        if (gameData.story.sledDogDeathSceneI) {
            this._printClickableText('- View the door eye', '- 查看门眼', async () => {
                this._fsDialog.clearDialog();
                await this._printTextAndWC(
                    'In the dim light, a snow-white sled dog sleepily lies in front of the door.',
                    '在昏暗的光线下, 一条雪白的雪橇犬趴在门前昏昏欲睡。',
                );
                this._printClickableText('- Go out', '- 出门', async () => {
                    this._fsDialog.clearDialog();
                    await this._printTextAndWC(
                        'You open the door, carefully pass it,',
                        '你打开门, 小心翼翼地经过它, ',
                    );
                    await this._printTextAndWC(
                        'It lifted its face and grinned.',
                        '它抬起脸来咧嘴笑了。',
                    );
                    await this._printTextAndWC(
                        'It then bites off your knee.',
                        '它接着咬断了你的膝盖。',
                    );
                    await this._printTextAndWC('..', '..');
                    await this._printTextAndWC('....', '....');
                    await this._printTextAndWC('......', '......');
                    gameData.player.health = 0;
                    gameData.story.sledDogDeathSceneII = true;
                    gameData.legacy.humanCorpse += 1;
                    await this._printTextAndWC(
                        `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nA snow-white sled dog whispered with joy, and it licked the last piece of minced meat with pity,`,
                        `【 生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n一条雪白的雪橇犬满心欢喜地低鸣着, \n它怜惜地舔尽最后一块碎肉, `,
                        'warning',
                    );
                    await this._printTextAndWC(
                        'Stretch out, and your hair swells up.',
                        '伸个懒腰, 毛发哗一下膨胀起来。',
                    );
                    await this._printTextAndWC(
                        'It wagged its tail, trotted towards the stairs, and left.',
                        '它摇晃着尾巴, 小步跑向楼梯, 离开了。',
                    );
                    if (gameData.story.sledDogDeathSceneII && !gameData.collection.smilingAngel_1) {
                        gameData.collection.smilingAngel_1 = true;
                        await this._printTextAndWC(
                            'Colletion: Smiling Angel Part 1',
                            '收录有害物词条： 微笑天使 part1',
                            'hint',
                        );
                    }
                    // 创建新的世界线
                    // await this._creatNewWorldLine();
                    await this._deadAndReturnToTitle();
                });
                if (gameData.collection.smilingAngel_1 && gameData.item.CorpsePieces > 0) {
                    this._printClickableText(
                        '- Feed the corpse pieces (Item)',
                        '- 喂食尸块（道具）',
                        async () => {
                            this._fsDialog.clearDialog();
                            await this._printTextAndWC(
                                'You open the door. Toss it a piece of meat.',
                                '你打开门。丢给它一块肉。',
                            );
                            await this._printTextAndWC(
                                'It lowered its head to sniff, and then slowly ate the meat.',
                                '它低下头去嗅闻, 而后慢条斯理地将肉吃掉了。',
                            );
                            await this._printTextAndWC(
                                'The sled dog licks its lips, stares at you meaningfully for a moment, and turns away.',
                                '雪橇犬舔舔嘴唇, 意味深长地盯着你看了会儿, 转身离开。',
                            );
                            this._fsDialog.clearDialog();
                            gameData.item.CorpsePieces -= 1;
                            await this._printTextAndWC(
                                `【 Corpse pieces (Item) - ${1}. Currently: ${
                                    gameData.item.CorpsePieces
                                } 】`,
                                `【 尸块（道具） - ${1} 。当前为: ${gameData.item.CorpsePieces} 】`,
                                'warning',
                            );
                            if (!gameData.collection.smilingAngel_2) {
                                gameData.collection.smilingAngel_2 = true;
                                await this._printTextAndWC(
                                    'Collection: Smiling Angel Part 2',
                                    '收录有害物词条： 微笑天使 part2',
                                    'hint',
                                );
                            }
                            this._fsDialog.clearDialog();
                            await this._printTextAndWC(
                                'Suddenly, something creepy.',
                                '突然间, 有些毛骨悚然。',
                            );
                            await this._printTextAndWC(
                                'You close the door and go back to the room.',
                                '你关上门, 回到房间里。',
                            );
                            this._fsDialog.clearDialog();
                            sledDogSceneClear = true;
                        },
                    );
                }
            });
        }
        await this._fsDialog.waitFor(() => sledDogSceneClear);
    };

    /**
     * 入住日结算环节
     */
    private _dayEndPhase = async () => {
        await this._printTextAndWC(`The ${gameData.system.currentDay} day after check-in is about to end.`, `入住后的第 ${gameData.system.currentDay} 天, 就要结束了。`);
        await this._printTextAndWC('Lying in bed, thinking about what happened so far.', '躺在床上, 思考着至今为止发生过的事情。');
        this._fsDialog.clearDialog();
        // 因 理智 < 50 ，住户违约搬出，触发尾随事件，死亡
        if (gameData.player.sanity < 50) {
            await this._printTextAndWC(
                `【 Sanity: ${
                    gameData.player.sanity
                } < ${50} 】\nThe events encountered were too bizarre, and coupled with the lack of adequate rest, \nthe more you thought about it, the more confused you became.`,
                `【 理智： ${
                    gameData.player.sanity
                } < ${50} 】\n遭遇的事件过于离奇, 加上没有得到充分的休息, \n越是思考越是觉得混乱。`,
                'warning',
            );
            await this._printTextAndWC(
                'Glancing towards the bed and looking at the unpacked suitcase, a dangerous thought forms in your mind.',
                '瞟向床边, 看着尚未收纳的行李箱, \n一种危险的想法在你的脑海中形成。',
            );
            await this._printTextAndWC('You stood up involuntarily and started to pack your things...', '你不由自主地站起身, 开始收拾起东西......');
            this._fsDialog.clearDialog();
            await this._printTextAndWC('..', '..');
            await this._printTextAndWC('....', '....');
            await this._printTextAndWC('......', '......');
            this._fsDialog.clearDialog();
            await this._printTextAndWC('The corridor was eerily quiet late at night.', '深夜的楼道静得有些诡异。');
            await this._printTextAndWC(
                'You kept your footsteps as low as possible and \nwalked through the corridors carrying your \nslightly heavy suitcase.',
                '尽可能地压低脚步声, \n提着稍显沉重的行李箱穿行在走廊间。',
            );
            await this._printTextAndWC(
                'Even so, \nyou feel someone\'s presence in a dark corner behind you.',
                '即便如此, \n总感觉在身后某处黑暗的角落里，有人的气息。',
            );
            this._fsDialog.clearDialog();
            await this._printTextAndWC('Maybe it\'s an illusion.', '也许是错觉吧。');
            await this._printTextAndWC('Too much has happened recently and you are under too much pressure.', '近来发生了太多事，压力太大了。');
            await this._printTextAndWC(
                'You just secretly carried a suitcase out and \nused a false identity when checking in, \nso there would be no problem.',
                '只是偷偷提个行李箱出去，入住时用的也是假身份，不会有问题的。',
            );
            this._fsDialog.clearDialog();
            await this._printTextAndWC('There will be no problem. ', '不会有问题的。');
            await this._printTextAndWC('Just run away.', '逃走就好了。');
            await this._printTextAndWC('Nothing happened.', '什么都没发生过。');
            this._fsDialog.clearDialog();
            await this._printTextAndWC(
                'As you walk, you start to plan your future \narrangements. Where should you rent an apartment? \nShould you leave the city?',
                '逐渐地，你开始计划起今后的安排。该去哪儿租房，是不是该离开这座城市？',
            );
            await this._printTextAndWC('boom!', '“砰！”');
            this._fsDialog.clearDialog();
            gameData.player.health = 0;
            await this._printTextAndWC(
                `【 Health: ${gameData.player.health} / ${gameData.player.healthMax} 】\nThat was the last sound you heard in this world.`,
                `【 生命： ${gameData.player.health} / ${gameData.player.healthMax} 】\n那是你在这个世界上意识到的最后一声。`,
                'warning',
            );
            gameData.legacy.humanCorpse += 1;
            // await this._creatNewWorldLine();
            await this._deadAndReturnToTitle();
        } else if (gameData.system.currentDay === 1) {
            await this._printTextAndWC('..', '..');
            await this._printTextAndWC('....', '....');
            await this._printTextAndWC('......', '......');
            await this._printTextAndWC(
                'Although you are staying in a shared room, you don\'t see your roommates for a whole day.',
                '虽说是以合租的形式入住, \n但你整整一天都没有见到室友。',
            );
            await this._printTextAndWC(
                'There were three rooms with the doors tightly closed, and it didn\'t seem like anyone was there.',
                '有三个房间的门紧紧地关着, 里面似乎也不像是有人在的样子。',
            );
            await this._printTextAndWC(
                'You think, maybe they\'re office workers and they\'re not at home during the day.',
                '你想, 也许他们都是上班族, 白天都不在家。',
            );
            await this._printTextAndWC(
                'You\'re lying in bed, thinking about what happened today.',
                '你躺在床上, 想着今天发生的事情。',
            );
            await this._printTextAndWC(
                'It\'s not good here, like the mutilated body that was found. But right now, there\'s nowhere else to go.',
                '虽然这里很不妙, 比如发现的那具残破尸体。\n但眼下，也没有其它的去处了。',
            );
            await this._printTextAndWC(
                'Anyway, hide here for a while.',
                '总之，先在这里躲上一阵子。',
            );
            await this._printTextAndWC(
                'Determined, you close your eyes and fall asleep.',
                '下定决心的你，闭上眼睛, 进入了梦乡。',
            );
            this._fsDialog.clearDialog();
            // 进入第二天
            await this._secondDay();
        }
    };

    /**
     * 晚餐环节
     */
    private _dinnerPhase = async () => {
        await this._printTextAndWC('It\'s time for dinner.', '到了晚餐时间。');
        // 消耗8小时的食物
        gameData.player.food -= gameData.player.foodConsumePerHour * 8;
        await this._printTextAndWC(
            `【 Food - ${gameData.player.foodConsumePerHour * 8}. Currently: ${
                gameData.player.food
            } / ${
                gameData.player.foodMax
            } 】\nAfter a simple dinner solution in the living room, you return to the bedroom. `,
            `【 存粮 - ${gameData.player.foodConsumePerHour * 8} 。当前为: ${
                gameData.player.food
            } / ${gameData.player.foodMax} 】\n在客厅简单解决掉晚饭后, 你回到了卧室。`,
            'warning',
        );
        this._fsDialog.clearDialog();
    };

    private _secondDay = async () => {
        // 消耗8小时的睡眠
        const increaseSanity =
            gameData.player.sanityIncreasePerHour * 8 >
            gameData.player.sanityMax - gameData.player.sanity
                ? gameData.player.sanityMax - gameData.player.sanity
                : gameData.player.sanityIncreasePerHour * 8;
        gameData.player.sanity += increaseSanity;
        await this._printTextAndWC(
            `【 Sanity + ${increaseSanity}. Currently: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】`,
            `【 理智 + ${increaseSanity} 。当前为: ${gameData.player.sanity} / ${gameData.player.sanityMax} 】`,
            'hint',
        );
        await this._printTextAndWC(
            'When you wake up, it\'s the next morning.',
            '你醒来时, 已经是第二天的早上了。',
        );
        await this._printTextAndWC(
            'Follow-up content is still in production, so stay tuned~',
            '剩下的内容仍在制作中, 敬请期待~',
        );
    };
}
