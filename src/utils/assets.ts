import { sound } from '@pixi/sound';
import { image } from '../core/image';
import { Assets } from 'pixi.js';

/** Initialise and start background loading of all assets */
export async function initAssets() {
    // Load sound assets
    sound.add('primary-button-press', 'app://assets/audio/primary-button-press.wav');
    sound.add('sightless-storm-ii', 'app://assets/audio/sightless-storm-ii.mp3');
    sound.add('sfx_print', 'app://assets/audio/sfx_print.mp3');

    // Load image assets
    await image.add('play-btn-up', 'app://assets/images/play-btn-up.png');
    await image.add('play-btn-down', 'app://assets/images/play-btn-down.png');
    await image.add('player', 'app://assets/images/player.png');

    // Load font assets
    await Assets.load('app://assets/fonts/Ma_Shan_Zheng/Ma_Shan_Zheng.ttf');
    await Assets.load('app://assets/fonts/ZCOOL_XiaoWei/ZCOOL_XiaoWei.ttf');
}
