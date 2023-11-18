import { sound } from '@pixi/sound';
import { image } from '../core/image';
import { Assets } from 'pixi.js';

/** Initialise and start background loading of all assets */
export async function initAssets() {
    // Load sound assets
    sound.add('sfx_primary_button_press', 'app://assets/audio/sfx_primary_button_press.mp3');
    sound.add('sfx_button_press', 'app://assets/audio/sfx_button_press.mp3');
    sound.add('sfx_print', 'app://assets/audio/sfx_print.mp3');
    sound.add('sfx_select_button_press', 'app://assets/audio/sfx_select_button_press.mp3');
    sound.add('sightless_storm_ii', 'app://assets/audio/sightless_storm_ii.mp3');
    sound.add('sfx_death_knell', 'app://assets/audio/sfx_death_knell.mp3');
    sound.add('sfx_sleep', 'app://assets/audio/sfx_sleep.mp3');
    sound.add('sfx_item_got', 'app://assets/audio/sfx_item_got.mp3');
    sound.add('sfx_item_lost', 'app://assets/audio/sfx_item_lost.mp3');

    // Load image assets
    await image.add('play_btn_up', 'img://play_btn_up.png');
    await image.add('play_btn_down', 'img://play_btn_down.png');
    await image.add('logo_btn_up', 'img://logo_btn_up.png');
    await image.add('logo_btn_down', 'img://logo_btn_down.png');
    await image.add('player', 'img://player.png');
    await image.add('Health_negative', 'img://Health_negative.png');
    await image.add('Health_positive', 'img://Health_positive.png');
    await image.add('Health', 'img://Health.png');
    await image.add('Stress_level_0', 'img://Stress_level_0.png');
    await image.add('Stress_level_1', 'img://Stress_level_1.png');
    await image.add('Supplies', 'img://Supplies.png');
    await image.add('Friend', 'img://Friend.png');
    await image.add('Best_friend', 'img://Best_friend.png');
    await image.add('Current_day', 'img://Current_day.png');
    await image.add('Current_night', 'img://Current_night.png');
    await image.add('Current_time', 'img://Current_time.png');
    await image.add('Item_human_corpse', 'img://Item_human_corpse.png');
    await image.add('Item_corpse_pieces', 'img://Item_corpse_pieces.png');
    await image.add(
        'Collection_smiling_angel_1',
        'img://Collection_smiling_angel_1.png',
    );
    await image.add(
        'Collection_smiling_angel_2',
        'img://Collection_smiling_angel_2.png',
    );

    // Load font assets
    await Assets.load('app://assets/fonts/Ma_Shan_Zheng/Ma_Shan_Zheng.ttf');
    await Assets.load('app://assets/fonts/ZCOOL_XiaoWei/ZCOOL_XiaoWei.ttf');
}
