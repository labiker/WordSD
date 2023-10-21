import { Container, Sprite } from 'pixi.js';
import { gsap } from 'gsap/gsap-core';
import { AppScene } from '../AppScene';
import { i18n } from '../../utils/i18n';
import { PrimaryButton } from '../../ui/buttons/PrimaryButton';
import { image } from '../../core/image';
import { designConfig } from '../designConfig';
import { TitleText } from './TitleText';
import { Player } from './Player';
import { DayOne } from '../DayOne/DayOne';
import { app } from '../../utils/app';

/** The scene presented at the start, after loading. */
export class Title extends Container implements AppScene {
    /** A unique identifier for the screen */
    public static SCREEN_ID = 'title';

    private _titleText!: TitleText;
    private _player!: Player;
    private _forkBtn!: PrimaryButton;
    private _playBtn!: PrimaryButton;
    /** A container to group visual elements for easier animation */
    private _topAnimContainer = new Container();
    /** A container to group visual elements for easier animation */
    private _midAnimContainer = new Container();
    /** A container to group visual elements for easier animation */
    private _bottomAnimContainer = new Container();

    constructor() {
        super();

        // Add the title text
        this._titleText = new TitleText();
        this._topAnimContainer.addChild(this._titleText.view);

        // Add the player
        this._player = new Player();
        this._midAnimContainer.addChild(this._player.view);

        // Add the buttons
        this._buildButtons();

        // Add all parent containers to screen
        this.addChild(this._topAnimContainer, this._midAnimContainer, this._bottomAnimContainer);
    }

    /** Called before `show` function, can receive `data` */
    public prepare()
    {
        // Reset the positions of the group containers
        gsap.set(this._topAnimContainer, { y: -350 });
        gsap.set(this._midAnimContainer, {x: 200 });
        gsap.set(this._bottomAnimContainer, {y: 350 });
    }

    /** Called when the screen is being shown. */
    public async show()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Reset screen data
        this.alpha = 0;

        // Tween screen into being visible
        await gsap.to(this, { alpha: 1, duration: 0.2, ease: 'linear' });

        // The data to be used in the upcoming tweens
        const endData = {
            x: 0,
            y: 0,
            duration: 0.75,
            ease: 'elastic.out(1, 0.5)',
        };

        // Tween the containers back to their original position
        gsap.to(this._topAnimContainer, endData);
        gsap.to(this._midAnimContainer, endData);
        gsap.to(this._bottomAnimContainer, endData);
    }

    /** Called when the screen is being hidden. */
    public async hide()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Tween screen into being invisible
        await gsap.to(this, { alpha: 0, duration: 0.2, ease: 'linear' });
    }

    /**
     * Gets called every time the screen resizes.
     * @param w - width of the screen.
     * @param h - height of the screen.
     */
    public resize(w: number, h: number) {
        // Set visuals to their respective locations
        this._titleText.resize(w, h);

        this._player.view.x = w * 0.73;
        this._player.view.y = h * 0.7;

        this._playBtn.x = w * 0.88;
        this._playBtn.y = h * 0.7;

        this._forkBtn.x = w - 55;
        this._forkBtn.y = h - 40 + this._forkBtn.height * 0.5 - 5;

        // Set hit area of hit container to fit screen
        // Leave a little room to prevent interaction bellow the cannon
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

    /** Add buttons to screen. */
    private _buildButtons()
    {
        // Add the forkGithub button
        const defaultViewContainer = new Container();
        defaultViewContainer.addChild(new Sprite(image.find('wordsd-btn-up')));
        const pressedViewContainer = new Container();
        pressedViewContainer.addChild(new Sprite(image.find('wordsd-btn-down')));
        this._forkBtn = new PrimaryButton({
            text: i18n.t('forkGithub'),
            textStyle: {
                fill: 0xe91e63,
                fontFamily: 'Opensans Semibold',
                fontWeight: 'bold',
                align: 'center',
                fontSize: 16,
            },
            buttonOptions: {
                defaultView: defaultViewContainer,
                pressedView: pressedViewContainer,
                textOffset: {
                    default: {
                        y: -13,
                    },
                    pressed: {
                        y: -8,
                    },
                },
            },
        });
        this._forkBtn.onPress.connect(() => {
            window.open(designConfig.forkMeURL, '_blank')?.focus();
        });
        this._bottomAnimContainer.addChild(this._forkBtn);

        // Add the play game button
        this._playBtn = new PrimaryButton({
            text: i18n.t('playButton'),
        });

        this._playBtn.onPress.connect(async () => {
            // Go to game screen when user presses play button
            await this.remove();
            const sceneDayOne = new DayOne();
            app.stage.addChild(sceneDayOne);
            sceneDayOne.resize(app.view.width, app.view.height);
        });

        this._bottomAnimContainer.addChild(this._playBtn);
    }
}